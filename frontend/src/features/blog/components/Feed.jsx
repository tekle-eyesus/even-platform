import React, { useEffect, useState } from "react";
import { postService } from "../services/post.service";
import { PostCard } from "./PostCard";
import { Loader2 } from "lucide-react";

export function Feed() {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await postService.getAllPosts();
                // Structure: response.data.posts
                if (response.data && response.data.posts) {
                    setPosts(response.data.posts);
                } else {
                    setPosts([]);
                }
            } catch (err) {
                console.error("Failed to fetch posts", err);
                setError("Failed to load stories.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchPosts();
    }, []);

    if (isLoading) {
        return (
            <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (error) {
        return <div className="text-center py-12 text-red-500">{error}</div>;
    }

    if (posts.length === 0) {
        return (
            <div className="text-center py-12 text-muted-foreground">
                No stories found. Be the first to write one!
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {posts.map((post) => (
                <PostCard key={post._id} post={post} />
            ))}
        </div>
    );
}
