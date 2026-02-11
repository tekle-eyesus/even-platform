import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { PenTool, BookOpen, Users, Zap, Globe, Code } from "lucide-react";

export default function About() {
  return (
    <div className='min-h-screen bg-white font-sans text-zinc-900'>
      {/* 1. Hero Section */}
      <section className='py-20 md:py-32 border-b border-zinc-100'>
        <div className='container mx-auto px-4 max-w-4xl text-center'>
          <div className='inline-block px-3 py-1 mb-6 text-xs font-semibold tracking-wider text-green-700 uppercase bg-green-50 rounded-full'>
            Our Mission
          </div>
          <h1 className='text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight font-baskervville'>
            Where technology <br className='hidden md:block' /> meets{" "}
            <span className='text-zinc-500 font-display'>insight.</span>
          </h1>
          <p className='text-xl md:text-2xl text-zinc-500 font-serif leading-relaxed max-w-2xl mx-auto mb-10'>
            EVEN is a community of developers, data scientists, and tech
            enthusiasts sharing ideas that move the industry forward.
          </p>
          <div className='flex flex-col sm:flex-row items-center justify-center gap-4'>
            <Link to='/register'>
              <Button className='h-12 px-8 rounded-full bg-black text-white text-lg hover:bg-zinc-800 transition-all cursor-pointer'>
                Start Reading
              </Button>
            </Link>
            <Link to='/write'>
              <Button
                variant='outline'
                className='h-12 px-8 rounded-full border-zinc-200 text-zinc-600 hover:text-black hover:border-black text-lg transition-all cursor-pointer'
              >
                Start Writing
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Value Proposition Grid */}
      <section className='py-20 bg-[#F0EEE6]'>
        <div className='container mx-auto px-4 max-w-6xl'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-12'>
            {/* Feature 1 */}
            <div className='flex flex-col gap-4'>
              <div className='w-12 h-12 bg-white rounded-xl shadow-sm border border-zinc-100 flex items-center justify-center text-zinc-900'>
                <Zap className='w-6 h-6' />
              </div>
              <h3 className='text-xl font-bold'>No Fluff, Just Tech.</h3>
              <p className='text-zinc-500 leading-relaxed'>
                We prioritize deep technical content over clickbait. From AI
                algorithms to System Design, find content that actually teaches
                you something.
              </p>
            </div>

            {/* Feature 2 */}
            <div className='flex flex-col gap-4'>
              <div className='w-12 h-12 bg-white rounded-xl shadow-sm border border-zinc-100 flex items-center justify-center text-zinc-900'>
                <Users className='w-6 h-6' />
              </div>
              <h3 className='text-xl font-bold'>Community Driven.</h3>
              <p className='text-zinc-500 leading-relaxed'>
                Connect with authors directly. Clap for ideas you love, bookmark
                guides for later, and discuss implementation details in the
                threads.
              </p>
            </div>

            {/* Feature 3 */}
            <div className='flex flex-col gap-4'>
              <div className='w-12 h-12 bg-white rounded-xl shadow-sm border border-zinc-100 flex items-center justify-center text-zinc-900'>
                <Globe className='w-6 h-6' />
              </div>
              <h3 className='text-xl font-bold'>Global Tech Hubs.</h3>
              <p className='text-zinc-500 leading-relaxed'>
                Organized by ecosystem. Whether you are into Web3, AI, or
                DevOps, find your specific niche and dive deep without the
                noise.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. For Writers & Readers Split */}
      <section className='py-20 border-b border-zinc-100'>
        <div className='container mx-auto px-4 max-w-6xl'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-16 items-center'>
            {/* Left: Writers */}
            <div className='relative group p-8 rounded-3xl bg-black text-white overflow-hidden'>
              <div className='relative z-10'>
                <PenTool className='w-8 h-8 mb-6 text-zinc-400' />
                <h2 className='text-3xl font-bold mb-4'>
                  Share your knowledge.
                </h2>
                <p className='text-zinc-400 mb-8 leading-relaxed'>
                  Build your personal brand as a developer. Our clean,
                  distraction-free editor lets you focus on your code and ideas.
                </p>
                <Link
                  to='/write'
                  className='text-white font-bold underline underline-offset-4 decoration-zinc-500 hover:decoration-white transition-all'
                >
                  Write a story &rarr;
                </Link>
              </div>
              {/* Abstract Decoration */}
              <div className='absolute top-0 right-0 w-64 h-64 bg-zinc-800 rounded-full blur-3xl opacity-20 -mr-16 -mt-16'></div>
            </div>

            {/* Right: Readers */}
            <div className='relative group p-8 rounded-3xl bg-zinc-100 text-zinc-900 overflow-hidden'>
              <div className='relative z-10'>
                <BookOpen className='w-8 h-8 mb-6 text-zinc-500' />
                <h2 className='text-3xl font-bold mb-4'>Expand your mind.</h2>
                <p className='text-zinc-600 mb-8 leading-relaxed'>
                  Curated reading lists, personalized feeds, and direct access
                  to industry experts. Stop scrolling, start learning.
                </p>
                <Link
                  to='/register'
                  className='text-black font-bold underline underline-offset-4 decoration-zinc-300 hover:decoration-black transition-all'
                >
                  Get started &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Footer Simple */}
      <footer className='py-12 text-center'>
        <div className='flex items-center justify-center gap-2 font-bold text-xl tracking-tight text-zinc-900 mb-6'>
          <div className='w-8 h-8 bg-black rounded-full flex items-center justify-center text-white font-serif italic'>
            <img src='./logo3.png' alt='' />
          </div>
          <span className='font-display'>EVEN</span>
        </div>
        <div className='flex justify-center gap-6 text-sm text-zinc-500 mb-8'>
          <Link to='#' className='hover:text-black'>
            Privacy
          </Link>
          <Link to='#' className='hover:text-black'>
            Terms
          </Link>
          <Link to='#' className='hover:text-black'>
            Status
          </Link>
          <Link
            to='https://github.com/tekle-eyesus/even-platform'
            target='_blank'
            className='hover:text-black flex items-center gap-1'
          >
            <Code className='w-3 h-3' /> Open Source
          </Link>
        </div>
        <p className='text-xs text-zinc-400'>
          © {new Date().getFullYear()} Even Platform. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
