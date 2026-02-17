import React, { useState, useEffect } from "react";
import { FaRobot, FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import Markdown from "react-markdown";

const ChatMessage = ({ message, showTyping = false }) => {
  const [displayedText, setDisplayedText] = useState("");

  // Helper function to detect Links and Emails ---
  const formatMessageWithLinks = (text) => {
    const urlRegex =
      /((?:https?:\/\/|www\.)[^\s]+|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
    const parts = text.split(urlRegex);

    return parts.map((part, index) => {
      if (part.match(urlRegex)) {
        let href = part;
        let isEmail = part.includes("@");

        // Fix missing protocols
        if (isEmail) {
          href = `mailto:${part}`;
        } else if (part.startsWith("www.")) {
          href = `https://${part}`;
        }

        const lastChar = part.slice(-1);
        let displayPart = part;
        if ([".", ",", "!", "?"].includes(lastChar)) {
          if (part.endsWith(".")) {
            href = href.slice(0, -1);
            displayPart = part.slice(0, -1);
          }
        }

        return (
          <a
            key={index}
            href={href}
            target='_blank'
            rel='noopener noreferrer'
            className='chat-link'
            onClick={(e) => e.stopPropagation()}
          >
            {part}
          </a>
        );
      }

      // Return plain text  here the markdown
      return <span key={index}>{part}</span>;
    });
  };

  useEffect(() => {
    if (!showTyping || message.isUser || message.isThinking) {
      setDisplayedText(message.text);
      return;
    }

    setDisplayedText("");
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText((prev) => message.text.slice(0, i + 1));
      i++;
      if (i > message.text.length) clearInterval(interval);
    }, 15);

    return () => clearInterval(interval);
  }, [message.text, showTyping, message.isUser, message.isThinking]);

  return (
    <div className={`message-row ${message.isUser ? "user-row" : "bot-row"}`}>
      {!message.isUser && (
        <div className='avatar-container'>
          <div className='bot-icon'>
            {/* <FaRobot /> */}

            <img src='/logo3.png' alt='' className='bot-icon' />
          </div>
        </div>
      )}

      <div className='message-content-stack'>
        <div
          className={`bubble ${message.isUser ? "user-bubble" : "bot-bubble"}`}
        >
          {message.isThinking ? (
            <div className='typing-dots'>
              <span>.</span>
              <span>.</span>
              <span>.</span>
            </div>
          ) : (
            /* Call the formatter function instead of plain text */
            // <p >{formatMessageWithLinks(displayedText)}</p>
            <Markdown>{displayedText}</Markdown>
          )}
        </div>

        {!message.isUser && !message.isThinking && (
          <div className='feedback-actions'>
            <button aria-label='Helpful'>
              <FaThumbsUp />
            </button>
            <button aria-label='Not helpful'>
              <FaThumbsDown />
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        .message-row {
          display: flex;
          gap: 1rem;
          width: 100%;
        }
        .user-row {
          justify-content: flex-end;
        }
        .bot-row {
          justify-content: flex-start;
        }
        .avatar-container {
          flex-shrink: 0;
          margin-top: 4px;
        }
        .bot-icon {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #4f46e5;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.9rem;
        }
        .message-content-stack {
          display: flex;
          flex-direction: column;
          max-width: 80%;
          gap: 0.5rem;
        }
        .bubble {
          padding: 0.75rem 1rem;
          border-radius: 12px;
          font-size: 0.95rem;
          line-height: 1.5;
          word-wrap: break-word;
        }
        .user-bubble {
          background: var(--user-bubble-bg);
          color: var(--user-text);
          border-bottom-right-radius: 2px;
        }
        .bot-bubble {
          background: transparent;
          color: var(--bot-text);
          padding-left: 0;
          padding-top: 0;
        }
        .feedback-actions {
          display: flex;
          gap: 0.75rem;
          padding-left: 0;
        }
        .feedback-actions button {
          background: none;
          border: none;
          color: var(--chat-text-secondary);
          cursor: pointer;
          font-size: 0.9rem;
          opacity: 0.6;
          transition: opacity 0.2s;
        }
        .feedback-actions button:hover {
          opacity: 1;
          color: var(--chat-text);
        }
        .typing-dots span {
          animation: blink 1.4s infinite both;
          font-size: 1.5rem;
          margin: 0 1px;
        }
        .typing-dots span:nth-child(2) {
          animation-delay: 0.2s;
        }
        .typing-dots span:nth-child(3) {
          animation-delay: 0.4s;
        }
        @keyframes blink {
          0% {
            opacity: 0.2;
          }
          20% {
            opacity: 1;
          }
          100% {
            opacity: 0.2;
          }
        }

        /* use global(.className) because the <a> tag is generated dynamically */
        :global(.chat-link) {
          color: #2563eb; /* Bright Blue */
          text-decoration: underline;
          word-break: break-all;
          cursor: pointer;
          font-weight: 500;
        }
        :global(.chat-link:hover) {
          color: #1d4ed8;
        }
        /* Make sure links in dark mode are visible */
        :global(.dark .chat-link) {
          color: #60a5fa;
        }
      `}</style>
    </div>
  );
};

export default ChatMessage;
