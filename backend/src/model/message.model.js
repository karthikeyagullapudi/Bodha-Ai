import mongoose from 'mongoose';
import chatModel from './chat.model';

const messageSchema = new mongoose.Schema({
  chat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: chatModel,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    enum: ['user', 'ai'],
    required: true,
  },
});

const messageModel = mongoose.model('Message', messageSchema);
export default messageModel;
