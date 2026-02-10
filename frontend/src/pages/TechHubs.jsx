import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { hubService } from "../features/blog/services/hub.service";
import { interactionService } from "../features/blog/services/interaction.service";
import { Loader2, Users, Hash, ArrowRight } from "lucide-react";
import { Button } from "../components/ui/Button";
import { useAuth } from "../context/AuthContext";
import clsx from "clsx";

export default function TechHubs() {
  const { user } = useAuth();
  const [hubs, setHubs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Track which hubs the user has joined (locally for UI toggle)
  const [joinedHubs, setJoinedHubs] = useState({});

  useEffect(() => {
    const fetchHubs = async () => {
      try {
        setLoading(true);
        const data = await hubService.getAllHubs();
        setHubs(data.data);
        // If user is logged in, we can also fetch which hubs they've joined to set initial state
      } catch (error) {
        console.error("Failed to fetch hubs", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHubs();
  }, []);

  const handleJoin = async (e, hubId) => {
    e.preventDefault(); // Prevent link navigation
    if (!user) return alert("Please login to join a Hub");

    // Optimistic UI update
    setJoinedHubs((prev) => ({
      ...prev,
      [hubId]: !prev[hubId],
    }));

    try {
      await interactionService.toggleFollow(hubId); // Note: Ensure backend supports Hub ID here or use specific Hub toggle endpoint
    } catch (error) {
      // Revert on error
      setJoinedHubs((prev) => ({
        ...prev,
        [hubId]: !prev[hubId],
      }));
    }
  };

  if (loading)
    return (
      <div className='h-screen flex items-center justify-center'>
        <Loader2 className='animate-spin text-zinc-300' />
      </div>
    );

  return (
    <div className='min-h-screen bg-white'>
      {/* Header */}
      <div className='bg-[#F0EEE6] border-b border-zinc-100 py-16'>
        <div className='container mx-auto px-4 max-w-6xl text-center'>
          <h1 className='text-4xl md:text-5xl font-bold text-zinc-900 mb-4 tracking-tight font-clash'>
            Explore Tech Hubs
          </h1>
          <p className='text-[30px] text-zinc-500 max-w-2xl mx-auto font-clash-extralight'>
            Discover communities, follow your interests, and keep up with the
            latest trends in technology.
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className='container mx-auto px-4 max-w-6xl py-12'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {hubs.map((hub) => (
            <Link
              to={`/hubs/${hub.slug}`}
              key={hub._id}
              className='group flex flex-col p-6 rounded-2xl border border-zinc-200 hover:border-black/20 hover:shadow-lg transition-all duration-300 bg-white'
            >
              <div className='flex items-start justify-between mb-4'>
                <div className='w-12 h-12 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-600 group-hover:bg-black group-hover:text-white transition-colors'>
                  <Hash className='w-6 h-6' />
                </div>
                <div className='opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0'>
                  <ArrowRight className='w-5 h-5 text-zinc-400' />
                </div>
              </div>

              <h3 className='text-xl font-bold text-zinc-900 mb-2  transition-colors font-display'>
                {hub.name}
              </h3>
              <p className='text-sm text-zinc-500 mb-6 line-clamp-2 leading-relaxed flex-1 font-sans'>
                {hub.description}
              </p>

              <div className='flex items-center justify-between pt-4 border-t border-zinc-100'>
                <div className='flex items-center gap-2 text-xs font-medium text-zinc-400'>
                  <Users className='w-3.5 h-3.5' />
                  <span>{hub.subscriberCount || 0} Members</span>
                </div>
                <span className='text-xs font-bold text-zinc-900 bg-zinc-100 px-2 py-1 rounded-md'>
                  View Hub
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
