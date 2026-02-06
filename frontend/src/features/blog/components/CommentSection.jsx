import React, { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { commentService } from "../services/comment.service";
import CommentItem from "./CommentItem";
import { Button } from "../../../components/ui/Button";
import { Loader2, Send } from "lucide-react";
import { Link } from "react-router-dom";

export default function CommentSection({ postId }) {
  const { user } = useAuth();

  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const data = await commentService.getPostComments(postId);
        setComments(data.data.comments);
      } catch (error) {
        console.error("Error fetching comments", error);
      } finally {
        setLoading(false);
      }
    };
    if (postId) fetchComments();
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await commentService.addComment(postId, newComment);
      // Prepend new comment to list
      setComments([{ ...response.data, author: user }, ...comments]);
      setNewComment("");
    } catch (error) {
      console.error("Error posting comment", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className='py-10 flex justify-center'>
        <Loader2 className='animate-spin text-zinc-300' />
      </div>
    );

  return (
    <section className='border-t border-zinc-100 bg-white py-12'>
      <div className='container mx-auto px-4 max-w-3xl'>
        <h3 className='text-2xl font-bold text-zinc-900 mb-8'>
          Comments ({comments.length})
        </h3>

        {/* 1. Add Comment Box */}
        {user ? (
          <div className='flex gap-4 mb-12'>
            <div className='w-10 h-10 rounded-full bg-zinc-200 overflow-hidden flex-shrink-0'>
              <img
                src={user.avatar}
                alt=''
                className='w-full h-full object-cover'
              />
            </div>
            <form onSubmit={handleSubmit} className='flex-1 relative'>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder='What are your thoughts?'
                className='w-full min-h-[100px] p-4 rounded-xl bg-zinc-50 border-none focus:outline-none focus:ring-0 resize-none text-zinc-700'
              />
              <div className='absolute bottom-3 right-3'>
                <Button
                  disabled={isSubmitting || !newComment.trim()}
                  size='sm'
                  className='bg-black text-white rounded-full px-4 cursor-pointer'
                >
                  {isSubmitting ? "Posting..." : "Respond"}
                </Button>
              </div>
            </form>
          </div>
        ) : (
          <div className='bg-zinc-50 p-6 rounded-xl text-center mb-12'>
            <p className='text-zinc-600 mb-4'>
              Join the conversation to share your thoughts.
            </p>
            <Link to='/login'>
              <Button variant='outline'>Log in to Comment</Button>
            </Link>
          </div>
        )}

        {/* 2. Comments List */}
        <div className='space-y-8'>
          {comments.length > 0 ? (
            comments.map((comment) => (
              <CommentItem
                key={comment._id}
                comment={comment}
                postId={postId}
              />
            ))
          ) : (
            <p className='text-zinc-400 text-center py-8'>
              No comments yet. Be the first to share your thoughts!
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
