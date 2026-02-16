import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { interactionService } from "../../features/blog/services/interaction.service";
import {
  Home,
  Bookmark,
  FileText,
  BarChart2,
  User,
  Users,
  Hash,
  Loader2,
} from "lucide-react";
import clsx from "clsx";

export default function Sidebar({ isOpen, onClose }) {
  const { user } = useAuth();
  const location = useLocation();

  const [followedHubs, setFollowedHubs] = useState([]);
  const [loadingHubs, setLoadingHubs] = useState(false);

  // --- FETCH FOLLOWED HUBS ---
  useEffect(() => {
    if (user && isOpen) {
      const fetchMyHubs = async () => {
        try {
          setLoadingHubs(true);
          const data = await interactionService.getMySubscribedHubs();
          setFollowedHubs(data.data || []);
        } catch (error) {
          console.error("Failed to fetch sidebar hubs");
        } finally {
          setLoadingHubs(false);
        }
      };
      fetchMyHubs();
    }
  }, [user, isOpen]);

  const menuItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Bookmark, label: "Library", path: "/bookmarks" },
    { icon: FileText, label: "Stories", path: "/write" },
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
      {/* 1. Backdrop */}
      <div
        className={clsx(
          "fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-500",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
        onClick={onClose}
      />

      <aside
        className={clsx(
          "fixed top-16 left-0 bottom-0 w-64 bg-white border-r border-zinc-100 z-40 flex flex-col py-6 overflow-y-auto", // Added overflow-y-auto for scrolling
          "transform transition-transform duration-500 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className='space-y-1 px-4'>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.label}
                to={item.path}
                onClick={onClose}
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
        <div className='my-6 border-t border-zinc-100 mx-6'></div>

        {/* Following Section */}
        {user && (
          <div className='px-8'>
            <h3 className='text-xs font-bold text-zinc-400 uppercase tracking-wider mb-4'>
              Following
            </h3>

            <div className='space-y-4'>
              {loadingHubs && (
                <div className='flex items-center gap-3 animate-pulse'>
                  <div className='w-6 h-6 rounded-md bg-zinc-200'></div>
                  <div className='h-3 w-20 bg-zinc-200 rounded'></div>
                </div>
              )}

              {!loadingHubs &&
                followedHubs.length > 0 &&
                followedHubs.map((hub) => (
                  <Link
                    key={hub._id}
                    to={`/hubs/${hub.slug}`}
                    onClick={onClose}
                    className='flex items-center gap-3 group'
                  >
                    <div className='w-6 h-6 rounded-md bg-zinc-100 flex items-center justify-center text-zinc-400 group-hover:bg-zinc-200 group-hover:text-black transition-colors'>
                      <Hash className='w-3.5 h-3.5' />
                    </div>
                    <span className='text-sm text-zinc-500 group-hover:text-black transition-colors font-medium truncate'>
                      {hub.name}
                    </span>
                  </Link>
                ))}
              {/* empty state */}
              {!loadingHubs && followedHubs.length === 0 && (
                <p className='text-xs text-zinc-400 italic'>
                  No hubs followed yet.
                </p>
              )}

              {/* Find Writers Link */}
              <Link
                to='/hubs'
                onClick={onClose}
                className='flex items-center gap-2 mt-6 text-sm text-green-700 hover:text-green-800 font-medium pt-2'
              >
                <Users className='w-4 h-4' />
                Browse all hubs
              </Link>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
