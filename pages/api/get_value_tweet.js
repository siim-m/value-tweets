import connectDb from '../../lib/mongoose';
import Tweet from '../../models/tweet';

export default async (req, res) => {
  await connectDb();

  const { handle } = req.query;

  if (!handle) {
    res.statusCode = 400;
    return res.json({ error: 'Must provide handle in query string.' });
  }

  const filters = {
    'user.screen_name': handle,
    in_reply_to_status_id: null,
    retweeted_status: { $exists: false },
    'extended_entities.media': { $exists: true, $size: 1 },
  };

  const count = await Tweet.countDocuments(filters);
  const random = Math.floor(Math.random() * count);
  const tweet = await Tweet.findOne(filters).skip(random);

  res.statusCode = 200;
  res.json({
    full_text: tweet.full_text,
    display_text: tweet.full_text.substring(
      tweet.display_text_range[0],
      tweet.display_text_range[1]
    ),
    url_https: `https://twitter.com/i/web/status/${tweet.id_str}`,
    media_url_https: tweet.extended_entities.media[0].media_url_https,
    user: tweet.user,
  });
};
