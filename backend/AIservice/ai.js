import Groq from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();

let groqClient;

export function getGroqClient() {
  if (groqClient) {
    return groqClient;
  }

  const apiKey = process.env.GROQ_API_KEY || process.env.GROK_API_KEY;

  if (!apiKey) {
    throw new Error('Missing GROQ_API_KEY environment variable');
  }

  groqClient = new Groq({ apiKey });
  return groqClient;
}

export const groqModel = process.env.GROQ_MODEL || 'llama-3.1-8b-instant';
