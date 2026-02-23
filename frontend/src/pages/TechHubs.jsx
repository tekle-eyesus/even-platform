import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { hubService } from "../features/blog/services/hub.service";
import { interactionService } from "../features/blog/services/interaction.service";
import { Loader2, Users, Hash, ArrowRight, Search } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTitle } from "../hooks/useTitle";

export default function TechHubs() {
  const { user } = useAuth();
  const [hubs, setHubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  useTitle("Tech Hubs");

  useEffect(() => {
    const fetchHubs = async () => {
      try {
        setLoading(true);
        const data = await hubService.getAllHubs();
        setHubs(data.data);
      } catch (error) {
        console.error("Failed to fetch hubs", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHubs();
  }, []);

  const filtered = hubs.filter(
    (h) =>
      h.name.toLowerCase().includes(query.toLowerCase()) ||
      h.description?.toLowerCase().includes(query.toLowerCase()),
  );

  if (loading)
    return (
      <div className='h-screen flex items-center justify-center bg-[#f7f6f3]'>
        <Loader2 className='animate-spin text-black/20' size={28} />
      </div>
    );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
        .font-dm { font-family: 'DM Sans', sans-serif; }
        .animate-fade-up { animation: fadeUp 0.55s ease both; }
        .animate-fade-up-d1 { animation: fadeUp 0.55s ease 0.08s both; }
        .animate-fade-up-d2 { animation: fadeUp 0.55s ease 0.16s both; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .hub-card { animation: fadeUp 0.45s ease both; }
        input[type="search"]::-webkit-search-cancel-button { display: none; }
      `}</style>

      <div className='font-dm min-h-screen bg-[#f7f6f3]'>
        {/* ── HERO ── */}
        <section
          className='relative overflow-hidden border-b border-black/[0.06] px-6 pt-20 pb-16 flex flex-col items-center text-center'
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000' fill-opacity='0.018'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        >
          {/* Decorative circles */}
          <div className='absolute -top-28 -left-28 w-[420px] h-[420px] rounded-full border border-black/[0.04] pointer-events-none' />
          <div className='absolute -top-12 -left-12 w-[260px] h-[260px] rounded-full border border-black/[0.05] pointer-events-none' />
          <div className='absolute -bottom-28 -right-28 w-[380px] h-[380px] rounded-full border border-black/[0.04] pointer-events-none' />

          <div className='animate-fade-up'>
            <span className='inline-block px-3.5 py-1 mb-7 text-[11px] font-semibold tracking-[0.18em] uppercase text-[#0a0a0a]/38 bg-black/[0.05] rounded-full border border-black/[0.06]'>
              {hubs.length} Communities
            </span>
          </div>

          <h1 className='font-display text-[clamp(38px,6vw,72px)] leading-[1.06] max-w-2xl mb-5 animate-fade-up-d1'>
            Explore <em className='not-italic text-black/30'>Tech</em> Hubs
          </h1>

          <p className='text-base md:text-lg text-black/42 font-light leading-relaxed max-w-lg mb-10 animate-fade-up-d2'>
            Discover communities, follow your interests, and keep up with the
            latest trends in technology.
          </p>

          {/* Search */}
          <div className='animate-fade-up-d2 w-full max-w-md'>
            <div className='relative'>
              <span className='absolute left-4 top-1/2 -translate-y-1/2 text-black/25 pointer-events-none flex'>
                <Search size={16} />
              </span>
              <input
                type='search'
                placeholder='Search hubs…'
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className='
                  w-full h-12 pl-11 pr-4 rounded-[10px]
                  bg-white border-[1.5px] border-black/[0.09]
                  text-sm text-[#0a0a0a] placeholder:text-black/25
                  outline-none transition-all duration-200
                  focus:ring-0 focus:shadow-[0_0_0_3px_rgba(0,0,0,0.05)]
                '
              />
            </div>
          </div>
        </section>

        {/* ── GRID ── */}
        <section className='max-w-6xl mx-auto px-6 py-14'>
          {/* Count line */}
          <div className='flex items-center justify-between mb-8'>
            <p className='text-[11px] font-semibold tracking-[0.14em] uppercase text-black/28'>
              {filtered.length} {filtered.length === 1 ? "hub" : "hubs"} found
            </p>
            {query && (
              <button
                onClick={() => setQuery("")}
                className='text-[12px] font-medium text-black/38 hover:text-[#0a0a0a] transition-colors'
              >
                Clear search
              </button>
            )}
          </div>

          {filtered.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-24 text-center'>
              <div className='w-14 h-14 rounded-2xl border border-black/[0.07] bg-white flex items-center justify-center text-black/20 mb-5'>
                <Hash size={22} />
              </div>
              <p className='font-display text-2xl text-[#0a0a0a] mb-2'>
                No hubs found
              </p>
              <p className='text-sm text-black/38 font-light'>
                Try a different search term
              </p>
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
              {filtered.map((hub, i) => {
                return (
                  <Link
                    to={`/hubs/${hub.slug}`}
                    key={hub._id}
                    className='hub-card group relative flex flex-col bg-white rounded-2xl border-[1.5px] border-black/[0.07] p-7 overflow-hidden transition-all duration-300 hover:border-[#0a0a0a]/25 hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] hover:-translate-y-0.5'
                    style={{ animationDelay: `${i * 40}ms` }}
                  >
                    {/* Subtle top accent on hover */}
                    <div className='absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-black/0 to-transparent group-hover:via-black/10 transition-all duration-500' />

                    {/* Icon row */}
                    <div className='flex items-start justify-between mb-6'>
                      <div className='w-11 h-11 rounded-xl border border-black/[0.07] bg-[#f7f6f3] flex items-center justify-center text-black/30 group-hover:bg-[#0a0a0a] group-hover:text-white group-hover:border-transparent transition-all duration-300'>
                        <Hash size={17} />
                      </div>
                      <ArrowRight
                        size={16}
                        className='text-black/20 -translate-x-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 mt-1'
                      />
                    </div>

                    {/* Name + description */}
                    <h3 className='font-display text-[20px] leading-snug text-[#0a0a0a] mb-2'>
                      {hub.name}
                    </h3>
                    <p className='text-[13px] text-black/40 leading-relaxed line-clamp-2 font-light flex-1 mb-6'>
                      {hub.description}
                    </p>

                    {/* Footer row */}
                    <div className='flex items-center justify-between pt-5 border-t border-black/[0.06]'>
                      <div className='flex items-center gap-1.5 text-[12px] font-medium text-black/30'>
                        <Users size={13} />
                        <span>
                          {(hub.subscriberCount || 0).toLocaleString()} members
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
