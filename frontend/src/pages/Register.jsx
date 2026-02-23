import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Mail, Lock, User, Terminal, Loader2, ArrowRight } from "lucide-react";
import { FaGoogle, FaGithub, FaLinkedin } from "react-icons/fa";
import { useTitle } from "../hooks/useTitle";

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
  });
  const [focusedField, setFocusedField] = useState(null);

  const { register } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  useTitle("Register");

  const handleChange = (e) => {
    e.preventDefault();
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

  const fields = [
    {
      id: "fullName",
      name: "fullName",
      label: "Full Name",
      placeholder: "Jane Smith",
      type: "text",
      autoCapitalize: "words",
      autoComplete: "name",
      icon: User,
    },
    {
      id: "username",
      name: "username",
      label: "Username",
      placeholder: "jane_smith",
      type: "text",
      autoCapitalize: "none",
      autoComplete: "username",
      icon: Terminal,
      mono: true,
    },
    {
      id: "email",
      name: "email",
      label: "Email Address",
      placeholder: "you@example.com",
      type: "email",
      autoCapitalize: "none",
      autoComplete: "email",
      icon: Mail,
    },
    {
      id: "password",
      name: "password",
      label: "Password",
      placeholder: "••••••••",
      type: "password",
      autoComplete: "new-password",
      icon: Lock,
    },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=JetBrains+Mono:wght@400;500&display=swap');
      `}</style>

      <div
        className='min-h-screen grid lg:grid-cols-2 bg-stone-950'
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        {/* ── LEFT PANEL ── */}
        <div className='relative hidden lg:flex flex-col p-12 overflow-hidden'>
          {/* BG photo */}
          <div
            className='absolute inset-0 bg-cover bg-center'
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop')",
              filter: "grayscale(100%) blur(2px)",
              opacity: 0.1,
            }}
          />
          {/* Gradient overlay */}
          <div
            className='absolute inset-0'
            style={{
              background:
                "linear-gradient(135deg, #0a0a0a 0%, transparent 65%)",
            }}
          />
          {/* Vertical accent line */}
          <div
            className='absolute top-0 right-0 w-px h-full'
            style={{
              background:
                "linear-gradient(to bottom, transparent, rgba(255,255,255,0.12) 30%, rgba(255,255,255,0.12) 70%, transparent)",
            }}
          />
          {/* Decorative circles */}
          <div
            className='absolute rounded-full pointer-events-none'
            style={{
              bottom: -160,
              right: -160,
              width: 520,
              height: 520,
              border: "1px solid rgba(255,255,255,0.04)",
            }}
          />
          <div
            className='absolute rounded-full pointer-events-none'
            style={{
              bottom: -80,
              right: -80,
              width: 340,
              height: 340,
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          />

          {/* Content */}
          <div className='relative z-10 flex flex-col h-full'>
            {/* Brand */}
            <div className='flex items-center gap-2.5'>
              <div
                className='w-8 h-8 rounded-lg overflow-hidden flex-shrink-0'
                style={{ border: "1px solid rgba(255,255,255,0.12)" }}
              >
                <img
                  src='/logo3.png'
                  alt='Even'
                  className='w-full h-full object-cover'
                />
              </div>
              <span
                className='text-white text-xl'
                style={{ fontFamily: "'DM Serif Display', serif" }}
              >
                Even
              </span>
            </div>

            {/* Hero copy */}
            <div className='my-auto'>
              <p
                className='text-xs font-semibold uppercase mb-5 tracking-widest'
                style={{ color: "rgba(255,255,255,0.28)" }}
              >
                Start your journey
              </p>

              <h2
                className='text-white mb-9'
                style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: "clamp(40px, 4.5vw, 58px)",
                  lineHeight: 1.08,
                }}
              >
                Build the
                <br />
                future{" "}
                <em
                  style={{
                    fontStyle: "italic",
                    color: "rgba(255,255,255,0.38)",
                  }}
                >
                  with
                </em>
                <br />
                us.
              </h2>

              <div
                className='pl-5'
                style={{ borderLeft: "1.5px solid rgba(255,255,255,0.18)" }}
              >
                <p
                  className='text-sm leading-relaxed mb-2.5 font-light'
                  style={{ color: "rgba(255,255,255,0.42)" }}
                >
                  The best way to predict the future is to implement it. Join a
                  community of builders shaping tomorrow.
                </p>
                <footer
                  className='text-xs font-semibold uppercase'
                  style={{
                    color: "rgba(255,255,255,0.2)",
                    letterSpacing: "0.12em",
                  }}
                >
                  The Even Team
                </footer>
              </div>

              {/* Stat pills */}
              <div className='flex gap-2.5 mt-12'>
                {[
                  { num: "12k+", label: "Builders" },
                  { num: "50+", label: "Integrations" },
                  { num: "Free", label: "To start" },
                ].map((s) => (
                  <div
                    key={s.label}
                    className='px-4 py-2.5 rounded-full'
                    style={{
                      border: "1px solid rgba(255,255,255,0.07)",
                      background: "rgba(255,255,255,0.03)",
                    }}
                  >
                    <div
                      className='text-white leading-none'
                      style={{
                        fontFamily: "'DM Serif Display', serif",
                        fontSize: 18,
                      }}
                    >
                      {s.num}
                    </div>
                    <div
                      className='text-xs mt-0.5'
                      style={{
                        color: "rgba(255,255,255,0.25)",
                        letterSpacing: "0.06em",
                      }}
                    >
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div
          className='relative flex items-center justify-center px-8 py-14'
          style={{ background: "#f7f6f3" }}
        >
          {/* Dot texture */}
          <div
            className='absolute inset-0 pointer-events-none'
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000' fill-opacity='0.018'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />

          <div className='relative w-full max-w-sm'>
            {/* Header */}
            <div className='mb-8'>
              <p
                className='text-xs font-semibold uppercase mb-2.5'
                style={{ color: "rgba(0,0,0,0.28)", letterSpacing: "0.18em" }}
              >
                New Account
              </p>
              <h1
                className='text-4xl text-stone-950 mb-2 leading-tight'
                style={{ fontFamily: "'DM Serif Display', serif" }}
              >
                Join Even.
              </h1>
              <p
                className='text-sm font-light'
                style={{ color: "rgba(0,0,0,0.42)", lineHeight: 1.6 }}
              >
                Sign up and start building in minutes
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div className='flex flex-col gap-3 mb-5'>
                {fields.map((f) => {
                  const Icon = f.icon;
                  const isFocused = focusedField === f.id;

                  return (
                    <div key={f.id}>
                      {/* Label */}
                      <label
                        htmlFor={f.id}
                        className='block text-xs font-semibold uppercase mb-1.5 transition-colors duration-200'
                        style={{
                          letterSpacing: "0.1em",
                          color: isFocused ? "#0a0a0a" : "rgba(0,0,0,0.35)",
                        }}
                      >
                        {f.label}
                      </label>

                      {/* Input wrapper */}
                      <div className='relative'>
                        <span
                          className='absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none flex transition-colors duration-200'
                          style={{
                            color: isFocused ? "#0a0a0a" : "rgba(0,0,0,0.22)",
                          }}
                        >
                          <Icon size={16} />
                        </span>
                        <input
                          id={f.id}
                          name={f.name}
                          type={f.type}
                          placeholder={f.placeholder}
                          autoCapitalize={f.autoCapitalize}
                          autoComplete={f.autoComplete}
                          autoCorrect='off'
                          disabled={isLoading}
                          onChange={handleChange}
                          onFocus={() => setFocusedField(f.id)}
                          onBlur={() => setFocusedField(null)}
                          required
                          className='w-full h-12 pl-10 pr-4 text-sm rounded-lg outline-none transition-all duration-200 placeholder:text-stone-400 disabled:opacity-50 disabled:cursor-not-allowed'
                          style={{
                            fontFamily: f.mono
                              ? "'JetBrains Mono', monospace"
                              : "'DM Sans', sans-serif",
                            background: "#fff",
                            color: "#0a0a0a",
                            border: isFocused
                              ? "1.5px solid #0a0a0a"
                              : "1.5px solid rgba(0,0,0,0.09)",
                            boxShadow: isFocused
                              ? "0 0 0 3px rgba(0,0,0,0.05)"
                              : "none",
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Error */}
              {error && (
                <div
                  className='flex items-center gap-2 px-3.5 py-3 rounded-lg mb-3.5 text-sm text-white'
                  style={{ background: "#0a0a0a" }}
                >
                  <span
                    className='w-1.5 h-1.5 rounded-full flex-shrink-0'
                    style={{ background: "#ff4444" }}
                  />
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type='submit'
                disabled={isLoading}
                className='w-full h-12 rounded-lg text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 mb-7 hover:-translate-y-px hover:shadow-lg active:translate-y-0 disabled:opacity-55 disabled:cursor-not-allowed'
                style={{
                  background: "#0a0a0a",
                  letterSpacing: "0.04em",
                }}
                onMouseEnter={(e) => {
                  if (!isLoading) e.currentTarget.style.background = "#1c1c1c";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#0a0a0a";
                }}
              >
                {isLoading ? (
                  <Loader2 size={18} className='animate-spin' />
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight size={15} />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className='flex items-center gap-3.5 mb-4'>
              <div className='flex-1 h-px bg-black/[0.08]' />
              <span
                className='text-xs font-semibold uppercase whitespace-nowrap'
                style={{ color: "rgba(0,0,0,0.26)", letterSpacing: "0.1em" }}
              >
                Or register with
              </span>
              <div className='flex-1 h-px bg-black/[0.08]' />
            </div>

            {/* Social buttons */}
            <div className='grid grid-cols-3 gap-2.5 mb-7'>
              {[
                { provider: "google", Icon: FaGoogle },
                { provider: "github", Icon: FaGithub },
                { provider: "linkedin", Icon: FaLinkedin },
              ].map(({ provider, Icon }) => (
                <button
                  key={provider}
                  onClick={() => handleSocialLogin(provider)}
                  disabled={isLoading}
                  className='h-11 rounded-lg flex items-center justify-center text-base transition-all duration-200 hover:-translate-y-px hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed'
                  style={{
                    background: "#fff",
                    border: "1.5px solid rgba(0,0,0,0.08)",
                    color: "rgba(0,0,0,0.45)",
                  }}
                  onMouseEnter={(e) => {
                    if (!isLoading) {
                      e.currentTarget.style.borderColor = "#0a0a0a";
                      e.currentTarget.style.color = "#0a0a0a";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "rgba(0,0,0,0.08)";
                    e.currentTarget.style.color = "rgba(0,0,0,0.45)";
                  }}
                >
                  <Icon />
                  <span className='sr-only'>{provider}</span>
                </button>
              ))}
            </div>

            {/* Sign in link */}
            <p
              className='text-center text-sm'
              style={{ color: "rgba(0,0,0,0.38)" }}
            >
              Already have an account?{" "}
              <Link
                to='/login'
                className='font-semibold text-stone-950 transition-colors duration-200 hover:opacity-70'
                style={{
                  borderBottom: "1px solid rgba(0,0,0,0.18)",
                  paddingBottom: 1,
                  textDecoration: "none",
                }}
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
