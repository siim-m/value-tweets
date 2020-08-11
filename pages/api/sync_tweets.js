import Twitter from 'twitter-lite';

import connectDb from '../../lib/mongoose';
import Tweet from '../../models/tweet';

export default async (req, res) => {
  if (req.headers['x-auth-token'] !== process.env.API_KEY) {
    res.statusCode = 401;
    return res.json({ status: 'unauthorized' });
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

  for (let page = 1; page <= 17; page += 1) {
    const fetchedTweets = await app.get('statuses/user_timeline', {
      screen_name: 'visualizevalue',
      tweet_mode: 'extended',
      count: 200,
      page,
    });

    try {
      await Tweet.create(fetchedTweets);
    } catch (err) {
      console.log('Found some duplicates');
    }
  }

  res.statusCode = 200;
  res.json({ status: 'success' });
};
