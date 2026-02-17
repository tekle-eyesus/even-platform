import { GoogleGenerativeAI } from "@google/generative-ai";
import { SYSTEM_PROMPT } from "../config/prompts";

class GeminiService {
  constructor() {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error(
        "Gemini API key not found. Please set REACT_APP_GEMINI_API_KEY in your environment variables."
      );
    }

    console.log(
      "Initializing Gemini Service with API Key:",
      apiKey ? "Present" : "Missing"
    );

    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({
      model: "gemini-2.5-flash-lite",
      systemInstruction: SYSTEM_PROMPT,
      generationConfig: {
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 1000,
      },
    });

    this.chat = null;
    this.initializeChat();
  }

  initializeChat() {
    try {
      this.chat = this.model.startChat({
        history: [
          {
            role: "user",
            parts: [{ text: "Hello, please introduce yourself as tekleeyesus." }],
          },
          {
            role: "model",
            parts: [
              {
                text: "Hello! I'm tekleeyesus, a software engineer passionate about building amazing digital experiences. I specialize in modern web technologies like React, Node.js, and Python. How can I help you learn more about my skills and projects today?",
              },
            ],
          },
        ],
      });
      console.log("Chat session initialized successfully");
    } catch (error) {
      console.error("Error initializing chat session:", error);
      throw error;
    }
  }

  async sendMessage(message) {
    try {
      console.log("Sending message to Gemini:", message);

      if (!this.chat) {
        this.initializeChat();
      }

      const result = await this.chat.sendMessage(message);
      const response = await result.response;
      const text = response.text();

      console.log("Received response from Gemini:", text);
      return text;
    } catch (error) {
      console.error("Error calling Gemini API:", error);

      // More specific error handling
      if (error.message.includes("API_KEY_INVALID")) {
        throw new Error("Invalid API key. Please check your Gemini API key.");
      } else if (error.message.includes("QUOTA_EXCEEDED")) {
        throw new Error("API quota exceeded. Please try again later.");
      } else if (error.message.includes("SAFETY")) {
        throw new Error(
          "The message was blocked for safety reasons. Please try a different question."
        );
      } else {
        throw new Error(
          "Sorry, I encountered an error while processing your request. Please try again."
        );
      }
    }
  }

  clearHistory() {
    this.initializeChat();
  }
}

// Singleton instance
export const geminiService = new GeminiService();
