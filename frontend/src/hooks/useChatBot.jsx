import { useState, useCallback } from "react";
import { geminiService } from "../services/geminiService";
import { INITIAL_MESSAGE } from "../config/prompts";

export const useChatBot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: INITIAL_MESSAGE,
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendMessage = useCallback(async (messageText) => {
    if (!messageText.trim()) return;

    // Add user message immediately
    const userMessage = {
      id: Date.now(),
      text: messageText,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const response = await geminiService.sendMessage(messageText);

      // Add AI response
      const aiMessage = {
        id: Date.now() + 1,
        text: response,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error("Error in useChatBot:", err);
      setError(err.message);

      const errorMessage = {
        id: Date.now() + 1,
        text:
          err.message ||
          "I'm having some technical difficulties right now. Please try again later or email Alex directly at tekle@example.com",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearChat = useCallback(() => {
    setMessages([
      {
        id: 1,
        text: INITIAL_MESSAGE,
        isUser: false,
        timestamp: new Date(),
      },
    ]);
    geminiService.clearHistory();
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearChat,
  };
};
