import React from "react";
import { FaRobot, FaTimes } from "react-icons/fa";

const RobotButton = ({ isOpen, onClick, isThinking }) => {
  return (
    <button
      className={`trigger-button ${isOpen ? "open" : ""}`}
      onClick={onClick}
      aria-label='Toggle Chat'
    >
      <div className='icon-wrapper'>
        {isOpen ? (
          <FaTimes />
        ) : (
          <img src='/logo3.png' alt='' className='bot-icon' />
        )}
      </div>

      {/* Thinking Indicator Badge */}
      {isThinking && !isOpen && (
        <span className='notification-dot'>
          <span className='ping'></span>
        </span>
      )}

      <style jsx>{`
        .bot-icon {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: #4f46e5; /* Indigo */
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.9rem;
        }

        .trigger-button {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: var(--accent-color); /* Uses CSS var from parent */
          border: none;
          color: white; /* Always white icons on accent bg */
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          cursor: pointer;
          position: relative;
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .trigger-button:hover {
          transform: scale(1.1);
        }

        .trigger-button.open {
          transform: rotate(90deg);
          background: #374151; /* Dark gray when open */
        }

        .icon-wrapper {
          font-size: 1.5rem;
          display: flex;
        }

        .notification-dot {
          position: absolute;
          top: 0;
          right: 0;
          width: 14px;
          height: 14px;
          background: #10b981;
          border: 2px solid white;
          border-radius: 50%;
        }

        .ping {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: #10b981;
          opacity: 0.75;
          animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        }

        @keyframes ping {
          75%,
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }
      `}</style>
    </button>
  );
};

export default RobotButton;
