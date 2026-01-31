import React, { useEffect, useState } from "react";
import Navbar from "../components/layout/Navbar";
import PostCard from "../features/blog/components/PostCard";
import { postService } from "../features/blog/services/post.service";
import { hubService } from "../features/blog/services/hub.service";
import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [trending, setTrending] = useState([]);
  const [hubs, setHubs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsData, trendingData, hubsData] = await Promise.all([
          postService.getAllPosts({ limit: 9 }),
          postService.getTrending(),
          hubService.getAllHubs(),
        ]);

        setPosts(postsData.data.posts);
        setTrending(trendingData.data);
        setHubs(hubsData.data);
      } catch (error) {
        console.error("Failed to fetch feed", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <Loader2 className='w-8 h-8 animate-spin text-zinc-400' />
      </div>
    );
  }

  // Get the first trending post for the BIG Hero card
  const heroPost = trending[0];

  return (
    <div className='min-h-screen bg-white'>
      <Navbar />

      <main className='container mx-auto px-4 py-8 max-w-7xl'>
        {/* 1. Tech Hubs Strip (Like "Most Search Tags" in img 1) */}
        <div className='flex items-center gap-4 overflow-x-auto pb-6 mb-8 border-b border-zinc-100 no-scrollbar'>
          <span className='text-sm font-bold text-zinc-900 whitespace-nowrap'>
            Tech Hubs:
          </span>
          {hubs.map((hub) => (
            <Link
              key={hub._id}
              to={`/hubs/${hub.slug}`}
              className='px-4 py-1.5 rounded-full text-sm font-medium bg-zinc-50 text-zinc-600 hover:bg-black hover:text-white transition-colors whitespace-nowrap'
            >
              {hub.name}
            </Link>
          ))}
        </div>

        {/* 2. Hero Section (Inspiration Image 1 - Large Card) */}
        {heroPost && (
          <section className='mb-16'>
            <div className='relative rounded-2xl overflow-hidden aspect-[21/9] group'>
              <div className='absolute inset-0'>
                <img
                  src={
                    heroPost.coverImage ||
                    "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop"
                  }
                  alt='Hero'
                  className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-105'
                />
                {/* Gradient Overlay for text readability */}
                <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent' />
              </div>

              <div className='absolute bottom-0 left-0 p-8 md:p-12 w-full md:w-2/3'>
                <span className='px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-md mb-4 inline-block'>
                  Trending Now
                </span>
                <h1 className='text-3xl md:text-5xl font-bold text-white mb-4 leading-tight'>
                  {heroPost.title}
                </h1>
                <div className='flex items-center gap-3 text-zinc-300'>
                  <img
                    src={heroPost.author?.avatar}
                    className='w-8 h-8 rounded-full border border-white/20'
                    alt=''
                  />
                  <span className='font-medium text-white'>
                    {heroPost.author?.fullName}
                  </span>
                  <span>•</span>
                  <span>
                    {new Date(heroPost.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 3. Latest Posts Grid */}
        <section>
          <div className='flex items-center justify-between mb-8'>
            <h2 className='text-2xl font-bold text-zinc-900'>
              Latest Articles
            </h2>
            <Link
              to='/search'
              className='text-sm font-medium text-zinc-500 hover:text-black'
            >
              View All
            </Link>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12'>
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
