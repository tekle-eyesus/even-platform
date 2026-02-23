import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Mail, Lock, Loader2, ArrowRight } from "lucide-react";
import { FaGoogle } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { useTitle } from "../hooks/useTitle";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [focusedField, setFocusedField] = useState(null);
  useTitle("Login");

  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    e.preventDefault();
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
    console.log(`Login with ${provider}`);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .login-root {
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
          background: #0a0a0a;
        }

        @media (max-width: 1024px) {
          .login-root { grid-template-columns: 1fr; }
          .login-left { display: none; }
        }

        /* ─── LEFT PANEL ─── */
        .login-left {
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          padding: 48px;
        }

        .login-left-bg {
          position: absolute;
          inset: 0;
          background-image: url('https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop');
          background-size: cover;
          background-position: center;
          filter: grayscale(1);
          opacity: 0.12;
        }

        .login-left-gradient {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #0a0a0a 0%, transparent 65%);
        }

        .accent-line {
          position: absolute;
          top: 0;
          right: 0;
          width: 1px;
          height: 100%;
          background: linear-gradient(to bottom, transparent, rgba(255,255,255,0.12) 30%, rgba(255,255,255,0.12) 70%, transparent);
        }

        .deco-circle {
          position: absolute;
          bottom: -160px;
          left: -160px;
          width: 520px;
          height: 520px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.04);
          pointer-events: none;
        }

        .deco-circle-inner {
          position: absolute;
          bottom: -80px;
          left: -80px;
          width: 340px;
          height: 340px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.06);
          pointer-events: none;
        }

        .left-content {
          position: relative;
          z-index: 10;
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .brand-logo {
          width: 30px;
          height: 30px;
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.12);
        }

        .brand-logo img { width: 100%; height: 100%; object-fit: cover; }

        .brand-name {
          font-family: 'DM Serif Display', serif;
          font-size: 20px;
          color: #fff;
        }

        .left-main {
          margin-top: auto;
          margin-bottom: auto;
          animation: fadeUp 0.7s ease 0.15s both;
        }

        .left-eyebrow {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.28);
          margin-bottom: 20px;
        }

        .left-headline {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(40px, 4.5vw, 60px);
          line-height: 1.08;
          color: #fff;
          margin-bottom: 36px;
        }

        .left-headline em {
          font-style: italic;
          color: rgba(255,255,255,0.4);
        }

        .left-quote {
          padding-left: 18px;
          border-left: 1.5px solid rgba(255,255,255,0.18);
        }

        .left-quote p {
          font-size: 14px;
          line-height: 1.75;
          color: rgba(255,255,255,0.42);
          margin: 0 0 10px;
          font-weight: 300;
        }

        .left-quote footer {
          font-size: 11px;
          font-weight: 600;
          color: rgba(255,255,255,0.2);
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .stat-row {
          display: flex;
          gap: 10px;
          margin-top: 48px;
        }

        .stat-pill {
          padding: 10px 18px;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 100px;
          background: rgba(255,255,255,0.03);
        }

        .stat-pill-num {
          font-family: 'DM Serif Display', serif;
          font-size: 18px;
          color: #fff;
          line-height: 1;
        }

        .stat-pill-label {
          font-size: 10px;
          color: rgba(255,255,255,0.25);
          margin-top: 3px;
          letter-spacing: 0.06em;
        }

        /* ─── RIGHT PANEL ─── */
        .login-right {
          background: #f7f6f3;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 48px 32px;
          position: relative;
        }

        .login-right::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000' fill-opacity='0.018'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
          pointer-events: none;
        }

        .form-card {
          position: relative;
          width: 100%;
          max-width: 390px;
          animation: fadeUp 0.5s ease both;
        }

        .form-header {
          margin-bottom: 36px;
        }

        .form-eyebrow {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(0,0,0,0.28);
          margin-bottom: 10px;
        }

        .form-title {
          font-family: 'DM Serif Display', serif;
          font-size: 38px;
          line-height: 1.08;
          color: #0a0a0a;
          margin-bottom: 8px;
        }

        .form-subtitle {
          font-size: 14px;
          color: rgba(0,0,0,0.42);
          font-weight: 300;
          line-height: 1.5;
        }

        /* ─── FIELDS ─── */
        .field-wrapper {
          margin-bottom: 14px;
        }

        .field-label {
          display: block;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(0,0,0,0.35);
          margin-bottom: 7px;
          transition: color 0.2s;
        }

        .field-label.focused { color: #0a0a0a; }

        .field-inner { position: relative; }

        .field-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(0,0,0,0.22);
          transition: color 0.2s;
          pointer-events: none;
          display: flex;
        }

        .field-icon.focused { color: #0a0a0a; }

        .field-input {
          width: 100%;
          height: 48px;
          padding: 0 14px 0 42px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          color: #0a0a0a;
          background: #fff;
          border: 1.5px solid rgba(0,0,0,0.09);
          border-radius: 10px;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          -webkit-appearance: none;
        }

        .field-input::placeholder { color: rgba(0,0,0,0.22); }

        .field-input:focus {
          border-color: #0a0a0a;
          box-shadow: 0 0 0 3px rgba(0,0,0,0.05);
        }

        .field-input:disabled { opacity: 0.5; cursor: not-allowed; }

        /* ─── FORGOT ─── */
        .forgot-row {
          display: flex;
          justify-content: flex-end;
          margin-top: -4px;
          margin-bottom: 22px;
        }

        .forgot-link {
          font-size: 12px;
          color: rgba(0,0,0,0.38);
          text-decoration: none;
          transition: color 0.2s;
        }

        .forgot-link:hover { color: #0a0a0a; }

        /* ─── ERROR ─── */
        .error-box {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 14px;
          background: #0a0a0a;
          border-radius: 10px;
          margin-bottom: 14px;
          font-size: 13px;
          color: #fff;
        }

        .error-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #ff4444;
          flex-shrink: 0;
        }

        /* ─── SUBMIT ─── */
        .submit-btn {
          width: 100%;
          height: 50px;
          background: #0a0a0a;
          color: #fff;
          border: none;
          border-radius: 10px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0.04em;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-bottom: 28px;
        }

        .submit-btn:hover:not(:disabled) {
          background: #1c1c1c;
          box-shadow: 0 8px 24px rgba(0,0,0,0.16);
          transform: translateY(-1px);
        }

        .submit-btn:active:not(:disabled) { transform: translateY(0); }
        .submit-btn:disabled { opacity: 0.55; cursor: not-allowed; }

        /* ─── DIVIDER ─── */
        .divider {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 18px;
        }

        .divider-line {
          flex: 1;
          height: 1px;
          background: rgba(0,0,0,0.08);
        }

        .divider-text {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(0,0,0,0.26);
        }

        /* ─── SOCIAL ─── */
        .social-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          margin-bottom: 30px;
        }

        .social-btn {
          height: 46px;
          background: #fff;
          border: 1.5px solid rgba(0,0,0,0.08);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: rgba(0,0,0,0.45);
          font-size: 16px;
          transition: border-color 0.2s, color 0.2s, box-shadow 0.2s, transform 0.15s;
        }

        .social-btn:hover:not(:disabled) {
          border-color: #0a0a0a;
          color: #0a0a0a;
          box-shadow: 0 4px 12px rgba(0,0,0,0.07);
          transform: translateY(-1px);
        }

        .social-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        /* ─── REGISTER ─── */
        .register-row {
          text-align: center;
          font-size: 13px;
          color: rgba(0,0,0,0.38);
        }

        .register-link {
          color: #0a0a0a;
          font-weight: 600;
          text-decoration: none;
          border-bottom: 1px solid rgba(0,0,0,0.18);
          padding-bottom: 1px;
          transition: border-color 0.2s;
        }

        .register-link:hover { border-color: #0a0a0a; }

        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0,0,0,0);
          white-space: nowrap;
          border: 0;
        }

        @keyframes spin { to { transform: rotate(360deg); } }
        .spin { animation: spin 0.8s linear infinite; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className='login-root'>
        {/* ── LEFT ── */}
        <div className='login-left'>
          <div className='login-left-bg' />
          <div className='login-left-gradient' />
          <div className='accent-line' />
          <div className='deco-circle' />
          <div className='deco-circle-inner' />

          <div className='left-content'>
            <div className='brand'>
              <div className='brand-logo'>
                <img src='/logo3.png' alt='Even' />
              </div>
              <span className='brand-name'>Even</span>
            </div>

            <div className='left-main'>
              <p className='left-eyebrow'>Your Intelligence Layer</p>
              <h2 className='left-headline'>
                Lead with
                <br />
                <em>clarity,</em>
                <br />
                not chaos.
              </h2>
              <div className='left-quote'>
                <p>
                  Innovation distinguishes between a leader and a follower. This
                  platform provides the clarity needed to lead.
                </p>
                <footer>The Even Team</footer>
              </div>
              <div className='stat-row'>
                <div className='stat-pill'>
                  <div className='stat-pill-num'>12k+</div>
                  <div className='stat-pill-label'>Users</div>
                </div>
                <div className='stat-pill'>
                  <div className='stat-pill-num'>99.9%</div>
                  <div className='stat-pill-label'>Uptime</div>
                </div>
                <div className='stat-pill'>
                  <div className='stat-pill-num'>4.9★</div>
                  <div className='stat-pill-label'>Rating</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT ── */}
        <div className='login-right'>
          <div className='form-card'>
            <div className='form-header'>
              <p className='form-eyebrow'>Secure Access</p>
              <h1 className='form-title'>Welcome back.</h1>
              <p className='form-subtitle'>
                Sign in to continue to your dashboard
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className='field-wrapper'>
                <label
                  htmlFor='email'
                  className={`field-label${focusedField === "email" ? " focused" : ""}`}
                >
                  Email address
                </label>
                <div className='field-inner'>
                  <span
                    className={`field-icon${focusedField === "email" ? " focused" : ""}`}
                  >
                    <Mail size={16} />
                  </span>
                  <input
                    id='email'
                    name='email'
                    type='text'
                    placeholder='you@example.com'
                    autoCapitalize='none'
                    autoComplete='email'
                    autoCorrect='off'
                    disabled={isLoading}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                    className='field-input'
                    required
                  />
                </div>
              </div>

              <div className='field-wrapper'>
                <label
                  htmlFor='password'
                  className={`field-label${focusedField === "password" ? " focused" : ""}`}
                >
                  Password
                </label>
                <div className='field-inner'>
                  <span
                    className={`field-icon${focusedField === "password" ? " focused" : ""}`}
                  >
                    <Lock size={16} />
                  </span>
                  <input
                    id='password'
                    name='password'
                    type='password'
                    placeholder='••••••••'
                    autoComplete='current-password'
                    disabled={isLoading}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField(null)}
                    className='field-input'
                    required
                  />
                </div>
              </div>

              <div className='forgot-row'>
                <Link to='/forgot-password' className='forgot-link'>
                  Forgot password?
                </Link>
              </div>

              {error && (
                <div className='error-box'>
                  <span className='error-dot' />
                  {error}
                </div>
              )}

              <button type='submit' className='submit-btn' disabled={isLoading}>
                {isLoading ? (
                  <Loader2 size={18} className='spin' />
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight size={15} />
                  </>
                )}
              </button>
            </form>

            <div className='divider'>
              <div className='divider-line' />
              <span className='divider-text'>Or continue with</span>
              <div className='divider-line' />
            </div>

            <div className='social-grid'>
              <button
                className='social-btn'
                onClick={() => handleSocialLogin("google")}
                disabled={isLoading}
              >
                <FaGoogle />
                <span className='sr-only'>Google</span>
              </button>
              <button
                className='social-btn'
                onClick={() => handleSocialLogin("github")}
                disabled={isLoading}
              >
                <FaGithub />
                <span className='sr-only'>GitHub</span>
              </button>
              <button
                className='social-btn'
                onClick={() => handleSocialLogin("linkedin")}
                disabled={isLoading}
              >
                <FaLinkedin />
                <span className='sr-only'>LinkedIn</span>
              </button>
            </div>

            <p className='register-row'>
              Don't have an account?{" "}
              <Link to='/register' className='register-link'>
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
