import { tavily } from '@tavily/core';

const getTavilyClient = () => {
  const apiKey = process.env.TAVILY_API_KEY || process.env.TEVILY_API_KEY;
  if (!apiKey) {
    throw new Error('Tavily API key is missing. Set TAVILY_API_KEY or TEVILY_API_KEY in environment variables.');
  }
  return tavily({ apiKey });
};

export const searchInternet = async ({ query }) => {
  try {
    const client = getTavilyClient();
    const result = await client.search(query, {
      maxResults: 5,
    });
    return JSON.stringify(result);
  } catch (error) {
    console.error('Internet search error:', error.message);
    return JSON.stringify({ error: error.message, query });
  }
};
