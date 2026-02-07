import React, { useEffect, useState } from "react";
import { interactionService } from "../features/blog/services/interaction.service";
import MinimalPostCard from "../features/blog/components/MinimalPostCard";
import { Loader2 } from "lucide-react";
import { TbBookmarkOff } from "react-icons/tb";
import { CiBookmark } from "react-icons/ci";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";

export default function Library() {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        setLoading(true);
        // Backend returns array of post objects
        const data = await interactionService.getBookmarkedPosts();
        setBookmarks(data.data || []);
      } catch (error) {
        console.error("Failed to fetch library", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, []);

  return (
    <div className='min-h-screen bg-white'>
      <div className='container mx-auto px-4 max-w-5xl py-12'>
        {/* Header */}
        <div className='flex flex-col gap-6 mb-12'>
          <h1 className='text-4xl md:text-5xl font-bold text-zinc-900 tracking-tight'>
            Your Library
          </h1>

          {/* Tabs */}
          <div className='flex items-center gap-8 border-b border-zinc-100'>
            <button className='pb-4 text-sm font-medium text-black border-b border-black'>
              Saved list
            </button>
            <button className='pb-4 text-sm font-medium text-zinc-500 hover:text-zinc-800 transition-colors'>
              Reading history
            </button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className='flex justify-center py-20'>
            <Loader2 className='w-8 h-8 animate-spin text-zinc-300' />
          </div>
        ) : (
          <div className='grid grid-cols-1 lg:grid-cols-12 gap-12'>
            {/* Main List */}
            <div className='lg:col-span-8'>
              {bookmarks.length > 0 ? (
                <div className='flex flex-col'>
                  {bookmarks.map((post) => (
                    <MinimalPostCard key={post._id} post={post} />
                  ))}
                </div>
              ) : (
                <div className='py-20 text-center bg-zinc-50 rounded-xl border border-zinc-100 border-dashed'>
                  <div className='w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                    <TbBookmarkOff className='w-8 h-8 text-zinc-400' />
                  </div>
                  <h3 className='text-lg font-bold text-zinc-900 mb-2'>
                    No bookmarks yet
                  </h3>
                  <p className='text-zinc-500 mb-6 max-w-sm mx-auto'>
                    When you find stories you love, bookmark them to read later.
                    They will appear here.
                  </p>
                  <Link to='/'>
                    <Button className='bg-black text-white hover:bg-zinc-800 rounded-full'>
                      Browse Feed
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Sidebar (Optional - similar to Medium's library sidebar) */}
            <aside className='hidden lg:block lg:col-span-4 border-l border-zinc-100 pl-10 h-fit sticky top-24'>
              <h3 className='font-bold text-zinc-900 mb-2 text-sm'>
                Reading list
              </h3>
              <p className='text-xs text-zinc-500 mb-6 leading-relaxed'>
                Click the{" "}
                <span className='inline-block'>
                  <CiBookmark className='w-3 h-3 inline fill-black' />
                </span>{" "}
                on any story to easily add it to your reading list or a custom
                list that you can share.
              </p>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
