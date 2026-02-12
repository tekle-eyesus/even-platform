import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { MoreHorizontal, Trash2, ThumbsUpIcon } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { postService } from "../services/post.service";
import { useToast } from "../../../context/ToastContext";

const formatMetric = (num) => {
  if (!num) return 0;
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num;
};

export default function MinimalPostCard({ post, onDelete }) {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Check if current user is the author
  const isOwner = user && post.author?._id === user._id;

  const date = new Date(post.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuRef]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this story?")) return;

    setIsDeleting(true);
    try {
      await postService.deletePost(post._id);
      showToast("Story deleted", "success");
      setShowMenu(false);

      // Notify parent to update the UI list
      if (onDelete) {
        onDelete(post._id);
      }
    } catch (error) {
      showToast("Failed to delete story", "error");
      setIsDeleting(false);
    }
  };

  if (isDeleting) return null;

  return (
    <div className='flex items-start justify-between gap-8 py-8 border-b border-zinc-100 group relative'>
      {/* Left: Content */}
      <div className='flex-1 flex flex-col justify-center'>
        {/* Author Header */}
        <div className='flex items-center gap-2 mb-2 text-xs md:text-sm'>
          <div className='w-5 h-5 rounded-full bg-zinc-200 overflow-hidden'>
            <img
              src={post.author?.avatar || "https://via.placeholder.com/30"}
              alt=''
              className='w-full h-full object-cover'
            />
          </div>
          <span className='font-medium text-zinc-900'>
            {post.author?.fullName}
          </span>
          {post.techHub && (
            <>
              <span className='text-zinc-400'>in</span>
              <span className='font-medium text-zinc-900'>
                {post.techHub.name || post.techHub}
              </span>
            </>
          )}
        </div>

        {/* Title & Summary */}
        <Link
          to={`/posts/${post.slug}`}
          className='block group-hover:opacity-80 transition-opacity'
        >
          <h2 className='text-xl md:text-2xl font-bold text-zinc-900 mb-2 leading-tight font-sans'>
            {post.title}
          </h2>
          <p className='hidden md:block text-zinc-500 font-serif leading-relaxed line-clamp-2 mb-4 text-[15px]'>
            {post.summary || post.content?.substring(0, 150) + "..."}
          </p>
        </Link>

        {/* Footer Actions & Metrics */}
        <div className='flex items-center justify-between mt-auto'>
          <div className='flex items-center gap-4 text-xs text-zinc-500'>
            <span>{date}</span>
            <div className='flex items-center gap-1' title='Likes'>
              <ThumbsUpIcon className='w-3.5 h-3.5 text-zinc-500' />
              <span>{formatMetric(post.likesCount)}</span>
            </div>
            <span className='hidden sm:inline-block px-2 py-0.5 bg-zinc-100 rounded-full text-[10px] text-zinc-600 font-medium'>
              {post.readTime || 3} min read
            </span>
          </div>

          <div className='flex items-center gap-2 text-zinc-400'>
            {isOwner && (
              <div className='relative' ref={menuRef}>
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className='hover:text-zinc-800 transition-colors p-1 rounded-full hover:bg-zinc-100 cursor-pointer'
                >
                  <MoreHorizontal className='w-5 h-5 stroke-[1.5]' />
                </button>

                {/* Dropdown Menu */}
                {showMenu && (
                  <div className='absolute right-0 bottom-8 w-32 bg-white rounded-lg shadow-xl border border-zinc-100 py-1 z-10 animate-in fade-in zoom-in-95'>
                    <button
                      onClick={handleDelete}
                      className='cursor-pointer w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2'
                    >
                      <Trash2 className='w-4 h-4' />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right: Image (Thumbnail) */}
      {post.coverImage && (
        <Link
          to={`/posts/${post.slug}`}
          className='hidden sm:block w-28 h-28 md:w-36 md:h-28 flex-shrink-0 bg-zinc-50 rounded-md overflow-hidden border border-zinc-100'
        >
          <img
            src={post.coverImage}
            alt={post.title}
            className='w-full h-full object-cover transform hover:scale-105 transition-transform duration-500'
          />
        </Link>
      )}
    </div>
  );
}
