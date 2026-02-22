import OpenAI from 'openai';

const globalForGroq = globalThis as unknown as {
  groq: OpenAI | undefined;
};

export function getOpenAIClient(): OpenAI {
  if (!process.env.GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY is not set');
  }

  const client = globalForGroq.groq ?? new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: 'https://api.groq.com/openai/v1',
  });

  if (process.env.NODE_ENV !== 'production') {
    globalForGroq.groq = client;
  }

  return client;
}

export async function withAIFallback<T>(
  aiFunction: () => Promise<T>,
  fallback: T
): Promise<T> {
  try {
    return await aiFunction();
  } catch (error) {
    console.error('AI feature failed, using fallback:', error);
    return fallback;
  }
}
