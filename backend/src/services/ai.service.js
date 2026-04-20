import { ChatGoogleGenerativeAI } from '@langchain/google-genai';

const model = new ChatGoogleGenerativeAI({
  model: 'gemini-2.5-flash',
  apiKey: process.env.GEMINI_API_KEY,
});

export const testAi = async () => {
  const response = await model.invoke(
    'who is the best south actor? only one name',
  );
  console.log(response.content);
};
