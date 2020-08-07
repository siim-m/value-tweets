import mongoose from 'mongoose';

// const TweetSchema = new mongoose.Schema({
//   type: Object,
// });

const TweetSchema = new mongoose.Schema({
  created_at: Date,
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  full_text: String,
  display_text_range: [Number],
  extended_entities: [Object],
  in_reply_to_status_id: Number,
  in_reply_to_user_id: Number,
  in_reply_to_screen_name: String,
  user: {
    id: Number,
    screen_name: String,
  },
  favorite_count: Number,
  retweeted_status: Object,
  retweet_count: Number,
});

export default mongoose.models.tweet ||
  mongoose.model('tweet', TweetSchema);
