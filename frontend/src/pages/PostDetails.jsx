import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import { postService } from "../features/blog/services/post.service";
import { interactionService } from "../features/blog/services/interaction.service";
import { useAuth } from "../context/AuthContext";
import { Loader2, Heart, Bookmark, MessageCircle, Share2 } from "lucide-react";
import { Button } from "../components/ui/Button";
import clsx from "clsx";
import CommentSection from "../features/blog/components/CommentSection";
import { commentService } from "../features/blog/services/comment.service";
import ShareModal from "../features/blog/components/ShareModal";

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
  const [comments, setComments] = useState([]);

  // --- SHARE STATE ---
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [shareLinks, setShareLinks] = useState(null);

  // Fetch Data
  useEffect(() => {
    const fetchPostData = async () => {
      try {
        setLoading(true);
        // 1. Get Post Details
        const data = await postService.getPostBySlug(slug);
        const currentPost = data.data;
        setPost(currentPost);
        const commentData = await commentService.getPostComments(
          currentPost._id,
        );
        setComments(commentData.data.comments);
        setLikesCount(currentPost.likesCount || 0);

        // 2. If User is logged in, fetch interaction statuses
        if (user) {
          const [likeStatus, bookmarkStatus, followingList] = await Promise.all(
            [
              interactionService.getLikeStatus(currentPost._id),
              interactionService.getBookmarkStatus(currentPost._id),
              interactionService.getMyFollowedAuthors(),
            ],
          );

          setIsLiked(likeStatus.data.hasLiked);
          setIsBookmarked(bookmarkStatus.data.isBookmarked);

          const isFollowingAuthor = followingList.data.some(
            (author) => author._id === currentPost.author._id,
          );
          setIsFollowing(isFollowingAuthor);
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
    const newStatus = !isLiked;
    setIsLiked(newStatus);
    setLikesCount((prev) => (newStatus ? prev + 1 : prev - 1));

    try {
      await interactionService.toggleLike(post._id);
    } catch (error) {
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

  const handleShare = async () => {
    try {
      const data = await interactionService.getShareLinks(post._id);
      setShareLinks(data.data);
      setIsShareOpen(true);
    } catch (error) {
      console.error("Failed to get share links", error);
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
    <div className='min-h-screen bg-white pb-20 font-sans'>
      {/* 1. Header Section (Title, Summary, Author) */}
      <header className='container mx-auto px-4 pt-10 pb-8 max-w-3xl text-center'>
        <div className='flex flex-col items-center gap-4'>
          {post.techHub && (
            <Link
              to={`/hubs/${post.techHub.slug}`}
              className='text-blue-600 font-semibold text-sm tracking-wide uppercase hover:underline'
            >
              {post.techHub.name}
            </Link>
          )}

          <h1 className='text-4xl md:text-5xl font-extrabold text-zinc-900 leading-[1.15] tracking-tight'>
            {post.title}
          </h1>

          <p className='text-xl text-zinc-500 font-serif leading-relaxed line-clamp-3'>
            {post.summary}
          </p>
        </div>

        {/* Author Meta */}
        <div className='flex items-center justify-center gap-4 mt-8'>
          <Link
            to={`/u/${post.author.username}`}
            className='w-12 h-12 rounded-full p-[2px] bg-gradient-to-tr from-zinc-200 to-white hover:scale-105 transition-transform'
          >
            <img
              src={post.author.avatar}
              alt={post.author.fullName}
              className='w-full h-full rounded-full object-cover border border-white'
            />
          </Link>
          <div className='text-left'>
            <div className='flex items-center gap-2'>
              <Link
                to={`/u/${post.author.username}`}
                className='font-bold text-zinc-900 hover:underline'
              >
                {post.author.fullName}
              </Link>
              {user?._id !== post.author._id && (
                <button
                  onClick={handleFollow}
                  className={clsx(
                    "text-xs px-2 py-0.5 rounded-full font-medium transition-colors cursor-pointer",
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
              {new Date(post.createdAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}{" "}
              · {post.readTime} min read
            </div>
          </div>
        </div>
      </header>

      {/* 2. Cover Image */}
      {post.coverImage && (
        <div className='container mx-auto px-4 max-w-5xl mb-12'>
          <div className='aspect-[2/1] md:aspect-[21/9] rounded-xl overflow-hidden shadow-sm bg-zinc-100'>
            <img
              src={post.coverImage}
              alt={post.title}
              className='w-full h-full object-cover'
            />
          </div>
        </div>
      )}

      <div className='container mx-auto px-4 max-w-5xl flex relative'>
        {/* 3. Floating Sidebar (Desktop Actions) */}
        <aside className='hidden lg:flex flex-col gap-6 sticky top-32 h-fit mr-8 xl:-ml-16'>
          <div className='flex flex-col items-center gap-1'>
            <Button
              variant='ghost'
              onClick={handleLike}
              className={clsx(
                "rounded-full p-3 h-10 w-10 border transition-all",
                isLiked
                  ? "border-transparent bg-red-50 text-red-600"
                  : "border-zinc-200 text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900",
              )}
            >
              <Heart className={clsx("w-5 h-5", isLiked && "fill-current")} />
            </Button>
            <span className='text-xs font-medium text-zinc-500'>
              {likesCount}
            </span>
          </div>

          <div className='flex flex-col items-center gap-1'>
            <Button
              variant='ghost'
              className='rounded-full p-3 h-10 w-10 border border-zinc-200 text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900'
            >
              <MessageCircle className='w-5 h-5' />
            </Button>
            <span className='text-xs font-medium text-zinc-500'>
              {comments.length}
            </span>
          </div>

          <Button
            variant='ghost'
            onClick={handleBookmark}
            className={clsx(
              "rounded-full p-3 h-10 w-10 border transition-all",
              isBookmarked
                ? "border-transparent bg-zinc-900 text-white hover:bg-zinc-700"
                : "border-zinc-200 text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900",
            )}
          >
            <Bookmark
              className={clsx("w-5 h-5", isBookmarked && "fill-current")}
            />
          </Button>

          <Button
            variant='ghost'
            onClick={handleShare} // Connect handler
            className='rounded-full p-3 h-10 w-10 border border-zinc-200 text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900'
          >
            <Share2 className='w-5 h-5' />
          </Button>
        </aside>

        {/* 4. Main Content (HTML Rendered) */}
        <article className='flex-1 max-w-3xl mx-auto'>
          <div
            className='prose prose-lg prose-zinc max-w-none 
                prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-zinc-900
                prose-p:leading-relaxed prose-p:text-zinc-800
                prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                prose-img:rounded-xl prose-img:shadow-sm prose-img:my-8
                prose-blockquote:border-l-4 prose-blockquote:border-zinc-900 prose-blockquote:pl-4 prose-blockquote:italic
                '
            // DangerouslySetInnerHTML is required to render the HTML from Tiptap
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Tags Footer */}
          <div className='mt-16 pt-7 mb-4 border-t border-zinc-100'>
            <div className='flex gap-2 flex-wrap'>
              {post.tags.map((tag) => (
                <Link
                  to={`/search?q=${tag}`}
                  key={tag}
                  className='px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-600 rounded-full text-sm transition-colors'
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        </article>
      </div>

      <CommentSection postId={post._id} />
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        shareData={shareLinks}
      />

      {/* Mobile Sticky Action Bar */}
      <div className='lg:hidden fixed bottom-0 left-0 w-full bg-white border-t border-zinc-200 p-3 flex justify-around z-40 pb-6 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]'>
        <button
          onClick={handleLike}
          className='flex items-center gap-2 text-zinc-600 cursor-pointer'
        >
          <Heart
            className={clsx("w-5 h-5", isLiked && "fill-red-500 text-red-500")}
          />
          <span className='text-sm font-medium'>{likesCount}</span>
        </button>
        <button className='flex items-center gap-2 text-zinc-600 cursor-pointer'>
          <MessageCircle className='w-5 h-5' />
          <span className='text-sm font-medium'>{comments.length}</span>
        </button>
        <button
          onClick={handleBookmark}
          className='text-zinc-600 cursor-pointer'
        >
          <Bookmark
            className={clsx("w-5 h-5", isBookmarked && "fill-black text-black")}
          />
        </button>
      </div>
    </div>
  );
}
