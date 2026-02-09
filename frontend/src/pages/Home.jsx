import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { postService } from "../features/blog/services/post.service";
import { hubService } from "../features/blog/services/hub.service";
import {
  Loader2,
  Bookmark,
  MinusCircle,
  MoreHorizontal,
  ThumbsUpIcon,
  BarChart2,
  BotIcon,
  Share2,
} from "lucide-react";
import clsx from "clsx";

// --- UTILITY FUNCTION: Format Metrics ---
const formatMetric = (num) => {
  if (!num) return 0;
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num;
};

const formatRelativeDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  if (diffMs < 0)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });

  const seconds = Math.floor(diffMs / 1000);
  if (seconds < 60) return `${seconds}s ago`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

// --- COMPONENT: Minimal Post Card ---
const MinimalPostCard = ({ post }) => {
  const date = new Date(post.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <div className='flex items-start justify-between gap-8 py-8 border-b border-zinc-100 group'>
      {/* Left: Content */}
      <div className='flex-1 flex flex-col justify-center pl-10'>
        {/* Author Header */}
        <div className='flex items-center gap-2 mb-6 text-xs md:text-sm'>
          <div className='w-5 h-5 rounded-full bg-zinc-200 overflow-hidden'>
            <img
              src={post.author?.avatar || "https://via.placeholder.com/30"}
              alt=''
              className='w-full h-full object-cover'
            />
          </div>
          <span className='font-medium text-zinc-900 font-sans'>
            {post.author?.fullName}
          </span>
        </div>

        {/* Title & Summary */}
        <Link to={`/posts/${post.slug}`} className='block transition-opacity'>
          <h2 className='text-xl md:text-2xl font-extrabold text-zinc-900 leading-tight tracking-tight font-sans'>
            {post.title}
          </h2>
          <p className='hidden md:block text-zinc-600 font-sans leading-relaxed line-clamp-2 mb-4 text-[17px]'>
            {post.summary ||
              (post.content ? `${post.content.substring(0, 150)}...` : "")}
          </p>
        </Link>

        {/* Footer Actions & Metrics */}
        <div className='flex items-center justify-between mt-auto font-medium font-sans'>
          <div className='flex items-center gap-4 text-xs text-zinc-600'>
            {/* 1. Date */}
            <span>{date}</span>

            {/* 2. Likes (Yellow Star/Sparkles style like screenshot) */}
            <div className='flex items-center gap-1' title='Likes'>
              <ThumbsUpIcon className='w-3.5 h-3.5 text-zinc-600' />
              <span>{formatMetric(post.likesCount)}</span>
            </div>

            {/* 3. Views (Bar Chart icon like screenshot's 'hand' or 'eye') */}
            <div className='flex items-center gap-1' title='Views'>
              <BarChart2 className='w-3.5 h-3.5 text-zinc-600' />
              <span>{formatMetric(post.views)}</span>
            </div>

            {/* 4. Shares */}
            <div className='hidden sm:flex items-center gap-1' title='Shares'>
              <Share2 className='w-3.5 h-3.5 text-zinc-600' />
              <span>{formatMetric(post.sharesCount)}</span>
            </div>

            {/* 5. Read Time (Optional Pill) */}
            <span className='hidden sm:inline-block px-2 py-0.5 bg-zinc-100 rounded-full text-[10px] text-zinc-600 font-medium'>
              {post.readTime} min read
            </span>
          </div>

          {/* Right Side Icons */}
          <div className='flex items-center gap-3 text-zinc-600'>
            <button className='hover:text-zinc-800 transition-colors'>
              <BotIcon className='w-5 h-5 stroke-[1.5] cursor-pointer' />
            </button>
            <button className='hover:text-zinc-800 transition-colors cursor-pointer'>
              <MoreHorizontal className='w-5 h-5 stroke-[1.5]' />
            </button>
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
};

// --- MAIN PAGE COMPONENT ---
export default function Home() {
  const [activeTab, setActiveTab] = useState("For You");
  const [hubs, setHubs] = useState([]);
  const [posts, setPosts] = useState([]);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initData = async () => {
      try {
        const [hubsData, trendingData] = await Promise.all([
          hubService.getAllHubs(),
          postService.getTrending(),
        ]);
        setHubs(hubsData.data);
        setTrending(trendingData.data);
      } catch (err) {
        console.error(err);
      }
    };
    initData();
  }, []);

  useEffect(() => {
    const fetchFeed = async () => {
      setLoading(true);
      try {
        let data;
        if (activeTab === "For You") {
          data = await postService.getAllPosts({ limit: 10 });
          setPosts(data.data.posts);
        } else if (activeTab === "Featured") {
          res = await postService.getTrending();
          setPosts(res.data.posts);
        } else {
          const currentHub = hubs.find((h) => h.name === activeTab);
          if (currentHub) {
            data = await postService.getAllPosts({ hub: currentHub.slug });
            setPosts(data.data.posts);
          }
        }
      } catch (error) {
        console.error("Feed error", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeed();
  }, [activeTab, hubs]);

  const tabs = ["For You", "Featured", ...hubs.map((h) => h.name)];

  return (
    <div className='min-h-screen bg-white text-zinc-900 font-sans'>
      <div className='container mx-auto px-4 max-w-7xl'>
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-12'>
          {/* --- LEFT COLUMN: MAIN FEED --- */}
          <main className='lg:col-span-8 border-r border-zinc-100 min-h-screen pr-0 lg:pr-12'>
            {/* Navigation Tabs */}
            <div className='sticky top-16 bg-white/95 backdrop-blur-sm z-30 border-b border-zinc-100 pt-4 mb-6 pl-9'>
              <div className='flex items-center gap-6 overflow-x-auto no-scrollbar pb-[1px]'>
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={clsx(
                      "text-sm pb-4 whitespace-nowrap transition-colors relative cursor-pointer font-sans",
                      activeTab === tab
                        ? "text-black font-medium"
                        : "text-zinc-500 hover:text-zinc-800",
                    )}
                  >
                    {tab}
                    {activeTab === tab && (
                      <span className='absolute bottom-0 left-0 w-full h-[1px] bg-black'></span>
                    )}
                  </button>
                ))}
                <div className='w-4 flex-shrink-0'></div>
              </div>
            </div>

            {/* Post List */}
            {loading ? (
              <div className='py-20 flex justify-center'>
                <Loader2 className='animate-spin text-zinc-300' />
              </div>
            ) : (
              <div className='flex flex-col'>
                {posts.length > 0 ? (
                  posts.map((post) => (
                    <MinimalPostCard key={post._id} post={post} />
                  ))
                ) : (
                  // with icon
                  <div className='py-20 text-center text-zinc-500'>
                    <p>No stories found in {activeTab}.</p>
                  </div>
                )}
              </div>
            )}
          </main>

          {/* --- RIGHT COLUMN: SIDEBAR --- */}
          <aside className='hidden lg:block lg:col-span-4 py-10 pl-4 sticky top-16 h-fit'>
            <div className='mb-10'>
              <h4 className='font-bold text-zinc-900 mb-4 tracking-tight font-sans'>
                My Picks
              </h4>
              <div className='flex flex-col gap-5'>
                {trending.slice(0, 3).map((pick, idx) => (
                  <Link
                    to={`/posts/${pick.slug}`}
                    key={pick._id}
                    className='group'
                  >
                    <div className='flex items-center gap-2 mb-1 text-xs text-zinc-500'>
                      <div className='w-5 h-5 rounded-full bg-zinc-200 overflow-hidden'>
                        <img
                          src={
                            pick.author?.avatar ||
                            "https://via.placeholder.com/30"
                          }
                          alt=''
                          className='w-full h-full object-cover'
                        />
                      </div>
                      <span className='font-medium text-zinc-900 group-hover:underline'>
                        {pick.author?.fullName}
                      </span>
                    </div>
                    <h5 className='font-extrabold text-zinc-900 leading-snug mb-2  transition-opacity'>
                      {pick.title}
                    </h5>
                    <h4 className='hidden md:block text-zinc-600 font-medium font-sans text-[14px]'>
                      {formatRelativeDate(pick.createdAt)}
                    </h4>
                  </Link>
                ))}
              </div>
              <Link
                to='/trending'
                className='inline-block mt-4 text-sm text-zinc-600 hover:text-zinc-700 hover:underline'
              >
                See the full list
              </Link>
            </div>

            {/* Writing Promo */}
            <div className='bg-blue-50 rounded-lg p-6 mb-10 relative overflow-hidden'>
              <div className='relative z-10'>
                <h3 className='font-bold text-zinc-900 mb-2 font-display'>
                  Writing on EVEN
                </h3>
                <p className='text-sm text-zinc-600 mb-4 leading-relaxed'>
                  New writer FAQ
                  <br />
                  Expert writing advice
                  <br />
                  Grow your readership
                </p>
                <Link to='/write'>
                  <button className='bg-black text-white text-sm px-4 py-2 rounded-full hover:bg-zinc-800 transition-colors'>
                    Start writing
                  </button>
                </Link>
              </div>
              <div className='absolute -right-6 -bottom-6 w-24 h-24 bg-blue-200 rounded-full opacity-50 blur-xl'></div>
            </div>

            {/* Footer Links */}
            <div className='flex flex-wrap gap-x-4 gap-y-2 text-[11px] text-zinc-400'>
              <a href='#' className='hover:underline'>
                Help
              </a>
              <a href='#' className='hover:underline'>
                Status
              </a>
              <a href='#' className='hover:underline'>
                Writers
              </a>
              <a href='#' className='hover:underline'>
                Privacy
              </a>
              <a href='#' className='hover:underline'>
                Terms
              </a>
              <a href='#' className='hover:underline'>
                About
              </a>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
