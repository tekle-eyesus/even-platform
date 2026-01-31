import React from "react";
import { Link } from "react-router-dom";
import { Calendar } from "lucide-react";

export default function PostCard({ post }) {
  // Format Date
  const date = new Date(post.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className='group flex flex-col gap-4'>
      {/* Image Container */}
      <Link
        to={`/posts/${post.slug}`}
        className='overflow-hidden rounded-xl bg-zinc-100 aspect-[16/10]'
      >
        {post.coverImage ? (
          <img
            src={post.coverImage}
            alt={post.title}
            className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-105'
          />
        ) : (
          <div className='w-full h-full flex items-center justify-center text-zinc-400 bg-zinc-100'>
            No Image
          </div>
        )}
      </Link>

      {/* Content */}
      <div className='flex flex-col gap-2'>
        {/* Badge */}
        {post.techHub && (
          <span className='inline-block px-2.5 py-0.5 rounded-md bg-zinc-100 text-zinc-600 text-xs font-semibold w-fit'>
            {post.techHub.name}
          </span>
        )}

        <Link to={`/posts/${post.slug}`}>
          <h3 className='text-xl font-bold text-zinc-900 leading-tight group-hover:text-zinc-600 transition-colors'>
            {post.title}
          </h3>
        </Link>

        {/* Meta */}
        <div className='flex items-center gap-3 text-sm text-zinc-500 mt-1'>
          <div className='flex items-center gap-2'>
            <div className='w-6 h-6 rounded-full bg-zinc-200 overflow-hidden'>
              <img
                src={post.author?.avatar || "https://via.placeholder.com/30"}
                alt=''
              />
            </div>
            <span className='font-medium text-zinc-700'>
              {post.author?.fullName}
            </span>
          </div>
          <span>•</span>
          <div className='flex items-center gap-1'>
            <Calendar className='w-3 h-3' />
            {date}
          </div>
        </div>
      </div>
    </div>
  );
}
