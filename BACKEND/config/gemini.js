import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Gemini AI
let genAI;

try {
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
    console.warn('⚠️  GEMINI_API_KEY is not configured. Symptom analysis will not work until API key is provided.');
    genAI = null;
  } else {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    console.log('✅ Gemini AI initialized successfully');
  }
} catch (error) {
  console.error('Failed to initialize Gemini AI:', error.message);
  genAI = null;
}

// Get the Gemini model instance
export const getGeminiModel = () => {
  if (!genAI) {
    throw new Error('Gemini AI is not properly initialized. Please configure GEMINI_API_KEY in environment variables.');
  }
  return genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
};

// Check if Gemini is available
export const isGeminiAvailable = () => {
  return genAI !== null;
};

export default genAI;