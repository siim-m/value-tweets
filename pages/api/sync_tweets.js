import Twitter from 'twitter-lite';

import connectDb from '../../lib/mongoose';
import Tweet from '../../models/tweet';

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

  const handle = req.body;

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
      screen_name: handle,
      tweet_mode: 'extended',
      count: 200,
      page,
    });

    try {
      await Tweet.create(fetchedTweets);
    } catch (err) {
      console.log('Found first duplicates, stopping...');
      break;
    }
  }

  res.statusCode = 200;
  res.json({ status: 'success' });
};
