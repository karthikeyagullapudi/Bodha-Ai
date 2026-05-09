import mongoose from 'mongoose';
import userModel from './auth.model.js';

const chatSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: userModel,
      required: true,
    },
    title: {
      type: String,
      required: true,
      default: 'New Chat',
    },
  },
  {
    timestamps: true,
  },
);

const chatModel = mongoose.model('Chat', chatSchema);
export default chatModel;
