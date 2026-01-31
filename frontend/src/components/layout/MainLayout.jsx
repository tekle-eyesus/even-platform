import React from "react";
import { Navbar } from "./Navbar";

export function MainLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col bg-background font-sans antialiased">
            <Navbar />
            <main className="flex-1">
                {children}
            </main>
            <footer className="border-t py-6 md:py-0">
                <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
                    <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                        Built by Even Platform. The source code is available on GitHub.
                    </p>
                </div>
            </footer>
        </div>
    );
}
