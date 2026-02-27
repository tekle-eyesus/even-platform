import React, { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { commentService } from "../services/comment.service";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { MessageSquare, CornerDownRight, Loader2 } from "lucide-react"; // Note: Ensure you have these icons
import { clsx } from "clsx";
import { Link } from "react-router-dom";
import { PiHandsClapping } from "react-icons/pi";
// Helper to format date relative
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
};

export default function CommentItem({ comment, postId }) {
  const { user } = useAuth();

  // State for Interactions
  const [claps, setClaps] = useState(comment.clapsCount || 0);
  const [isClapped, setIsClapped] = useState(false); // We assume false initially for MVP
  const [replies, setReplies] = useState([]);
  const [repliesCount, setRepliesCount] = useState(comment.repliesCount || 0);

  // State for UI Logic
  const [showReplies, setShowReplies] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [isLoadingReplies, setIsLoadingReplies] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Handle Clapping
  const handleClap = async () => {
    if (!user) return alert("Login to clap!");

    // Optimistic Update
    const newStatus = !isClapped;
    setIsClapped(newStatus);
    setClaps((prev) => (newStatus ? prev + 1 : prev - 1));

    try {
      await commentService.toggleClap(comment._id);
    } catch (error) {
      // Revert
      setIsClapped(!newStatus);
      setClaps((prev) => (newStatus ? prev - 1 : prev + 1));
    }
  };

  // 2. Load Replies
  const handleToggleReplies = async () => {
    if (!showReplies && replies.length === 0 && repliesCount > 0) {
      setIsLoadingReplies(true);
      try {
        const data = await commentService.getReplies(comment._id);
        setReplies(data.data);
      } catch (error) {
        console.error("Failed to load replies");
      } finally {
        setIsLoadingReplies(false);
      }
    }
    setShowReplies(!showReplies);
  };

  // 3. Submit Reply
  const handleSubmitReply = async (e) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    setIsSubmitting(true);
    try {
      const newReply = await commentService.addComment(
        postId,
        replyContent,
        comment._id,
      );

      // Add new reply to list and expand
      setReplies([...replies, { ...newReply.data, author: user }]);
      setRepliesCount((prev) => prev + 1);
      setShowReplies(true);
      setIsReplying(false);
      setReplyContent("");
    } catch (error) {
      console.error("Failed to reply");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='flex gap-4 group'>
      {/* Avatar */}
      <div className='flex-shrink-0'>
        <div className='w-10 h-10 rounded-full bg-[#FDFDF8] overflow-hidden'>
          <img
            src={comment.author?.avatar || "https://via.placeholder.com/40"}
            alt=''
            className='w-full h-full object-cover'
          />
        </div>
      </div>

      <div className='flex-1'>
        {/* Comment Header */}
        <div className='bg-[#FDFDF8] rounded-2xl p-4 rounded-tl-none'>
          <div className='flex items-center justify-between mb-2'>
            <div className='flex items-center gap-2'>
              <span className='font-bold text-sm text-zinc-900'>
                {comment.author?.fullName}
              </span>
              <span className='text-xs text-zinc-500'>
                • {formatDate(comment.createdAt)}
              </span>
            </div>
          </div>
          <p className='text-zinc-700 text-sm leading-relaxed'>
            {comment.content}
          </p>
        </div>

        {/* Action Bar */}
        <div className='flex items-center gap-4 mt-2 ml-2'>
          <button
            onClick={handleClap}
            className={clsx(
              "flex items-center gap-1.5 text-xs font-medium transition-colors cursor-pointer",
              isClapped ? "text-black" : "text-zinc-500 hover:text-black",
            )}
          >
            <PiHandsClapping
              className={clsx("w-4 h-4", isClapped && "fill-black")}
            />
            {claps > 0 && <span>{claps}</span>}
          </button>

          <button
            onClick={() =>
              user ? setIsReplying(!isReplying) : alert("Login to reply")
            }
            className='flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-black transition-colors cursor-pointer'
          >
            <MessageSquare className='w-4 h-4' />
            Reply
          </button>
        </div>

        {/* Reply Input Form */}
        {isReplying && (
          <form
            onSubmit={handleSubmitReply}
            className='mt-4 flex gap-3 animate-in fade-in slide-in-from-top-2'
          >
            <div className='flex-1'>
              <Input
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder={`Reply to ${comment.author?.fullName}...`}
                className='bg-[#FDFDF8] border-none focus:outline-none focus:ring-0'
                autoFocus
              />
            </div>
            <Button
              disabled={isSubmitting}
              size='sm'
              className='bg-black text-[#FDFDF8] cursor-pointer'
            >
              {isSubmitting ? "Sending..." : "Send"}
            </Button>
          </form>
        )}

        {/* View Replies Toggle */}
        {repliesCount > 0 && (
          <button
            onClick={handleToggleReplies}
            className='mt-3 flex items-center gap-2 text-xs font-bold text-blue-600 hover:underline cursor-pointer'
          >
            <CornerDownRight className='w-3 h-3' />
            {showReplies ? "Hide Replies" : `View ${repliesCount} Replies`}
          </button>
        )}

        {/* Nested Replies List */}
        {showReplies && (
          <div className='mt-4 space-y-6 pl-4 border-l-2 border-zinc-100'>
            {isLoadingReplies ? (
              <Loader2 className='w-4 h-4 animate-spin text-zinc-400' />
            ) : (
              replies.map((reply) => (
                <CommentItem key={reply._id} comment={reply} postId={postId} />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
