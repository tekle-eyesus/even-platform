import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { hubService } from "../features/blog/services/hub.service";
import { postService } from "../features/blog/services/post.service";
import { interactionService } from "../features/blog/services/interaction.service";
import MinimalPostCard from "../features/blog/components/MinimalPostCard";
import { Loader2, Hash, Users, Check, ArrowLeft, BrainCog } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTitle } from "../hooks/useTitle";
import { Link } from "react-router-dom";

export default function HubDetail() {
  const { slug } = useParams();
  const { user } = useAuth();

  const [hub, setHub] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  useTitle(hub ? hub.name : "Tech Hub");

  const [isFollowing, setIsFollowing] = useState(false);
  const [subCount, setSubCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const hubsData = await hubService.getAllHubs();
        const currentHub = hubsData.data.find((h) => h.slug === slug);

        if (currentHub) {
          setHub(currentHub);
          setSubCount(currentHub.subscriberCount || 0);

          const postsPromise = postService.getAllPosts({
            hub: currentHub.slug,
          });

          let isSubscribed = false;
          if (user) {
            const myHubsRes = await interactionService.getMySubscribedHubs();
            const myHubs = myHubsRes.data || [];
            isSubscribed = myHubs.some((h) => h._id === currentHub._id);
          }

          const [postsData] = await Promise.all([postsPromise]);
          setPosts(postsData.data.posts);
          setIsFollowing(isSubscribed);
        }
      } catch (error) {
        console.error("Error fetching hub details", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug, user]);

  const handleFollowToggle = async () => {
    if (!user) return alert("Please login to follow this Hub");
    const newStatus = !isFollowing;
    setIsFollowing(newStatus);
    setSubCount((prev) => (newStatus ? prev + 1 : prev - 1));
    try {
      await interactionService.toggleHubSubscription(hub._id);
    } catch (error) {
      setIsFollowing(!newStatus);
      setSubCount((prev) => (newStatus ? prev - 1 : prev + 1));
      console.error("Failed to toggle subscription");
    }
  };

  if (loading)
    return (
      <div className='h-screen flex items-center justify-center bg-[#f7f6f3]'>
        <Loader2 className='animate-spin text-black/20' size={28} />
      </div>
    );

  if (!hub)
    return (
      <div className='h-screen flex flex-col items-center justify-center bg-[#f7f6f3]'>
        <p className='font-display text-2xl text-[#0a0a0a] mb-2'>
          Hub not found
        </p>
        <Link
          to='/hubs'
          className='text-sm text-black/40 hover:text-[#0a0a0a] transition-colors'
        >
          ← Back to Hubs
        </Link>
      </div>
    );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
        .font-display { font-family: 'DM Serif Display', serif; }
        .font-dm { font-family: 'DM Sans', sans-serif; }
        .animate-fade-up { animation: fadeUp 0.55s ease both; }
        .animate-fade-up-d1 { animation: fadeUp 0.55s ease 0.1s both; }
        .animate-fade-up-d2 { animation: fadeUp 0.55s ease 0.2s both; }
        .post-row { animation: fadeUp 0.4s ease both; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className='font-dm min-h-screen bg-[#f7f6f3]'>
        {/* ── HERO ── */}
        <section
          className='relative overflow-hidden border-b border-black/[0.06] px-6 pt-14 pb-14'
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000' fill-opacity='0.018'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        >
          {/* Decorative circles */}
          <div className='absolute -top-32 -right-32 w-[480px] h-[480px] rounded-full border border-black/[0.04] pointer-events-none' />
          <div className='absolute -top-14 -right-14 w-[300px] h-[300px] rounded-full border border-black/[0.05] pointer-events-none' />

          <div className='max-w-5xl mx-auto'>
            <div className='flex flex-col sm:flex-row sm:items-start gap-6 animate-fade-up-d1'>
              {/* Icon */}
              <div className='w-16 h-16 shrink-0 rounded-2xl border-[1.5px] border-black/[0.08] bg-white flex items-center justify-center text-black/25 shadow-[0_2px_12px_rgba(0,0,0,0.06)]'>
                <BrainCog size={24} />
              </div>

              {/* Text block */}
              <div className='flex-1'>
                <p className='text-[11px] font-semibold tracking-[0.18em] uppercase text-black/28 mb-2'>
                  Tech Hub
                </p>
                <h1 className='font-display text-[clamp(32px,5vw,58px)] leading-[1.06] text-[#0a0a0a] mb-4'>
                  {hub.name}
                </h1>
                <p className='text-[15px] text-black/42 font-light leading-relaxed max-w-2xl mb-7'>
                  {hub.description}
                </p>

                {/* Meta + follow row */}
                <div className='flex flex-wrap items-center gap-4'>
                  {/* Member count pill */}
                  <div className='flex items-center gap-2 h-9 px-4 rounded-full bg-white border-[1.5px] border-black/[0.07] text-[13px] font-medium text-black/45'>
                    <Users size={13} />
                    <span>
                      <strong className='text-[#0a0a0a] font-semibold'>
                        {subCount.toLocaleString()}
                      </strong>{" "}
                      followers
                    </span>
                  </div>

                  {/* Follow button */}
                  <button
                    onClick={handleFollowToggle}
                    className={`
                      h-9 px-5 flex items-center gap-1.5 rounded-full text-[13px] font-semibold transition-all duration-200 cursor-pointer
                      ${
                        isFollowing
                          ? "bg-[#0a0a0a] text-white hover:bg-[#1c1c1c] hover:shadow-[0_4px_14px_rgba(0,0,0,0.15)]"
                          : "bg-white text-black/50 border-[1.5px] border-black/[0.09] hover:border-[#0a0a0a] hover:text-[#0a0a0a] hover:shadow-[0_4px_12px_rgba(0,0,0,0.07)]"
                      }
                      hover:-translate-y-px
                    `}
                  >
                    {isFollowing ? (
                      <>
                        <Check size={13} /> Following
                      </>
                    ) : (
                      <>+ Follow {hub.name}</>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── POSTS FEED ── */}
        <section className='max-w-3xl mx-auto px-6 py-12'>
          {/* Section header */}
          <div className='flex items-center justify-between mb-8 animate-fade-up-d2'>
            <div>
              <p className='text-[11px] font-semibold tracking-[0.18em] uppercase text-black/25 mb-1'>
                Stories
              </p>
              <h2 className='font-display text-[26px] leading-tight text-[#0a0a0a]'>
                Latest in {hub.name}
              </h2>
            </div>
            {posts.length > 0 && (
              <span className='text-[12px] font-medium text-black/28'>
                {posts.length} {posts.length === 1 ? "story" : "stories"}
              </span>
            )}
          </div>

          {/* Divider */}
          <div className='h-px bg-black/[0.06] mb-8' />

          {posts.length > 0 ? (
            <div className='flex flex-col gap-0'>
              {posts.map((post, i) => (
                <div
                  key={post._id}
                  className='post-row border-b border-black/[0.05] last:border-0'
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <MinimalPostCard post={post} />
                </div>
              ))}
            </div>
          ) : (
            /* Empty state */
            <div className='flex flex-col items-center justify-center py-24 text-center'>
              <div className='w-14 h-14 rounded-2xl border-[1.5px] border-black/[0.07] bg-white flex items-center justify-center text-black/20 mb-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)]'>
                <Hash size={22} />
              </div>
              <p className='font-display text-[22px] text-[#0a0a0a] mb-2'>
                No stories yet
              </p>
              <p className='text-[13px] text-black/35 font-light max-w-xs'>
                Be the first to publish a story in the{" "}
                <span className='font-medium text-black/50'>{hub.name}</span>{" "}
                hub.
              </p>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
