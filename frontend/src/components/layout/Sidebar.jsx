import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Home, Bookmark, FileText, BarChart2, User, Users } from "lucide-react";
import clsx from "clsx";

export default function Sidebar({ isOpen, onClose }) {
  const { user } = useAuth();
  const location = useLocation();

  const menuItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Bookmark, label: "Library", path: "/bookmarks" },
    { icon: FileText, label: "Stories", path: "/write" },
    { icon: BarChart2, label: "Stats", path: "/trending" },
  ];

  if (user) {
    menuItems.splice(2, 0, {
      icon: User,
      label: "Profile",
      path: `/u/${user.username}`,
    });
  }

  return (
    <>
      {/* 1. The Backdrop (Dark overlay when open on mobile) */}
      <div
        className={clsx(
          "fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-500",
          isOpen ? "opacity-30" : "opacity-0 pointer-events-none",
        )}
        onClick={onClose}
      />

      {/* 2. The Sidebar Panel */}
      <aside
        className={clsx(
          "fixed top-16 left-0 bottom-0 w-64 bg-white border-r border-zinc-100 z-40 flex flex-col py-6 px-4",
          "transform transition-transform duration-500 ease-in-out", // Slow animation (500ms)
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className='space-y-1'>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.label}
                to={item.path}
                onClick={onClose} // Close sidebar on selection
                className={clsx(
                  "flex items-center gap-4 px-4 py-3 rounded-full text-sm font-medium transition-colors",
                  isActive
                    ? "bg-zinc-100 text-black"
                    : "text-zinc-500 hover:bg-zinc-50 hover:text-black",
                )}
              >
                <Icon
                  className={clsx(
                    "w-5 h-5",
                    isActive ? "stroke-[2]" : "stroke-[1.5]",
                  )}
                />
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Separator */}
        <div className='my-6 border-t border-zinc-100 mx-4'></div>

        {/* Following Section (Static for MVP) */}
        {user && (
          <div className='px-4'>
            <h3 className='text-sm font-bold text-zinc-900 mb-4'>Following</h3>
            <div className='space-y-4'>
              {/* Placeholder for 'Following' list API integration */}
              <div className='flex items-center gap-3 opacity-50 cursor-not-allowed'>
                <div className='w-6 h-6 rounded-full bg-zinc-200'></div>
                <span className='text-sm text-zinc-500'>Tech Daily</span>
              </div>
              <Link
                to='/write'
                className='flex items-center gap-2 mt-8 text-sm text-green-700 hover:text-green-800'
              >
                <Users className='w-4 h-4' />
                Find writers to follow
              </Link>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
