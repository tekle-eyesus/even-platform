import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Mail, Lock, Loader2 } from "lucide-react";
import { FaGoogle } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";

export default function Login() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const { login } = useAuth();
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
      await login(formData);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    // Placeholder for social login logic
    console.log(`Login with ${provider}`);
  };

  return (
    <div className='container relative flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0 min-h-screen text-zinc-950'>
      <div className='relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r border-zinc-200'>
        <div className='absolute inset-0 bg-zinc-900' />
        {/* Tech Image Background */}
        <div
          className='absolute inset-0 bg-cover bg-center grayscale opacity-90 mix-blend-overlay'
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop')",
          }}
        />
        {/* Grid Pattern Overlay for extra "Tech" feel */}
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
              &ldquo;Innovation distinguishes between a leader and a follower.
              This platform provides the clarity needed to lead.&rdquo;
            </p>
            <footer className='text-sm font-semibold text-zinc-300'>
              The Even Team
            </footer>
          </blockquote>
        </div>
      </div>

      {/* RIGHT SIDE (Form Area) */}
      <div className='lg:p-8 bg-white'>
        <div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[380px]'>
          <div className='flex flex-col space-y-2 text-center'>
            <h1 className='text-3xl font-bold tracking-tighter text-black'>
              Welcome Back
            </h1>
            <p className='text-sm text-zinc-500'>
              Enter your credentials to access your dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className='grid gap-5'>
              <div className='grid gap-4'>
                {/* Enhanced Email/Username Field */}
                <div className='relative group'>
                  <div className='absolute left-3 top-3 text-zinc-400 group-focus-within:text-black transition-colors'>
                    <Mail className='h-5 w-5' />
                  </div>
                  <Input
                    id='email'
                    name='username' // Changed to username based on state, but keeps flexible logic
                    placeholder='Username or Email'
                    type='text'
                    autoCapitalize='none'
                    autoComplete='username'
                    autoCorrect='off'
                    disabled={isLoading}
                    onChange={handleChange}
                    className='pl-10 h-11 border-zinc-200 focus-visible:ring-black focus-visible:ring-offset-0 focus-visible:border-black transition-all bg-zinc-50'
                    required
                  />
                </div>

                {/* Enhanced Password Field */}
                <div className='relative group'>
                  <div className='absolute left-3 top-3 text-zinc-400 group-focus-within:text-black transition-colors'>
                    <Lock className='h-5 w-5' />
                  </div>
                  <Input
                    id='password'
                    name='password'
                    placeholder='Password'
                    type='password'
                    autoComplete='current-password'
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
                className='h-11 bg-black text-white hover:bg-zinc-800 transition-colors'
              >
                {isLoading ? (
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                ) : (
                  "Sign In"
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
                Or continue with
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
              <span className='sr-only'>Google</span>
            </Button>
            <Button
              variant='outline'
              onClick={() => handleSocialLogin("github")}
              disabled={isLoading}
              className='border-zinc-200 hover:bg-zinc-50 hover:border-black hover:text-black transition-all'
            >
              <FaGithub />
              <span className='sr-only'>GitHub</span>
            </Button>
            <Button
              variant='outline'
              onClick={() => handleSocialLogin("linkedin")}
              disabled={isLoading}
              className='border-zinc-200 hover:bg-zinc-50 hover:border-black hover:text-black transition-all'
            >
              <FaLinkedin />
              <span className='sr-only'>LinkedIn</span>
            </Button>
          </div>

          <p className='px-8 text-center text-sm text-zinc-500'>
            <Link
              to='/register'
              className='hover:text-black underline underline-offset-4 transition-colors font-medium'
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
