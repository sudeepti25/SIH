import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Gemini AI
let genAI;

try {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured in environment variables');
  }
  
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
} catch (error) {
  console.error('Failed to initialize Gemini AI:', error.message);
}

// Get the Gemini model instance
export const getGeminiModel = () => {
  if (!genAI) {
    throw new Error('Gemini AI is not properly initialized');
  }
  return genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
};

export default genAI;