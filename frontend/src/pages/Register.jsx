import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Mail, Lock, User, Terminal, Loader2 } from "lucide-react";
import { FaGoogle } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
  });

  const { register } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await register(formData);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    console.log(`Register with ${provider}`);
  };

  return (
    <div className='container relative flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0 min-h-screen text-zinc-950 font-sans'>
      <style>
        {`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
                body { font-family: 'Inter', sans-serif; }
                .font-mono { font-family: 'JetBrains Mono', monospace; }
                `}
      </style>

      {/* LEFT SIDE (Visual Area) */}
      <div className='relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r border-zinc-200'>
        <div className='absolute inset-0 bg-zinc-900' />

        {/* Tech Image Background - Different from Login for variety, but same style */}
        <div
          className='absolute inset-0 bg-cover bg-center grayscale opacity-40 mix-blend-overlay'
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop')",
          }}
        />

        {/* Noise/Grid Texture */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>

        <div className='relative z-20 flex items-center text-lg font-medium tracking-tight'>
          <div className='mr-2 h-6 w-6 rounded-l text-black flex items-center justify-center font-bold'>
            <img src='/logo1.png' alt='' className='rounded-full' />
          </div>
          Even
        </div>

        <div className='relative z-20 mt-auto'>
          <blockquote className='space-y-2 border-l-2 border-white pl-6'>
            <p className='text-lg italic font-light text-zinc-100'>
              &ldquo;The best way to predict the future is to implement it. Join
              a community of developers building tomorrow.&rdquo;
            </p>
            <footer className='text-sm font-semibold text-zinc-300 font-mono'>
              // The Even Team
            </footer>
          </blockquote>
        </div>
      </div>

      {/* RIGHT SIDE (Form Area) */}
      <div className='lg:p-8 bg-white'>
        <div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[380px]'>
          <div className='flex flex-col space-y-2 text-center'>
            <h1 className='text-3xl font-bold tracking-tighter text-black'>
              Create Account
            </h1>
            <p className='text-sm text-zinc-500'>
              Join the tech revolution today
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className='grid gap-5'>
              <div className='grid gap-4'>
                {/* Full Name Field */}
                <div className='relative group'>
                  <div className='absolute left-3 top-3 text-zinc-400 group-focus-within:text-black transition-colors'>
                    <User className='h-5 w-5' />
                  </div>
                  <Input
                    id='fullName'
                    name='fullName'
                    placeholder='Full Name'
                    type='text'
                    autoCapitalize='words'
                    autoCorrect='off'
                    disabled={isLoading}
                    onChange={handleChange}
                    className='pl-10 h-11 border-zinc-200 focus-visible:ring-black focus-visible:ring-offset-0 focus-visible:border-black transition-all bg-zinc-50'
                    required
                  />
                </div>

                {/* Username Field */}
                <div className='relative group'>
                  <div className='absolute left-3 top-3 text-zinc-400 group-focus-within:text-black transition-colors'>
                    <Terminal className='h-5 w-5' />
                  </div>
                  <Input
                    id='username'
                    name='username'
                    placeholder='Username'
                    type='text'
                    autoCapitalize='none'
                    autoCorrect='off'
                    disabled={isLoading}
                    onChange={handleChange}
                    className='pl-10 h-11 border-zinc-200 focus-visible:ring-black focus-visible:ring-offset-0 focus-visible:border-black transition-all bg-zinc-50 font-mono text-sm'
                    required
                  />
                </div>

                {/* Email Field */}
                <div className='relative group'>
                  <div className='absolute left-3 top-3 text-zinc-400 group-focus-within:text-black transition-colors'>
                    <Mail className='h-5 w-5' />
                  </div>
                  <Input
                    id='email'
                    name='email'
                    placeholder='name@example.com'
                    type='email'
                    autoCapitalize='none'
                    autoComplete='email'
                    autoCorrect='off'
                    disabled={isLoading}
                    onChange={handleChange}
                    className='pl-10 h-11 border-zinc-200 focus-visible:ring-black focus-visible:ring-offset-0 focus-visible:border-black transition-all bg-zinc-50'
                    required
                  />
                </div>

                {/* Password Field */}
                <div className='relative group'>
                  <div className='absolute left-3 top-3 text-zinc-400 group-focus-within:text-black transition-colors'>
                    <Lock className='h-5 w-5' />
                  </div>
                  <Input
                    id='password'
                    name='password'
                    placeholder='Password'
                    type='password'
                    autoComplete='new-password'
                    disabled={isLoading}
                    onChange={handleChange}
                    className='pl-10 h-11 border-zinc-200 focus-visible:ring-black focus-visible:ring-offset-0 focus-visible:border-black transition-all bg-zinc-50'
                    required
                  />
                </div>
              </div>

              {error && (
                <div className='p-3 text-sm text-white bg-zinc-900 rounded-md flex items-center gap-2'>
                  <span className='block w-1.5 h-1.5 rounded-full bg-red-500'></span>
                  {error}
                </div>
              )}

              <Button
                disabled={isLoading}
                className='h-11 bg-black text-white hover:bg-zinc-800 transition-colors font-medium tracking-wide'
              >
                {isLoading ? (
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                ) : (
                  "Sign Up"
                )}
              </Button>
            </div>
          </form>

          {/* Social Login Options */}
          <div className='relative'>
            <div className='absolute inset-0 flex items-center'>
              <span className='w-full border-t border-zinc-200' />
            </div>
            <div className='relative flex justify-center text-xs uppercase'>
              <span className='bg-white px-2 text-zinc-500'>
                Or register with
              </span>
            </div>
          </div>

          <div className='grid grid-cols-3 gap-3'>
            <Button
              variant='outline'
              onClick={() => handleSocialLogin("google")}
              disabled={isLoading}
              className='border-zinc-200 hover:bg-zinc-50 hover:border-black hover:text-black transition-all'
            >
              <FaGoogle />
            </Button>
            <Button
              variant='outline'
              onClick={() => handleSocialLogin("github")}
              disabled={isLoading}
              className='border-zinc-200 hover:bg-zinc-50 hover:border-black hover:text-black transition-all'
            >
              <FaGithub />
            </Button>
            <Button
              variant='outline'
              onClick={() => handleSocialLogin("linkedin")}
              disabled={isLoading}
              className='border-zinc-200 hover:bg-zinc-50 hover:border-black hover:text-black transition-all'
            >
              <FaLinkedin />
            </Button>
          </div>

          <p className='px-8 text-center text-sm text-zinc-500'>
            <Link
              to='/login'
              className='hover:text-black underline underline-offset-4 transition-colors font-medium'
            >
              Already have an account? Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
