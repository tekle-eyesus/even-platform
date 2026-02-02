import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import { postService } from "../features/blog/services/post.service";
import { interactionService } from "../features/blog/services/interaction.service";
import { useAuth } from "../context/AuthContext";
import {
  Loader2,
  Heart,
  Bookmark,
  Share2,
  MessageCircle,
  UserPlus,
  Check,
} from "lucide-react";
import { Button } from "../components/ui/Button";
import clsx from "clsx";
import CommentSection from "../features/blog/components/CommentSection";

export default function PostDetails() {
  const { slug } = useParams();
  const { user } = useAuth();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  // Interaction States
  const [likesCount, setLikesCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  // Fetch Data
  useEffect(() => {
    const fetchPostData = async () => {
      try {
        setLoading(true);
        // 1. Get Post Details
        const data = await postService.getPostBySlug(slug);
        setPost(data.data);
        setLikesCount(data.data.likesCount || 0);

        // 2. If User is logged in, fetch interaction statuses
        if (user) {
          const [likeStatus, bookmarkStatus] = await Promise.all([
            interactionService.getLikeStatus(data.data._id),
            interactionService.getBookmarkStatus(data.data._id),
          ]);
          setIsLiked(likeStatus.data.hasLiked);
          setIsBookmarked(bookmarkStatus.data.isBookmarked);
          // Note: We'd need a separate check for "isFollowing" usually,
          // or we pass it in the author object. For MVP, we toggle blindly or assume false.
        }
      } catch (error) {
        console.error("Error fetching post", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPostData();
  }, [slug, user]);

  // Handlers
  const handleLike = async () => {
    if (!user) return alert("Please login to like");
    // Optimistic Update
    const newStatus = !isLiked;
    setIsLiked(newStatus);
    setLikesCount((prev) => (newStatus ? prev + 1 : prev - 1));

    try {
      await interactionService.toggleLike(post._id);
    } catch (error) {
      // Revert if error
      setIsLiked(!newStatus);
      setLikesCount((prev) => (newStatus ? prev - 1 : prev + 1));
    }
  };

  const handleBookmark = async () => {
    if (!user) return alert("Please login to bookmark");
    setIsBookmarked(!isBookmarked);
    try {
      await interactionService.toggleBookmark(post._id);
    } catch (error) {
      setIsBookmarked(!isBookmarked);
    }
  };

  const handleFollow = async () => {
    if (!user) return alert("Please login to follow");
    setIsFollowing(!isFollowing);
    try {
      await interactionService.toggleFollow(post.author._id);
    } catch (error) {
      setIsFollowing(!isFollowing);
    }
  };

  if (loading)
    return (
      <div className='h-screen flex items-center justify-center'>
        <Loader2 className='animate-spin' />
      </div>
    );
  if (!post) return <div className='text-center py-20'>Post not found</div>;

  return (
    <div className='min-h-screen bg-white pb-20'>
      <Navbar />

      {/* 1. Header Section */}
      <header className='container mx-auto px-4 pt-12 pb-8 max-w-4xl text-center'>
        {post.techHub && (
          <Link
            to={`/hubs/${post.techHub.slug}`}
            className='text-blue-600 font-semibold text-sm tracking-wide uppercase mb-4 inline-block hover:underline'
          >
            {post.techHub.name}
          </Link>
        )}
        <h1 className='text-4xl md:text-5xl font-bold text-zinc-900 leading-tight mb-6'>
          {post.title}
        </h1>
        <p className='text-xl text-zinc-500 font-light leading-relaxed mb-8'>
          {post.summary || "A deep dive into the technology ecosystem."}
        </p>

        {/* Author Meta */}
        <div className='flex items-center justify-center gap-4'>
          <img
            src={post.author.avatar}
            alt=''
            className='w-12 h-12 rounded-full border border-zinc-100'
          />
          <div className='text-left'>
            <div className='flex items-center gap-2'>
              <span className='font-bold text-zinc-900'>
                {post.author.fullName}
              </span>
              {user?._id !== post.author._id && (
                <button
                  onClick={handleFollow}
                  className={clsx(
                    "text-xs px-2 py-0.5 rounded-full font-medium transition-colors",
                    isFollowing
                      ? "bg-green-100 text-green-700"
                      : "text-blue-600 hover:bg-blue-50",
                  )}
                >
                  {isFollowing ? "Following" : "Follow"}
                </button>
              )}
            </div>
            <div className='text-sm text-zinc-500'>
              {new Date(post.createdAt).toLocaleDateString()} · {post.readTime}{" "}
              min read
            </div>
          </div>
        </div>
      </header>

      {/* 2. Cover Image */}
      <div className='container mx-auto px-4 max-w-5xl mb-12'>
        <div className='aspect-[21/9] rounded-2xl overflow-hidden bg-zinc-100'>
          {post.coverImage && (
            <img
              src={post.coverImage}
              alt={post.title}
              className='w-full h-full object-cover'
            />
          )}
        </div>
      </div>

      <div className='container mx-auto px-4 max-w-6xl flex relative'>
        {/* 3. Floating Sidebar (Desktop Actions) */}
        <aside className='hidden lg:flex flex-col gap-6 sticky top-32 h-fit mr-12 ml-4'>
          <div className='flex flex-col items-center gap-2'>
            <Button
              variant='ghost'
              onClick={handleLike}
              className={clsx(
                "rounded-full p-3 h-12 w-12 border",
                isLiked
                  ? "border-red-200 bg-red-50 text-red-600"
                  : "border-zinc-200 text-zinc-500 hover:bg-zinc-100",
              )}
            >
              <Heart className={clsx("w-5 h-5", isLiked && "fill-current")} />
            </Button>
            <span className='text-sm font-medium text-zinc-500'>
              {likesCount}
            </span>
          </div>

          <Button
            variant='ghost'
            className='rounded-full p-3 h-12 w-12 border border-zinc-200 text-zinc-500 hover:bg-zinc-100'
          >
            <MessageCircle className='w-5 h-5' />
          </Button>

          <Button
            variant='ghost'
            onClick={handleBookmark}
            className={clsx(
              "rounded-full p-3 h-12 w-12 border",
              isBookmarked
                ? "border-black bg-black text-white hover:bg-zinc-800"
                : "border-zinc-200 text-zinc-500 hover:bg-zinc-100",
            )}
          >
            <Bookmark
              className={clsx("w-5 h-5", isBookmarked && "fill-current")}
            />
          </Button>
        </aside>

        {/* 4. Main Content */}
        <article className='flex-1 max-w-3xl mx-auto'>
          {/* 
               Typography Plugin Class: 'prose' 
               This automatically styles h1, h2, p, ul, img inside the div 
            */}
          <div
            className='prose prose-lg prose-zinc max-w-none 
                prose-headings:font-bold prose-headings:tracking-tight 
                prose-a:text-blue-600 prose-img:rounded-xl'
          >
            {/* 
                   Safety Note: In production, use a sanitizer library like 'dompurify' 
                   before rendering user HTML.
                */}
            {post.content.split("\n").map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p> // Simple text render for now, replace with dangerousHTML if your backend sends HTML
            ))}
          </div>

          {/* Tags Footer */}
          <div className='mt-12 pt-8 border-t border-zinc-100'>
            <div className='flex gap-2 flex-wrap'>
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className='px-3 py-1 bg-zinc-100 text-zinc-600 rounded-full text-sm'
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </article>
      </div>
      <CommentSection postId={post._id} />
      {/* Mobile Sticky Action Bar */}
      <div className='lg:hidden fixed bottom-0 left-0 w-full bg-white border-t border-zinc-200 p-4 flex justify-around z-40 pb-6'>
        <button
          onClick={handleLike}
          className='flex items-center gap-2 text-zinc-600'
        >
          <Heart
            className={clsx("w-5 h-5", isLiked && "fill-red-500 text-red-500")}
          />
          <span>{likesCount}</span>
        </button>
        <button className='flex items-center gap-2 text-zinc-600'>
          <MessageCircle className='w-5 h-5' />
        </button>
        <button onClick={handleBookmark} className='text-zinc-600'>
          <Bookmark
            className={clsx("w-5 h-5", isBookmarked && "fill-black text-black")}
          />
        </button>
      </div>
    </div>
  );
}
