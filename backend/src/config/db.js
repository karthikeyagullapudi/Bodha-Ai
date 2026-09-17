import mongoose from 'mongoose';

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');
  } catch (error) {
    console.log('Error connecting to MongoDB : ', error);
    // Without a database every request would fail, so stop and let the
    // host report a failed deploy instead of serving a broken site
    process.exit(1);
  }
};

export default connectDb;
