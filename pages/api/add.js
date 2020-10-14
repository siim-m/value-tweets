import Twitter from 'twitter-lite';

import connectDb from '../../lib/mongoose';
import Tweet from '../../models/tweet';
import { handles } from '../../config';

export default async (req, res) => {
  if (req.headers['x-auth-token'] !== process.env.API_KEY) {
    res.statusCode = 401;
    return res.json({ status: 'unauthorized' });
  }

  if (req.method !== 'POST') {
    res.statusCode = 400;
    return res.json({ error: 'Only POST is allowed.' });
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

  const fetchedTweetsPromises = [];

  for (const handle of handles) {
    for (let page = 1; page <= 17; page += 1) {
      const fetchedTweetsPromise = app.get('statuses/user_timeline', {
        screen_name: handle,
        tweet_mode: 'extended',
        count: 200,
        page,
      });

      fetchedTweetsPromises.push(fetchedTweetsPromise);
    }
  }
  const fetchedTweets = (await Promise.all(fetchedTweetsPromises)).flat();

  console.log('fetchedTweets', fetchedTweets);

  try {
    await Tweet.create(fetchedTweets);
  } catch (err) {
    console.log('Found first duplicates...\n', err);
  }

  res.statusCode = 200;
  res.json({ status: 'success' });
};
