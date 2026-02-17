import React, { useState, useRef, useEffect } from "react";
import { useChatBot } from "../../hooks/useChatBot";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import RobotButton from "./RobotButton";
import { FaTimes, FaMinus, FaAws } from "react-icons/fa";

const AIChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, isLoading, sendMessage, clearChat } = useChatBot();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, isOpen]);

  const handleSendMessage = async (message) => {
    await sendMessage(message);
  };

  return (
    <>
      {/* 1. Theme Variables Definition (Scoped to chat) */}
      <style>{`
        :root {
          --chat-width: 400px;
          --chat-height: 600px;
          --chat-bg: #ffffff;
          --chat-header-bg: #ffffff;
          --chat-text: #1f2937;
          --chat-text-secondary: #6b7280;
          --chat-border: #e5e7eb;
          --user-bubble-bg: #f3f4f6; /* Light gray like AWS */
          --user-text: #111827;
          --bot-bubble-bg: transparent;
          --bot-text: #111827;
          --accent-color: #252f3e; /* AWS Dark Blue/Black */
        }

        /* Dark Mode Overrides (Assumes your app adds .dark class to body) */
        .dark {
          --chat-bg: #1f2937;
          --chat-header-bg: #1f2937;
          --chat-text: #f3f4f6;
          --chat-text-secondary: #9ca3af;
          --chat-border: #374151;
          --user-bubble-bg: #374151;
          --user-text: #ffffff;
          --bot-text: #e5e7eb;
          --accent-color: #ffffff;
        }
      `}</style>

      <div className='robot-button-wrapper'>
        <RobotButton
          isOpen={isOpen}
          onClick={() => setIsOpen(!isOpen)}
          isThinking={isLoading}
        />
      </div>

      {isOpen && (
        <div className='chat-window-container'>
          {/* Header */}
          <div className='chat-header'>
            <div className='header-title'>
              <h3>EvenAI</h3>
            </div>
            <div className='header-controls'>
              <button
                onClick={() => setIsOpen(false)}
                className='control-btn'
                aria-label='Minimize'
              >
                <FaMinus />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className='chat-messages'>
            {messages.map((message, index) => (
              <ChatMessage
                key={message.id || index}
                message={message}
                showTyping={
                  index === messages.length - 1 && !message.isUser && !isLoading
                }
              />
            ))}

            {isLoading && (
              <ChatMessage
                message={{
                  id: "thinking",
                  text: "Thinking...",
                  isUser: false,
                  isThinking: true,
                }}
              />
            )}
            <div ref={messagesEndRef} />
          </div>

          <ChatInput
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            onClear={clearChat}
          />
        </div>
      )}

      <style jsx>{`
        .robot-button-wrapper {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          z-index: 1000;
        }

        .chat-window-container {
          position: fixed;
          bottom: 6rem; /* Above the button */
          right: 2rem;
          width: var(--chat-width);
          height: var(--chat-height);
          max-height: 80vh;
          background: var(--chat-bg);
          border-radius: 12px;
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.15);
          display: flex;
          flex-direction: column;
          z-index: 9999;
          overflow: hidden;
          font-family:
            -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          border: 1px solid var(--chat-border);
          animation: slideUp 0.3s ease-out;
        }

        /* Modern Flat Header */
        .chat-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.25rem;
          background: var(--chat-header-bg);
          border-bottom: 1px solid var(--chat-border);
        }

        .header-title {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .header-title h3 {
          margin: 0;
          font-size: 1rem;
          font-weight: 700;
          color: var(--chat-text);
        }

        .header-badge {
          font-size: 0.65rem;
          background: transparent;
          border: 1px solid var(--chat-text-secondary);
          color: var(--chat-text-secondary);
          padding: 2px 6px;
          border-radius: 4px;
          text-transform: uppercase;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .header-controls {
          display: flex;
          gap: 0.5rem;
        }

        .control-btn {
          background: transparent;
          border: none;
          color: var(--chat-text);
          cursor: pointer;
          font-size: 0.9rem;
          padding: 0.25rem;
          opacity: 0.6;
          transition: opacity 0.2s;
        }

        .control-btn:hover {
          opacity: 1;
        }

        .chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 1.5rem;
          background: var(--chat-bg);
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 480px) {
          .robot-button-wrapper {
            bottom: 1rem;
            right: 1rem;
          }
          .chat-window-container {
            bottom: 0;
            right: 0;
            width: 100%;
            height: 100%;
            max-height: 100%;
            border-radius: 0;
          }
        }
      `}</style>
    </>
  );
};

export default AIChatBot;
