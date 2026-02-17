import React, { useState, useRef, useEffect } from "react";
import { FaArrowRight, FaTrash } from "react-icons/fa";

const ChatInput = ({ onSendMessage, onClear, isLoading }) => {
  const [message, setMessage] = useState("");
  const textareaRef = useRef(null);

  // Auto-resize
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [message]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim());
      setMessage("");
      if (textareaRef.current) textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="input-container">
      
      {/* The Pill Input Box */}
      <form onSubmit={handleSubmit} className="input-box-wrapper">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question..."
          rows={1}
          className="chat-textarea"
          disabled={isLoading}
        />
        
        <button 
          type="submit" 
          className="send-btn" 
          disabled={!message.trim() || isLoading}
        >
          <FaArrowRight />
        </button>
      </form>

      {/* Clear Chat (Optional, hidden in a small text button below or keep inside) */}
      <div className="footer-links">
        {message.length > 0 && (
            <button onClick={onClear} className="clear-link" type="button">Clear history</button>
        )}
      </div>

      <div className="disclaimer">
        Building Scalable Solutions & Innovative Tech.
      </div>

      <style jsx>{`
        .input-container {
          padding: 1rem 1.25rem 1.25rem;
          background: var(--chat-bg);
          border-top: 1px solid var(--chat-border);
        }

        .input-box-wrapper {
          display: flex;
          align-items: center;
          background: var(--chat-bg);
          border: 2px solid var(--chat-border);
          border-radius: 24px; /* Pill Shape */
          padding: 0.5rem 0.75rem 0.5rem 1rem;
          transition: border-color 0.2s, box-shadow 0.2s;
          position: relative;
        }

        .input-box-wrapper:focus-within {
          border-color: var(--accent-color);
          box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.05);
        }

        .chat-textarea {
          flex: 1;
          border: none;
          background: transparent;
          resize: none;
          font-family: inherit;
          font-size: 0.95rem;
          color: var(--chat-text);
          outline: none;
          max-height: 100px;
          padding: 4px 0;
          line-height: 1.4;
        }

        .chat-textarea::placeholder {
          color: var(--chat-text-secondary);
        }

        .send-btn {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--accent-color);
          color: var(--chat-bg); /* Inverted text color */
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          margin-left: 0.5rem;
          transition: transform 0.2s, opacity 0.2s;
          flex-shrink: 0;
        }

        .send-btn:disabled {
          opacity: 0.3;
          cursor: default;
          background: var(--chat-text-secondary);
        }

        .send-btn:not(:disabled):hover {
          transform: scale(1.05);
        }

        .disclaimer {
          margin-top: 0.75rem;
          font-size: 0.75rem;
          color: var(--chat-text-secondary);
          text-align: center;
        }

        .disclaimer a {
          color: #4F46E5;
          text-decoration: none;
        }

        .footer-links {
            display: flex;
            justify-content: flex-end;
            margin-bottom: 4px;
        }
        
        .clear-link {
            background: none;
            border: none;
            font-size: 0.7rem;
            color: var(--chat-text-secondary);
            cursor: pointer;
            text-decoration: underline;
        }
      `}</style>
    </div>
  );
};

export default ChatInput;