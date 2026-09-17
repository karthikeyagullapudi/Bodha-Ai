import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hook/useAuth';
import { useSelector, useDispatch } from 'react-redux';
import { setError } from '../auth.slice';
import { ResendVerification } from '../services/auth.api';
import { Navigate } from 'react-router-dom';

const Login = () => {
  const location = useLocation();
  // Set by the register page after a successful sign-up
  const registeredEmail = location.state?.registeredEmail;

  const [formData, setFormData] = useState({
    email: registeredEmail || '',
    password: '',
  });
  const [resendNotice, setResendNotice] = useState(null);
  const [resending, setResending] = useState(false);

  const navigate = useNavigate();
  const { handleLogin } = useAuth();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  // Don't carry an error over from another page
  useEffect(() => {
    dispatch(setError(null));
  }, [dispatch]);

  const { user } = useSelector((state) => state.auth);
  if (!loading && user) {
    return <Navigate to="/" replace />;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResendNotice(null);
    try {
      await handleLogin(formData);
      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  // For accounts whose verification email expired or never arrived
  const handleResend = async () => {
    setResending(true);
    try {
      const data = await ResendVerification(formData.email);
      setResendNotice({ ok: true, text: data.message });
    } catch (err) {
      setResendNotice({
        ok: false,
        text:
          err.response?.data?.errors?.[0]?.msg ||
          err.response?.data?.message ||
          err.message,
      });
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-zinc-950 flex items-center justify-center p-4 overflow-hidden selection:bg-violet-500/30">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full mix-blend-screen filter blur-[100px] animate-pulse"></div>
      <div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-fuchsia-600/20 rounded-full mix-blend-screen filter blur-[100px] animate-pulse"
        style={{ animationDelay: '2s' }}
      ></div>

      <div className="relative w-full max-w-md z-10">
        <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 p-8 pt-10 rounded-[2rem] shadow-[0_8px_32px_0_rgba(0,0,0,0.5)]">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-extrabold mb-3 bg-gradient-to-br from-white via-white/90 to-white/40 text-transparent bg-clip-text">
              Welcome Back
            </h2>
            <p className="text-zinc-400 font-medium">
              Continue your journey with Bodha
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {registeredEmail && !error && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/40 rounded-xl text-emerald-400 text-sm text-center">
                Account created! We sent a verification link to{' '}
                {registeredEmail}. Verify your email, then sign in.
              </div>
            )}
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-xl text-red-500 text-sm text-center">
                {error}
                {/verify your email/i.test(error) && !resendNotice?.ok && (
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resending}
                    className="block mx-auto mt-2 font-semibold text-violet-400 hover:text-violet-300 underline disabled:opacity-60"
                  >
                    {resending ? 'Sending...' : 'Resend verification email'}
                  </button>
                )}
              </div>
            )}
            {resendNotice && (
              <div
                className={`p-3 rounded-xl text-sm text-center border ${
                  resendNotice.ok
                    ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                    : 'bg-red-500/10 border-red-500/50 text-red-500'
                }`}
              >
                {resendNotice.text}
              </div>
            )}
            <div className="space-y-2">
              <label
                className="text-xs font-semibold text-zinc-400 uppercase tracking-wider ml-1"
                htmlFor="email"
              >
                Email
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-zinc-500 group-focus-within:text-violet-400 transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                    />
                  </svg>
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3.5 bg-zinc-950/50 text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-500/50 border border-white/5 focus:border-violet-500/50 transition-all focus:shadow-[0_0_20px_-3px_rgba(139,92,246,0.2)] placeholder-zinc-600"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                className="text-xs font-semibold text-zinc-400 uppercase tracking-wider ml-1"
                htmlFor="password"
              >
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-zinc-500 group-focus-within:text-violet-400 transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3.5 bg-zinc-950/50 text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-500/50 border border-white/5 focus:border-violet-500/50 transition-all focus:shadow-[0_0_20px_-3px_rgba(139,92,246,0.2)] placeholder-zinc-600"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-semibold rounded-2xl text-white bg-violet-600 overflow-hidden transition-all hover:scale-[1.02] shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:shadow-[0_0_30px_rgba(139,92,246,0.6)] focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-violet-600 opacity-90 transition-all group-hover:bg-[length:200%_100%] animate-[gradient_3s_ease_infinite]"></div>
                <span className="relative text-base tracking-wide">
                  {loading ? 'Signing in...' : 'Sign In'}
                </span>
              </button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-zinc-400">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-semibold text-violet-400 hover:text-violet-300 transition-colors drop-shadow-[0_0_10px_rgba(139,92,246,0.3)]"
              >
                Create one now
              </Link>
            </p>
            <a
              href="/privacy.html"
              className="inline-block mt-4 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              Privacy Policy
            </a>
          </div>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `,
        }}
      />
    </div>
  );
};

export default Login;
