import React from "react";
import { Link } from "react-router-dom";
import { cn } from "../../../lib/utils";

export function PostCard({ post, className }) {
    const { title, summary, author, techHub, createdAt, slug, readTime, coverImage } = post;

    return (
        <div className={cn("flex gap-4 group cursor-pointer border-b border-border/40 pb-8 last:border-0", className)}>
            <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    {author.avatar && (
                        <img src={author.avatar} alt={author.username} className="h-5 w-5 rounded-full object-cover" />
                    )}
                    <span className="font-medium text-foreground">{author.fullName}</span>
                    <span>in</span>
                    <span className="font-medium text-foreground">{techHub.name}</span>
                    <span>·</span>
                    <span>{new Date(createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                </div>

                <Link to={`/post/${slug}`} className="block group">
                    <h2 className="text-xl font-bold font-serif group-hover:underline decoration-offset-4 mb-1">
                        {title}
                    </h2>
                    <p className="text-muted-foreground line-clamp-3 text-base leading-relaxed">
                        {summary}
                    </p>
                </Link>

                <div className="flex items-center gap-3 text-xs text-muted-foreground pt-3">
                    <span className="bg-secondary px-2 py-1 rounded-full text-secondary-foreground font-medium">{techHub.name}</span>
                    <span>{readTime} min read</span>
                    {/* Add bookmark button here if needed */}
                </div>
            </div>

            {coverImage && (
                <Link to={`/post/${slug}`} className="hidden sm:block h-32 w-48 bg-secondary/50 rounded-md shrink-0 overflow-hidden">
                    <img src={coverImage} alt={title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                </Link>
            )}
        </div>
    );
}
