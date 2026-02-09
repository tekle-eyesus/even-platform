import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { hubService } from "../features/blog/services/hub.service";
import { postService } from "../features/blog/services/post.service";
import MinimalPostCard from "../features/blog/components/MinimalPostCard"; // Reuse our component
import { Loader2, Hash, Users } from "lucide-react";

export default function HubDetail() {
  const { slug } = useParams();
  const [hub, setHub] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // 1. We need to find the Hub ID/Details from the slug
        // Since our API currently has getAllHubs, we might filter it client side
        // OR ideally, we have a getHubBySlug endpoint.
        // For MVP, let's fetch all and find (or update backend to support /hubs/:slug).
        // Let's assume we use the getAll for now to find the match.
        const hubsData = await hubService.getAllHubs();
        const currentHub = hubsData.data.find((h) => h.slug === slug);

        if (currentHub) {
          setHub(currentHub);
          // 2. Fetch Posts for this Hub
          const postsData = await postService.getAllPosts({
            hub: currentHub.slug,
          });
          setPosts(postsData.data.posts);
        }
      } catch (error) {
        console.error("Error fetching hub details");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  if (loading)
    return (
      <div className='h-screen flex items-center justify-center'>
        <Loader2 className='animate-spin' />
      </div>
    );
  if (!hub) return <div className='text-center py-20'>Tech Hub not found</div>;

  return (
    <div className='min-h-screen bg-white'>
      {/* Hero Header */}
      <div className='bg-[#F0EEE6] border-b border-zinc-100'>
        <div className='container mx-auto px-4 max-w-5xl py-12 md:py-16'>
          <div className='flex items-start gap-6'>
            <div className='w-16 h-16 md:w-20 md:h-20 bg-white rounded-2xl shadow-sm flex items-center justify-center text-zinc-900 border border-zinc-200'>
              <Hash className='w-8 h-8 md:w-10 md:h-10' />
            </div>
            <div>
              <h1 className='text-3xl md:text-5xl font-bold text-zinc-900 mb-4 font-ptserif'>
                {hub.name}
              </h1>
              <p className='text-xl text-zinc-500 max-w-2xl leading-relaxed mb-6 font-ptserif'>
                {hub.description}
              </p>

              <div className='flex items-center gap-6 text-sm'>
                <div className='flex items-center gap-2 text-zinc-600'>
                  <Users className='w-4 h-4' />
                  <span className='font-bold'>
                    {hub.subscriberCount || 0}
                  </span>{" "}
                  <span>Followers</span>
                </div>
                {/* Add 'Follow Hub' button here later if needed */}
                <button className='text-green-700 font-bold hover:underline'>
                  + Follow {hub.name}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Feed */}
      <div className='container mx-auto px-4 max-w-5xl py-10'>
        <h2 className='text-xl font-bold text-zinc-900 border-b border-zinc-100 pb-4 mb-6'>
          Latest Stories
        </h2>

        <div className='flex flex-col'>
          {posts.length > 0 ? (
            posts.map((post) => <MinimalPostCard key={post._id} post={post} />)
          ) : (
            <div className='py-12 text-zinc-500'>
              No stories published in this hub yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
