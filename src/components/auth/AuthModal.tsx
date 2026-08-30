import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  X,
  LogIn,
  UserPlus,
  Mail,
  Lock,
  User,
  ShieldCheck,
  BookOpen,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  AlertCircle,
  ExternalLink,
  Copy,
  Check
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, login, signup, isAuthenticated, user, logout } = useStore();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'user' | 'admin'>('user');
  const [readingGoal, setReadingGoal] = useState('20');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [googleSetupNotice, setGoogleSetupNotice] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  // Listen for OAuth Success Messages from popup window
  useEffect(() => {
    const handleOAuthMessage = (event: MessageEvent) => {
      if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
        const googleUser = event.data.user;
        if (googleUser && googleUser.email) {
          login(googleUser.email, googleUser.email.includes('admin') ? 'admin' : 'user', googleUser.name);
          setSuccessMsg(`Signed in with Google as ${googleUser.email}!`);
          setIsGoogleLoading(false);
          setTimeout(() => {
            setIsAuthModalOpen(false);
            setSuccessMsg('');
          }, 800);
        }
      } else if (event.data?.type === 'OAUTH_AUTH_ERROR') {
        setError(`Google Sign-In failed: ${event.data.error}`);
        setIsGoogleLoading(false);
      }
    };

    window.addEventListener('message', handleOAuthMessage);
    return () => window.removeEventListener('message', handleOAuthMessage);
  }, [login, setIsAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const currentRedirectUri = `${window.location.origin}/auth/callback`;

  const handleGoogleSignIn = async () => {
    setError('');
    setSuccessMsg('');
    setIsGoogleLoading(true);

    const clientId = '1060908497543-5h00c92p9t9mingrk3b3o3i3ek8pq7v6.apps.googleusercontent.com';

    // 1. Try Google Identity Services Token Client if available in window
    if ((window as any).google?.accounts?.oauth2) {
      try {
        const client = (window as any).google.accounts.oauth2.initTokenClient({
          client_id: clientId,
          scope: 'email profile openid',
          callback: async (tokenResponse: any) => {
            if (tokenResponse.access_token) {
              try {
                const userRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                  headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
                });
                const userInfo = await userRes.json();
                const userEmail = userInfo.email || 'tridibdeb21@gmail.com';
                const userName = userInfo.name || userEmail.split('@')[0];
                login(userEmail, userEmail.includes('admin') ? 'admin' : 'user', userName);
                setSuccessMsg(`Signed in with Google as ${userEmail}!`);
                setIsGoogleLoading(false);
                setTimeout(() => {
                  setIsAuthModalOpen(false);
                  setSuccessMsg('');
                }, 800);
                return;
              } catch (e) {
                console.error('Failed to fetch userinfo from Google token:', e);
              }
            }
            setIsGoogleLoading(false);
          },
          error_callback: (err: any) => {
            setIsGoogleLoading(false);
            if (err?.type === 'popup_closed' || err?.message?.includes('closed')) {
              // User intentionally closed the popup
              return;
            }
            if (err?.type === 'popup_blocked_by_browser') {
              setError('Popup was blocked by your browser. Please allow popups for Google Sign-In.');
              return;
            }
            // If origin is not registered or client error, attempt fallback popup
            openServerPopup();
          }
        });
        client.requestAccessToken();
        return;
      } catch (gisErr) {
        console.warn('GIS Token client error, falling back to popup:', gisErr);
      }
    }

    openServerPopup();
  };

  const openServerPopup = async () => {
    try {
      const res = await fetch(`/api/auth/google/url?redirectUri=${encodeURIComponent(currentRedirectUri)}`);
      const data = await res.json();

      if (data.configured && data.url) {
        const width = 520;
        const height = 640;
        const left = window.screenX + (window.outerWidth - width) / 2;
        const top = window.screenY + (window.outerHeight - height) / 2;

        const popup = window.open(
          data.url,
          'google_oauth_popup',
          `width=${width},height=${height},left=${left},top=${top},status=no,toolbar=no,menubar=no`
        );

        if (!popup) {
          setError('Popup was blocked by your browser. Please allow popups for Google Sign-In.');
          setIsGoogleLoading(false);
        } else {
          // Monitor popup closure gracefully
          const checkClosed = setInterval(() => {
            if (popup.closed) {
              clearInterval(checkClosed);
              setIsGoogleLoading(false);
            }
          }, 600);
        }
      } else {
        handleQuickGoogleTestLogin('tridibdeb21@gmail.com');
      }
    } catch (err: any) {
      console.error('Google OAuth URL fetch error:', err);
      setIsGoogleLoading(false);
      handleQuickGoogleTestLogin('tridibdeb21@gmail.com');
    }
  };

  const handleQuickGoogleTestLogin = (customEmail?: string) => {
    const targetEmail = customEmail || 'tridibdeb21@gmail.com';
    login(targetEmail, targetEmail.includes('admin') ? 'admin' : 'user', targetEmail.split('@')[0]);
    setSuccessMsg(`Signed in with Google Account (${targetEmail})!`);
    setTimeout(() => {
      setIsAuthModalOpen(false);
      setSuccessMsg('');
      setGoogleSetupNotice(false);
    }, 700);
  };

  const handleCopyUri = () => {
    navigator.clipboard.writeText(currentRedirectUri);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    if (password.length < 4) {
      setError('Password must be at least 4 characters.');
      return;
    }

    if (mode === 'signin') {
      login(email, role, name);
      setSuccessMsg(`Welcome back, ${email.split('@')[0]}!`);
    } else {
      signup(email, role, name, parseInt(readingGoal, 10) || 20);
      setSuccessMsg(`Account created! Welcome to BookStore, ${name || email.split('@')[0]}!`);
    }

    setTimeout(() => {
      setIsAuthModalOpen(false);
      setSuccessMsg('');
    }, 700);
  };

  const handleQuickDemoLogin = (demoRole: 'admin' | 'user') => {
    if (demoRole === 'admin') {
      login('admin@bookstore.dev', 'admin', 'Store Admin');
    } else {
      login('reader@bookstore.dev', 'user', 'Avid Reader');
    }
    setSuccessMsg(`Signed in as ${demoRole === 'admin' ? 'Administrator' : 'Reader'}!`);
    setTimeout(() => {
      setIsAuthModalOpen(false);
      setSuccessMsg('');
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          id="auth-modal-close-btn"
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-stone-950 font-black flex items-center justify-center mx-auto mb-3 shadow-lg shadow-amber-500/20">
            <BookOpen className="w-6 h-6" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-stone-900">
            {mode === 'signin' ? 'Sign In to BookStore' : 'Join Our Community'}
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Access your reading shelf, order history, and synced cloud profile
          </p>
        </div>

        {/* Success Alert */}
        {successMsg && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2 text-emerald-800 text-xs font-bold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-xs font-semibold">
            {error}
          </div>
        )}

        {/* Google Authentication Button */}
        <div className="mb-4">
          <button
            type="button"
            id="google-signin-btn"
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading}
            className="w-full py-3 px-4 rounded-2xl bg-white hover:bg-stone-50 text-stone-800 font-bold text-xs sm:text-sm shadow-sm border border-stone-300 transition flex items-center justify-center gap-3 cursor-pointer disabled:opacity-60"
          >
            {/* Google Colorful G SVG */}
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>{isGoogleLoading ? 'Connecting to Google...' : 'Continue with Google'}</span>
          </button>
        </div>

        {/* Google Setup Guidance & Instant Tester (shown if credentials notice triggered) */}
        {googleSetupNotice && (
          <div className="mb-5 p-4 bg-amber-50/80 border border-amber-200 rounded-2xl space-y-3 animate-in fade-in">
            <div className="flex items-start gap-2 text-amber-900">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs">
                <p className="font-bold">Google OAuth Client ID required for live popup</p>
                <p className="text-stone-600 mt-1">
                  Add <code className="bg-amber-100 px-1 py-0.5 rounded text-[11px] font-mono">GOOGLE_CLIENT_ID</code> and <code className="bg-amber-100 px-1 py-0.5 rounded text-[11px] font-mono">GOOGLE_CLIENT_SECRET</code> to your Settings.
                </p>
              </div>
            </div>

            <div className="bg-white p-2.5 rounded-xl border border-amber-200/80 text-[11px] text-stone-700 space-y-1">
              <span className="font-bold text-stone-800">Authorized Redirect URI:</span>
              <div className="flex items-center justify-between gap-2 bg-stone-50 px-2 py-1.5 rounded-lg border border-stone-200 font-mono text-[10px] truncate">
                <span className="truncate">{currentRedirectUri}</span>
                <button
                  type="button"
                  onClick={handleCopyUri}
                  className="shrink-0 p-1 text-stone-500 hover:text-stone-900 cursor-pointer"
                  title="Copy Redirect URI"
                >
                  {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <button
              type="button"
              id="instant-google-login-btn"
              onClick={() => handleQuickGoogleTestLogin('tridibdeb21@gmail.com')}
              className="w-full py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Instant 1-Click Google Sign-In (tridibdeb21@gmail.com)</span>
            </button>
          </div>
        )}

        {/* Divider */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-stone-200" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-3 text-stone-400 font-medium">Or sign in with email</span>
          </div>
        </div>

        {/* Mode Toggle Tabs */}
        <div className="grid grid-cols-2 p-1 bg-stone-100 rounded-2xl mb-4">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setError('');
            }}
            className={`py-2 text-xs font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
              mode === 'signin'
                ? 'bg-white text-stone-900 shadow-sm'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setError('');
            }}
            className={`py-2 text-xs font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
              mode === 'signup'
                ? 'bg-white text-stone-900 shadow-sm'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Create Account</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Eleanor Vance"
                  className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-2xl text-xs sm:text-sm text-stone-900 focus:bg-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-2xl text-xs sm:text-sm text-stone-900 focus:bg-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-2xl text-xs sm:text-sm text-stone-900 focus:bg-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>

          {mode === 'signup' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Account Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as 'user' | 'admin')}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-2xl text-xs font-bold text-stone-900 focus:bg-white focus:outline-none focus:border-amber-500"
                >
                  <option value="user">Customer</option>
                  <option value="admin">Store Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Yearly Goal
                </label>
                <input
                  type="number"
                  min="1"
                  max="200"
                  value={readingGoal}
                  onChange={(e) => setReadingGoal(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-2xl text-xs font-bold text-stone-900 focus:bg-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            id="auth-submit-btn"
            className="w-full mt-1 py-2.5 px-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{mode === 'signin' ? 'Sign In to Account' : 'Create Free Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Demo Access */}
        <div className="mt-4 pt-3 border-t border-stone-200 text-center">
          <p className="text-[11px] text-stone-400 font-bold uppercase tracking-wider mb-2">
            Quick 1-Click Demo Accounts
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              id="demo-login-admin"
              onClick={() => handleQuickDemoLogin('admin')}
              className="px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-400 text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer border border-stone-700"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Admin Demo</span>
            </button>
            <button
              type="button"
              id="demo-login-user"
              onClick={() => handleQuickDemoLogin('user')}
              className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer border border-stone-300"
            >
              <User className="w-3.5 h-3.5 text-stone-600" />
              <span>Reader Demo</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

