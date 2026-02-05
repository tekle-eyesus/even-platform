import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../ui/Button";
import {
  Search,
  PenSquare,
  Menu,
  X,
  User,
  Settings,
  HelpCircle,
  Sparkles,
} from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false); // Profile Dropdown
  const profileRef = useRef(null); // Reference for click-outside logic
  const navigate = useNavigate();

  // Handle Click Outside to close profile menu
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileRef]);

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    navigate("/");
  };
  return (
    <header className='sticky top-0 z-50 w-full border-b border-zinc-100 bg-white/80 backdrop-blur-md'>
      <div className='container mx-auto px-4 h-16 flex items-center justify-between'>
        {/* 1. Logo */}
        <Link
          to='/'
          className='flex items-center gap-2 font-bold text-xl tracking-tight text-zinc-900'
        >
          <div className='w-8 h-8 bg-black rounded-full flex items-center justify-center text-white font-serif italic'>
            <img src='./logo2.png' alt='' className='rounded-full' />
          </div>
          <span className='font-display'>EVEN</span>
        </Link>

        {/* 2. Desktop Navigation */}
        <nav className='hidden md:flex items-center gap-8 text-sm font-medium text-zinc-600 font-display'>
          <Link to='/' className='hover:text-black transition-colors'>
            Home
          </Link>
          <Link to='/hubs' className='hover:text-black transition-colors'>
            Tech Hubs
          </Link>
          <Link to='/about' className='hover:text-black transition-colors'>
            About
          </Link>
        </nav>

        {/* 3. Actions (Search + Auth) */}
        <div className='hidden md:flex items-center gap-4'>
          <div className='relative group'>
            <Search className='w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-zinc-600' />
            <input
              type='text'
              placeholder='Search'
              className='h-8 pl-9 pr-4 rounded-full bg-zinc-100 text-sm border-none focus:outline-none focus:ring-0 w-64 transition-all'
            />
          </div>

          {user ? (
            <div className='flex items-center gap-3 pl-4 border-l border-zinc-200 font-sans'>
              <Link to='/write'>
                <Button
                  variant='ghost'
                  className='text-zinc-600 hover:text-black font-sans cursor-pointer'
                >
                  <PenSquare className='w-4 h-4 mr-2 font-sans' />
                  Write
                </Button>
              </Link>
              <div className='relative' ref={profileRef}>
                {/* Avatar Trigger */}
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className='w-8 h-8 rounded-full bg-zinc-200 overflow-hidden ring-offset-2 hover:ring-2 ring-zinc-100 transition-all cursor-pointer'
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.username}
                      className='w-full h-full object-cover'
                    />
                  ) : (
                    <div className='w-full h-full flex items-center justify-center bg-green-700 text-white font-medium'>
                      {user.fullName?.charAt(0) || "U"}
                    </div>
                  )}
                </button>

                {isProfileOpen && (
                  <div className='absolute right-0 top-12 w-60 bg-white rounded-md shadow-lg border border-zinc-100 py-2 animate-in fade-in slide-in-from-top-2 overflow-hidden'>
                    <div className='px-6 py-4 border-b border-zinc-100'>
                      <div className='flex items-center gap-3 mb-2'>
                        <div className='w-9 h-9 rounded-full flex items-center justify-center text-lg font-medium'>
                          <img
                            src={user.avatar}
                            alt={user.username}
                            className='w-full h-full object-cover rounded-full cursor-pointer'
                          />
                        </div>
                        <div className='flex flex-col'>
                          <span className='font-semibold text-zinc-900 leading-tight'>
                            {user.fullName}
                          </span>
                          <Link
                            to={`/u/${user.username}`}
                            onClick={() => setIsProfileOpen(false)}
                            className='text-sm text-zinc-500 hover:text-black'
                          >
                            View profile
                          </Link>
                        </div>
                      </div>
                    </div>

                    <div className='py-2 border-b border-zinc-100'>
                      <button className='w-full text-left cursor-pointer px-6 py-2 text-sm text-zinc-600 hover:text-black hover:bg-zinc-50 flex items-center gap-3'>
                        <Settings className='w-4 h-4' /> Settings
                      </button>
                      <button className='w-full text-left cursor-pointer px-6 py-2 text-sm text-zinc-600 hover:text-black hover:bg-zinc-50 flex items-center gap-3'>
                        <HelpCircle className='w-4 h-4' /> Help
                      </button>
                    </div>

                    <div className='py-2 border-b border-zinc-100'>
                      <div className='px-6 py-2 hover:bg-zinc-50 cursor-pointer'>
                        <div className='flex items-center justify-between text-sm text-zinc-600'>
                          <span>Become a member</span>
                          <Sparkles className='w-3 h-3 text-yellow-500 fill-yellow-500' />
                        </div>
                        <p className='text-xs text-zinc-400 mt-1'>
                          Unlock premium insights
                        </p>
                      </div>
                    </div>

                    <div className='pt-2 pb-4'>
                      <button
                        onClick={handleLogout}
                        className='w-full cursor-pointer text-left px-6 py-2 text-sm text-zinc-600 hover:text-black hover:bg-zinc-50'
                      >
                        Sign out
                        <div className='text-xs text-zinc-400 mt-0.5 truncate'>
                          {user.email}
                        </div>
                      </button>
                    </div>

                    <div className='px-6 py-2 text-[11px] text-zinc-400 flex flex-wrap gap-x-3 gap-y-1'>
                      <span>Privacy</span>
                      <span>Terms</span>
                      <span>About</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className='flex items-center gap-3'>
              <Link to='/login'>
                <Button
                  variant='ghost'
                  className='text-zinc-600 hover:text-black'
                >
                  Log in
                </Button>
              </Link>
              <Link to='/register'>
                <Button className='bg-black text-white hover:bg-zinc-800 rounded-full px-6'>
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className='md:hidden'
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu (Simplified) */}
      {isMenuOpen && (
        <div className='md:hidden border-t p-4 bg-white space-y-4'>
          <Link to='/' className='block py-2'>
            Home
          </Link>
          <Link to='/hubs' className='block py-2'>
            Hubs
          </Link>
          {!user && (
            <div className='flex gap-2 mt-4'>
              <Link to='/login' className='flex-1'>
                <Button variant='outline' className='w-full'>
                  Login
                </Button>
              </Link>
              <Link to='/register' className='flex-1'>
                <Button className='w-full bg-black text-white'>Sign Up</Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
