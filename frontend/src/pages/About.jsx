import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";
import {
  PenTool,
  BookOpen,
  Users,
  Zap,
  Globe,
  Code,
  ArrowRight,
} from "lucide-react";
import { useTitle } from "../hooks/useTitle";

export default function About() {
  useTitle("About Us");

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
      <div className='font-dm min-h-screen bg-[#f7f6f3] text-[#0a0a0a]'>
        {/* ── HERO ── */}
        <section
          className='relative overflow-hidden px-6 pt-24 pb-28 flex flex-col items-center text-center border-b border-black/[0.06]'
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000' fill-opacity='0.018'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        >
          {/* Decorative circles */}
          <div className='absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full border border-black/[0.04] pointer-events-none' />
          <div className='absolute -top-16 -right-16 w-[320px] h-[320px] rounded-full border border-black/[0.06] pointer-events-none' />

          <div className='animate-fade-up'>
            <span className='inline-block px-3.5 py-1 mb-7 text-[11px] font-semibold tracking-[0.18em] uppercase text-[#0a0a0a]/40 bg-black/[0.05] rounded-full border border-black/[0.06]'>
              Our Mission
            </span>
          </div>

          <h1 className='font-display text-[clamp(42px,7vw,88px)] leading-[1.04] max-w-4xl mx-auto mb-7 animate-fade-up-d1'>
            Where technology
            <br />
            meets <em className='not-italic text-[#0a0a0a]/35'>insight.</em>
          </h1>

          <p className='font-serif text-lg md:text-xl text-black/50  font-medium leading-relaxed max-w-xl mx-auto mb-10 animate-fade-up-d2'>
            EVEN is a community of developers, data scientists, and tech
            enthusiasts sharing ideas that move the industry forward.
          </p>

          <div className='flex flex-col sm:flex-row items-center justify-center gap-3 animate-fade-up-d3'>
            <Link to='/register'>
              <button className='h-12 px-8 flex items-center gap-2 text-sm font-semibold bg-[#0a0a0a] text-white rounded-[10px] transition-all duration-200 hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(0,0,0,0.16)]'>
                Start Reading <ArrowRight size={15} />
              </button>
            </Link>
            <Link to='/write'>
              <button className='h-12 px-8 text-sm font-semibold text-black/50 bg-white border-[1.5px] border-black/[0.09] rounded-[10px] transition-all duration-200 hover:border-[#0a0a0a] hover:text-[#0a0a0a] hover:-translate-y-px hover:shadow-[0_4px_12px_rgba(0,0,0,0.07)]'>
                Start Writing
              </button>
            </Link>
          </div>
        </section>

        {/* ── VALUE PROPS ── */}
        <section
          className='py-24 relative bg-cover bg-center mx-2 md:mx-4 lg:mx-6 rounded-2xl overflow-hidden'
          style={{
            backgroundImage: `linear-gradient(to right, #777E7E 0%, #777E7E 40%, transparent 100%), url("https://images.pexels.com/photos/17486102/pexels-photo-17486102.png")`,
          }}
        >
          <div className='max-w-6xl mx-auto px-8'>
            <p className='text-[18px] font-semibold tracking-[0.18em] uppercase text-white mb-14 text-center'>
              Why Even
            </p>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-px bg-white/[0.06] rounded-2xl overflow-hidden'>
              {[
                {
                  icon: Zap,
                  title: "No Fluff, Just Tech.",
                  body: "We prioritize deep technical content over clickbait. From AI algorithms to System Design, find content that actually teaches you something.",
                },
                {
                  icon: Users,
                  title: "Community Driven.",
                  body: "Connect with authors directly. Clap for ideas you love, bookmark guides for later, and discuss implementation details in the threads.",
                },
                {
                  icon: Globe,
                  title: "Global Tech Hubs.",
                  body: "Organized by ecosystem. Whether you're into Web3, AI, or DevOps, find your specific niche and dive deep without the noise.",
                },
              ].map(({ icon: Icon, title, body }) => (
                <div
                  key={title}
                  className='flex flex-col gap-5 p-10 bg-[#0a0a0a] hover:bg-white/[0.02] transition-colors duration-300'
                >
                  <div className='w-11 h-11 rounded-xl border border-white/[0.08] bg-white/[0.03] flex items-center justify-center text-white/50'>
                    <Icon size={18} />
                  </div>
                  <h3 className='font-display text-[22px] text-white'>
                    {title}
                  </h3>
                  <p className='text-sm text-white/38 leading-relaxed font-light'>
                    {body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── WRITERS / READERS SPLIT ── */}
        <section className='py-24 border-b border-black/[0.06]'>
          <div className='max-w-6xl mx-auto px-8'>
            <p className='text-[11px] font-semibold tracking-[0.18em] uppercase text-black/25 mb-14 text-center'>
              Built for everyone
            </p>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
              {/* Writers — dark card */}
              <div className='relative overflow-hidden rounded-2xl bg-[#0a0a0a] p-10 flex flex-col justify-between min-h-[340px] group'>
                {/* glow */}
                <div className='absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/[0.03] blur-3xl pointer-events-none group-hover:bg-white/[0.06] transition-all duration-700' />
                {/* grid texture */}
                <div
                  className='absolute inset-0 opacity-[0.04] pointer-events-none'
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23fff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                  }}
                />
                <div className='relative z-10'>
                  <div className='w-10 h-10 rounded-xl border border-white/[0.08] bg-white/[0.04] flex items-center justify-center text-white/40 mb-8'>
                    <PenTool size={16} />
                  </div>
                  <h2 className='font-display text-[32px] leading-[1.1] text-white mb-4'>
                    Share your
                    <br />
                    knowledge.
                  </h2>
                  <p className='text-sm text-white/38 leading-relaxed font-light max-w-xs'>
                    Build your personal brand as a developer. Our clean,
                    distraction-free editor lets you focus on what matters —
                    your ideas.
                  </p>
                </div>
                <Link
                  to='/write'
                  className='relative z-10 inline-flex items-center gap-2 mt-10 text-sm font-semibold text-white/50 hover:text-white transition-colors duration-200 group/link'
                >
                  Write a story
                  <ArrowRight
                    size={14}
                    className='group-hover/link:translate-x-0.5 transition-transform duration-200'
                  />
                </Link>
              </div>

              {/* Readers — light card */}
              <div className='relative overflow-hidden rounded-2xl bg-white p-10 flex flex-col justify-between min-h-[340px] border-[1.5px] border-black/[0.07] group'>
                <div className='absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-black/[0.02] blur-3xl pointer-events-none' />
                <div className='relative z-10'>
                  <div className='w-10 h-10 rounded-xl border border-black/[0.08] bg-black/[0.03] flex items-center justify-center text-black/30 mb-8'>
                    <BookOpen size={16} />
                  </div>
                  <h2 className='font-display text-[32px] leading-[1.1] text-[#0a0a0a] mb-4'>
                    Expand your
                    <br />
                    mind.
                  </h2>
                  <p className='text-sm text-black/42 leading-relaxed font-light max-w-xs'>
                    Curated reading lists, personalized feeds, and direct access
                    to industry experts. Stop scrolling, start learning.
                  </p>
                </div>
                <Link
                  to='/register'
                  className='relative z-10 inline-flex items-center gap-2 mt-10 text-sm font-semibold text-black/40 hover:text-[#0a0a0a] transition-colors duration-200 group/link'
                >
                  Get started
                  <ArrowRight
                    size={14}
                    className='group-hover/link:translate-x-0.5 transition-transform duration-200'
                  />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA BAND ── */}
        <section className='py-24 flex flex-col items-center text-center px-6'>
          <p className='text-[11px] font-semibold tracking-[0.18em] uppercase text-black/25 mb-5'>
            Ready to join?
          </p>
          <h2 className='font-display text-[clamp(32px,5vw,60px)] leading-[1.08] mb-6 max-w-xl mx-auto'>
            Start reading or writing
            <br />
            <em className='not-italic text-black/30'>today.</em>
          </h2>
          <p className='text-sm text-black/40 font-light mb-10 max-w-sm'>
            Free forever. No paywalls on great ideas.
          </p>
          <div className='flex flex-col sm:flex-row items-center gap-3'>
            <Link to='/register'>
              <button className='h-12 px-8 flex items-center gap-2 text-sm font-semibold bg-[#0a0a0a] text-white rounded-[10px] transition-all duration-200 hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(0,0,0,0.16)]'>
                Create free account <ArrowRight size={15} />
              </button>
            </Link>
            <Link to='/write'>
              <button className='h-12 px-8 text-sm font-semibold text-black/45 bg-white border-[1.5px] border-black/[0.09] rounded-[10px] transition-all duration-200 hover:border-[#0a0a0a] hover:text-[#0a0a0a] hover:-translate-y-px'>
                Explore articles
              </button>
            </Link>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className='border-t border-black/[0.06] py-10 px-8'>
          <div className='max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6'>
            <div className='flex items-center gap-2.5'>
              <div className='w-7 h-7 rounded-lg overflow-hidden border border-black/10 shrink-0'>
                <img
                  src='/logo3.png'
                  alt='Even'
                  className='w-full h-full object-cover'
                />
              </div>
              <span className='font-display text-lg text-[#0a0a0a]'>Even</span>
            </div>

            <div className='flex items-center gap-6 text-[13px] text-black/38'>
              {["Privacy", "Terms", "Status"].map((item) => (
                <Link
                  key={item}
                  to='#'
                  className='hover:text-[#0a0a0a] transition-colors'
                >
                  {item}
                </Link>
              ))}
              <Link
                to='https://github.com/tekle-eyesus/even-platform'
                target='_blank'
                className='flex items-center gap-1.5 hover:text-[#0a0a0a] transition-colors'
              >
                <Code size={12} /> Open Source
              </Link>
            </div>

            <p className='text-[12px] text-black/25'>
              © {new Date().getFullYear()} Even Platform
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
