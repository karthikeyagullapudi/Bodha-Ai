import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { HumanMessage, SystemMessage, AIMessage } from 'langchain';
import { ChatMistralAI } from '@langchain/mistralai';

const geminiModel = new ChatGoogleGenerativeAI({
  model: 'gemini-2.5-flash',
  apiKey: process.env.GEMINI_API_KEY,
});

const mistralModel = new ChatMistralAI({
  model: 'mistral-small-latest',
  apiKey: process.env.MISTRAL_API_KEY,
});

export const generateResponse = async (messages) => {
  const response = await geminiModel.invoke(
    messages.map((message) => {
      if (message.role === 'user') {
        return new HumanMessage(message.content);
      } else if (message.role === 'ai') {
        return new AIMessage(message.content);
      }
    }),
  );
  return response.text;
};

export const generateTitle = async (message) => {
  const response = await mistralModel.invoke([
    new SystemMessage(
      `you are a helpful assistant that generates, concise and descriptive titles for the chat conversations.

      User will provide you with the first message of a chat conversation, and you will generate a title that captures the essence of the conversation in 2 to 4 words that title should be clear, relevant and engaging giving user a quick understanding of the chat topic.`,
    ),
    new HumanMessage(
      `This is the first message of a chat conversation: ${message}`,
    ),
  ]);
  return response.text;
};
