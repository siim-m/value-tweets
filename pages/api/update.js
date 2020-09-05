import Twitter from 'twitter-lite';

import connectDb from '../../lib/mongoose';
import Tweet from '../../models/tweet';
import { chunkArray } from '../../lib/helpers';

export default async (req, res) => {
  if (req.headers['x-auth-token'] !== process.env.API_KEY) {
    res.statusCode = 401;
    return res.json({ status: 'unauthorized' });
  }

  if (req.method !== 'PATCH') {
    res.statusCode = 400;
    return res.json({ error: 'Only PATCH is allowed.' });
  }

  await connectDb();

  const user = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  });
  const response = await user.getBearerToken();
  const app = new Twitter({
    bearer_token: response.access_token,
  });

  let deletedCount = 0;
  let updatedCount = 0;

  // Get all tweets in database that are not marked as deleted
  const tweets = await Tweet.find({
    $or: [{ is_deleted: false }, { is_deleted: undefined }],
  });

  // Split into chunks of 100 — maximum number supported by statuses/lookup endpoint
  const tweetChunks = chunkArray(tweets, 100);

  for (const chunk of tweetChunks) {
    const ids = chunk.map(tweet => tweet.id_str);

    const fetchedTweets = await app.get(`statuses/lookup`, {
      id: ids.join(','),
    });

    // Process deleted tweets
    if (chunk.length !== fetchedTweets.length) {
      // logic to handle detection of deleted tweets
      for (const tweet of chunk) {
        const found = fetchedTweets.find(
          fetchedTweet => fetchedTweet.id_str === tweet.id_str
        );
        if (!found) {
          // console.log('Marking as deleted: ', tweet.id_str);
          await Tweet.findOneAndUpdate(
            { id_str: tweet.id_str },
            { is_deleted: true }
          );
          deletedCount += 1;
        }
      }
    }

    // Update stored tweet stats
    for (const fetchedTweet of fetchedTweets) {
      await Tweet.findOneAndUpdate(
        { id_str: fetchedTweet.id_str },
        {
          ...fetchedTweet,
          is_deleted: false,
        }
      );
      updatedCount += 1;
    }
  }

  res.statusCode = 200;
  res.json({ status: 'success', deletedCount, updatedCount });
};
