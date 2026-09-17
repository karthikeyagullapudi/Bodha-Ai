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

// The Gemini free tier limits requests per minute *per model*, so trying
// several models in turn keeps the app answering when one is rate limited.
// Mistral is the last resort. Override the order with GEMINI_MODELS
// (comma-separated model names).
const GEMINI_MODELS = (
  process.env.GEMINI_MODELS ||
  process.env.GEMINI_MODEL ||
  'gemini-3.6-flash,gemini-2.5-flash,gemini-flash-lite-latest'
)
  .split(',')
  .map((name) => name.trim())
  .filter(Boolean);

// Titles use small, fast models so they don't eat into the answer models' quota
const TITLE_MODELS = ['gemini-3.1-flash-lite', 'gemini-flash-lite-latest'];

// Overloaded models can take minutes to answer or fail, so each attempt and
// the whole reply get a time limit
const MODEL_TIMEOUT_MS = 25_000;
const RESPONSE_DEADLINE_MS = 70_000;
const TITLE_TIMEOUT_MS = 8_000;

const searchInternetTool = tool(searchInternet, {
  name: 'searchInternet',
  description:
    'Search the live internet for real-time information, current news, weather, stock market updates, sports results, recent events, or topics requiring up-to-date facts.',
  schema: z.object({
    query: z.string().describe('The search query to look up on the internet'),
  }),
});

// maxRetries: 0 so a rate-limited or unavailable model hands over to the next
// one immediately instead of backing off while the user waits
const createGeminiModel = (model) =>
  new ChatGoogleGenerativeAI({
    model,
    apiKey: process.env.GEMINI_API_KEY,
    maxRetries: 0,
  });

const agents = [
  ...GEMINI_MODELS.map((name) => ({
    name,
    agent: createAgent({
      model: createGeminiModel(name),
      tools: [searchInternetTool],
    }),
  })),
  {
    name: 'mistral-small-latest',
    agent: createAgent({
      model: new ChatMistralAI({
        model: 'mistral-small-latest',
        apiKey: process.env.MISTRAL_API_KEY,
        maxRetries: 0,
      }),
      tools: [searchInternetTool],
    }),
  },
];

const titleModels = TITLE_MODELS.map(createGeminiModel);

export const generateResponse = async (messages) => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const systemMessage = new SystemMessage(
    `Today's date is ${currentDate}. You are Bodha AI, an advanced, highly intelligent AI assistant equipped with real-time web search capabilities. ALWAYS use the searchInternet tool whenever user queries involve current events, recent developments, sports results, scores, winners, weather, stock prices, news, or topics that benefit from live web search information. Provide comprehensive, accurate, structured, and beautifully formatted markdown responses.`,
  );

  const formattedMessages = [
    systemMessage,
    ...messages.map((msg) =>
      msg.role === 'user'
        ? new HumanMessage(msg.content)
        : new AIMessage(msg.content),
    ),
  ];

  const deadline = Date.now() + RESPONSE_DEADLINE_MS;

  for (const { name, agent } of agents) {
    const timeLeft = deadline - Date.now();
    if (timeLeft < 5_000) break;

    try {
      const response = await agent.invoke(
        { messages: formattedMessages },
        { signal: AbortSignal.timeout(Math.min(MODEL_TIMEOUT_MS, timeLeft)) },
      );
      const text = response.messages.at(-1)?.text?.trim();
      if (text) return text;
      console.warn(`AI model ${name} returned an empty reply, trying the next model`);
    } catch (error) {
      console.warn(
        `AI model ${name} failed, trying the next model:`,
        error.message.slice(0, 300),
      );
    }
  }

  const error = new Error(
    'Bodha AI is busy right now. Please try again in a minute.',
  );
  error.status = 503;
  throw error;
};

// Models sometimes wrap titles in quotes or markdown, or add a "Title:" prefix
const cleanTitle = (text) =>
  text
    .trim()
    .split('\n')[0]
    .replace(/^title\s*:\s*/i, '')
    .replace(/[*_#`"“”]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/[.:;,!]+$/, '')
    .slice(0, 60);

const titlePrompt = new SystemMessage(
  `you are a helpful assistant that generates, concise and descriptive titles for the chat conversations.

  User will provide you with the first message of a chat conversation, and you will generate a title that captures the essence of the conversation in 2 to 4 words that title should be clear, relevant and engaging giving user a quick understanding of the chat topic. Reply with the title only, without quotes or formatting.`,
);

export const generateTitle = async (message) => {
  for (const titleModel of titleModels) {
    try {
      const response = await titleModel.invoke(
        [
          titlePrompt,
          new HumanMessage(
            `This is the first message of a chat conversation: ${message}`,
          ),
        ],
        { signal: AbortSignal.timeout(TITLE_TIMEOUT_MS) },
      );
      const title = cleanTitle(response.text);
      if (title) return title;
    } catch (error) {
      console.warn(
        `Title model ${titleModel.model} failed:`,
        error.message.slice(0, 200),
      );
    }
  }
  // Every title model failed: fall back to the first few words of the message
  return cleanTitle(message.split(/\s+/).slice(0, 4).join(' ')) || 'New Chat';
};
