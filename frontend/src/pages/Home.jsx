import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Feed } from "../features/blog/components/Feed";
import { useAuth } from "../context/AuthContext";

export default function Home() {
    const { user, isAuthenticated } = useAuth();

    return (
        <div className="container py-8">
            {!isAuthenticated && (
                <section className="mb-12 border-b border-border/40 pb-12">
                    <h1 className="text-6xl font-serif font-bold mb-6 tracking-tight">Stay curious.</h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mb-8 leading-relaxed">
                        Discover stories, thinking, and expertise from writers on any topic.
                    </p>
                    <Button size="lg" className="rounded-full px-8 text-lg h-12">Start reading</Button>
                </section>
            )}

            <section className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-8">
                    <div className="flex items-center gap-4 border-b border-border/40 pb-4 mb-8">
                        <button className="text-sm font-medium border-b-2 border-foreground pb-4 -mb-4.5">For you</button>
                        <button className="text-sm text-muted-foreground hover:text-foreground pb-4">Mbappe</button>
                        <button className="text-sm text-muted-foreground hover:text-foreground pb-4">Technology</button>
                    </div>

                    <Feed />
                </div>

                <div className="hidden lg:block lg:col-span-4 pl-8 border-l border-border/40 min-h-screen">
                    <div className="sticky top-24 space-y-8">
                        <div>
                            <h3 className="font-bold mb-4 font-medium text-sm text-foreground">Discover more of what matters to you</h3>
                            <div className="flex flex-wrap gap-2">
                                {["Programming", "Data Science", "Technology", "Self Improvement", "Writing", "Relationships", "Politics"].map(topic => (
                                    <span key={topic} className="px-3 py-2 bg-secondary/50 rounded-full text-sm text-muted-foreground hover:bg-secondary hover:text-foreground cursor-pointer transition-colors">
                                        {topic}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div>
                            <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted-foreground">
                                <a href="#" className="hover:underline">Help</a>
                                <a href="#" className="hover:underline">Status</a>
                                <a href="#" className="hover:underline">Writers</a>
                                <a href="#" className="hover:underline">Blog</a>
                                <a href="#" className="hover:underline">Careers</a>
                                <a href="#" className="hover:underline">Privacy</a>
                                <a href="#" className="hover:underline">Terms</a>
                                <a href="#" className="hover:underline">About</a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
