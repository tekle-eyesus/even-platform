import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../ui/Button";
import { Search, PenSquare, Menu, X, User } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

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
            <div className='flex items-center gap-3 pl-4 border-l border-zinc-200'>
              <Link to='/write'>
                <Button
                  variant='ghost'
                  className='text-zinc-600 hover:text-black font-sans'
                >
                  <PenSquare className='w-4 h-4 mr-2 font-sans' />
                  Write
                </Button>
              </Link>
              <div
                className='w-8 h-8 rounded-full bg-zinc-200 overflow-hidden cursor-pointer'
                onClick={logout}
              >
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.username}
                    className='w-full h-full object-cover'
                  />
                ) : (
                  <User className='w-5 h-5 m-1.5 text-zinc-500' />
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
