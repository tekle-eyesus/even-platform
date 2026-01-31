import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../ui/Button";
import { Search, PenSquare, Bell, User } from "lucide-react";

export function Navbar() {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4 md:px-8">
                <div className="flex items-center gap-6">
                    <Link to="/" className="flex items-center space-x-2">
                        <span className="text-2xl font-serif font-bold tracking-tight">Even</span>
                    </Link>

                    <div className="hidden md:flex items-center relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <input
                            type="search"
                            placeholder="Search"
                            className="h-9 w-60 rounded-full bg-secondary/50 pl-9 pr-4 text-sm outline-none focus:bg-background border border-transparent focus:border-input transition-all"
                        />
                    </div>
                </div>

                <nav className="flex items-center gap-4">
                    {isAuthenticated ? (
                        <>
                            <Link to="/new-story" className="hidden sm:flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                                <PenSquare className="h-5 w-5" />
                                <span className="text-sm">Write</span>
                            </Link>

                            <Button variant="ghost" size="icon" className="text-muted-foreground">
                                <Bell className="h-5 w-5" />
                            </Button>

                            <div className="flex items-center gap-2 pl-2">
                                <Button variant="ghost" className="relative h-8 w-8 rounded-full overflow-hidden" onClick={() => navigate(`/p/${user.username}`)}>
                                    {user.avatar ? (
                                        <img src={user.avatar} alt={user.username} className="h-full w-full object-cover" />
                                    ) : (
                                        <User className="h-5 w-5" />
                                    )}
                                </Button>
                                <Button variant="outline" size="sm" onClick={logout}>
                                    Logout
                                </Button>
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to="/new-story" className="hidden sm:flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                                <PenSquare className="h-5 w-5" />
                                <span className="text-sm">Write</span>
                            </Link>
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm" onClick={() => navigate("/login")}>
                                    Sign In
                                </Button>
                                <Button size="sm" className="rounded-full px-5" onClick={() => navigate("/register")}>
                                    Get Started
                                </Button>
                            </div>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}
