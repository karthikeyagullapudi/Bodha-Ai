import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import {
  HumanMessage,
  SystemMessage,
  AIMessage,
} from '@langchain/core/messages';
import { ChatMistralAI } from '@langchain/mistralai';
import { tool } from '@langchain/core/tools';
import { createAgent } from 'langchain';
import { z } from 'zod';
import { searchInternet } from './internet.service.js';

const geminiModel = new ChatGoogleGenerativeAI({
  model: 'gemini-2.5-flash',
  apiKey: process.env.GEMINI_API_KEY,
});

const mistralModel = new ChatMistralAI({
  model: 'mistral-small-latest',
  apiKey: process.env.MISTRAL_API_KEY,
});

const searchInternetTool = tool(searchInternet, {
  name: 'searchInternet',
  description:
    'Search the live internet for real-time information, current news, weather, stock market updates, recent events, or topics beyond model knowledge cutoff.',
  schema: z.object({
    query: z.string().describe('The search query to look up on the internet'),
  }),
});

const agent = createAgent({
  model: geminiModel,
  tools: [searchInternetTool],
  prompt:
    'You are Bodha AI, an advanced, highly intelligent AI assistant equipped with real-time web search capabilities. ALWAYS use the searchInternet tool whenever asked about current events, recent developments, real-time facts, stock prices, weather, or up-to-date topics. Provide comprehensive, accurate, structured, and beautifully formatted markdown responses.',
});

export const generateResponse = async (messages) => {
  const formattedMessages = messages.map((msg) =>
    msg.role === 'user'
      ? new HumanMessage(msg.content)
      : new AIMessage(msg.content),
  );

  const response = await agent.invoke({
    messages: formattedMessages,
  });

  return response.messages[response.messages.length - 1].content;
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
