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

const systemPromptText =
  'You are Bodha AI, an advanced, highly intelligent AI assistant equipped with real-time web search capabilities. ALWAYS use the searchInternet tool whenever asked about current events, recent developments, real-time facts, stock prices, weather, sports results, or up-to-date topics. Provide comprehensive, accurate, structured, and beautifully formatted markdown responses.';

// Keep retries low so a failing provider falls through quickly instead of
// leaving the user waiting for minutes while LangChain backs off
const primaryModel = new ChatGoogleGenerativeAI({
  model: process.env.GEMINI_MODEL || 'gemini-3.6-flash',
  apiKey: process.env.GEMINI_API_KEY,
  maxRetries: 1,
});

const mistralModel = new ChatMistralAI({
  model: 'mistral-small-latest',
  apiKey: process.env.MISTRAL_API_KEY,
  maxRetries: 1,
});

const searchInternetTool = tool(searchInternet, {
  name: 'searchInternet',
  description:
    'Search the live internet for real-time information, current news, weather, stock market updates, sports results, recent events, or topics requiring up-to-date facts.',
  schema: z.object({
    query: z.string().describe('The search query to look up on the internet'),
  }),
});

const primaryAgent = createAgent({
  model: primaryModel,
  tools: [searchInternetTool],
  prompt: systemPromptText,
});

const fallbackAgent = createAgent({
  model: mistralModel,
  tools: [searchInternetTool],
  prompt: systemPromptText,
});

export const generateResponse = async (messages) => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const systemMessage = new SystemMessage(
    `Today's date is ${currentDate}. You are Bodha AI, an advanced AI assistant equipped with real-time web search capabilities. ALWAYS use the searchInternet tool whenever user queries involve current events, recent developments, sports results, scores, winners, weather, stock prices, news, or topics that benefit from live web search information.`,
  );

  const formattedMessages = [
    systemMessage,
    ...messages.map((msg) =>
      msg.role === 'user'
        ? new HumanMessage(msg.content)
        : new AIMessage(msg.content),
    ),
  ];

  try {
    const response = await primaryAgent.invoke({
      messages: formattedMessages,
    });
    return response.messages[response.messages.length - 1].content;
  } catch (error) {
    console.warn('Primary agent failed, falling back to Mistral agent:', error.message);
    try {
      const response = await fallbackAgent.invoke({
        messages: formattedMessages,
      });
      return response.messages[response.messages.length - 1].content;
    } catch (fallbackError) {
      console.error('All AI agents failed:', fallbackError.message);
      throw new Error(`AI service temporary failure: ${fallbackError.message}`);
    }
  }
};

export const generateTitle = async (message) => {
  try {
    const response = await primaryModel.invoke([
      new SystemMessage(
        `you are a helpful assistant that generates, concise and descriptive titles for the chat conversations.

        User will provide you with the first message of a chat conversation, and you will generate a title that captures the essence of the conversation in 2 to 4 words that title should be clear, relevant and engaging giving user a quick understanding of the chat topic.`,
      ),
      new HumanMessage(
        `This is the first message of a chat conversation: ${message}`,
      ),
    ]);
    return response.text;
  } catch (error) {
    console.warn('generateTitle failed, using fallback title:', error.message);
    const words = message.trim().split(/\s+/).slice(0, 4).join(' ');
    return words || 'New Chat';
  }
};
