import connectDb from '../../lib/mongoose'
import Tweet from '../../models/tweet'


export default async (req, res) => {
  await connectDb();

  const filters = {
    'user.screen_name': 'visualizevalue',
    'in_reply_to_status_id': null,
    'retweeted_status': { $exists: false },
    'extended_entities.media': { $exists: true, $size: 1 },
  }

  const count = await Tweet.countDocuments(filters);

  const random = Math.floor(Math.random() * count);

  const tweet = await Tweet.findOne(filters).skip(random);

  // console.log('full_text', tweet.full_text);
  // console.log('media_url_https', tweet.extended_entities.media[0].media_url_https);

  res.statusCode = 200;
  res.json({
    full_text: tweet.full_text,
    media_url_https: tweet.extended_entities.media[0].media_url_https
  });
}
