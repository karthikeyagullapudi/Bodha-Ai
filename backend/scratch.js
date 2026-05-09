import mongoose from 'mongoose';
import 'dotenv/config';

const checkDB = async () => {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/bodha-ai'); 
  const chats = await mongoose.connection.db.collection('chats').find().toArray();
  const chatIds = chats.map(c => c._id);
  const messages = await mongoose.connection.db.collection('messages').find({ chat: { $in: chatIds } }).toArray();
  console.log(`Chats count: ${chats.length}, Messages count: ${messages.length}`);
  process.exit();
}
checkDB();
