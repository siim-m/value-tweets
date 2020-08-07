import mongoose from 'mongoose';

const connectDb = async () => {
  if (mongoose.connections[0].readyState !== 1) {
    try {
      await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
      });
    } catch (err) {
      console.error(err.message);
      process.exit(1);
    }
  }
};

const db = mongoose.connection;

db.once('open', () => {
  console.log('MongoDB connected.');
});

export default connectDb;
