import React, { useState } from "react";
import { X, Copy, Check } from "lucide-react";
import { FaXTwitter, FaFacebook, FaLinkedin } from "react-icons/fa6";

export default function ShareModal({ isOpen, onClose, shareData }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !shareData) return null;

  // Map backend keys to UI configuration
  const socialConfig = [
    {
      key: "twitter",
      icon: FaXTwitter,
      label: "X (Twitter)",
      color: "hover:text-black hover:bg-black/5",
    },
    {
      key: "facebook",
      icon: FaFacebook,
      label: "Facebook",
      color: "hover:text-blue-600 hover:bg-blue-50",
    },
    {
      key: "linkedin",
      icon: FaLinkedin,
      label: "LinkedIn",
      color: "hover:text-blue-700 hover:bg-blue-50",
    },
  ];

  const handleCopy = () => {
    if (shareData.copy) {
      navigator.clipboard.writeText(shareData.copy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2s
    }
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200'>
      <div className='bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 relative'>
        {/* Header */}
        <div className='flex items-center justify-between px-6 py-5 border-b border-zinc-100'>
          <h3 className='text-xl font-bold text-zinc-900'>Share</h3>
          <button
            onClick={onClose}
            className='p-2 bg-zinc-100 hover:bg-zinc-200 rounded-full transition-colors text-zinc-500 hover:text-black'
          >
            <X className='w-5 h-5' />
          </button>
        </div>

        <div className='p-6'>
          {/* 1. Social Icons Grid */}
          <p className='text-sm font-medium text-zinc-900 mb-4'>
            Share this link via
          </p>

          <div className='flex gap-4 mb-8 overflow-x-auto pb-2'>
            {socialConfig.map((social) => {
              // Only render if backend returned a link for this platform
              const link = shareData[social.key];
              if (!link) return null;

              return (
                <a
                  key={social.key}
                  href={link}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex flex-col items-center gap-2 group min-w-[70px]'
                >
                  <div
                    className={`w-14 h-14 rounded-2xl border border-zinc-200 flex items-center justify-center text-zinc-600 transition-all ${social.color} group-hover:scale-105 group-hover:shadow-sm`}
                  >
                    <social.icon className='w-6 h-6' />
                  </div>
                  <span className='text-xs text-zinc-500 font-medium group-hover:text-black'>
                    {social.label}
                  </span>
                </a>
              );
            })}
          </div>

          {/* 2. Page Link Copy Section */}
          <p className='text-sm font-medium text-zinc-900 mb-2'>Page link</p>
          <div className='flex items-center gap-2 bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2'>
            <div className='flex-1 overflow-hidden'>
              <input
                type='text'
                readOnly
                value={shareData.copy || ""}
                className='w-full bg-transparent border-none text-sm text-zinc-600 focus:ring-0 p-0 truncate'
              />
            </div>
            <button
              onClick={handleCopy}
              className='p-2 hover:bg-white rounded-lg transition-colors text-zinc-500 hover:text-black hover:shadow-sm border border-transparent hover:border-zinc-200'
              title='Copy link'
            >
              {copied ? (
                <Check className='w-5 h-5 text-green-600' />
              ) : (
                <Copy className='w-5 h-5' />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
