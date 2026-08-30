import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  BookOpen,
  ShoppingBag,
  Heart,
  Sparkles,
  Bot,
  Search,
  ShieldCheck,
  User,
  LogIn,
  LogOut,
  ChevronDown,
  PackageCheck
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    activeView,
    setActiveView,
    cart,
    setIsCartOpen,
    setIsAiChatOpen,
    setIsAiRecommendOpen,
    setIsAuthModalOpen,
    isAuthenticated,
    user,
    logout,
    searchQuery,
    setSearchQuery
  } = useStore();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 bg-stone-900 text-stone-100 border-b border-stone-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand Logo */}
          <button
            id="nav-brand-logo"
            onClick={() => setActiveView('home')}
            className="flex items-center space-x-3 text-left focus:outline-none group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-stone-950 font-black shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-amber-400 group-hover:text-amber-300 transition-colors">
                BookStore
              </span>
              <span className="hidden sm:inline-block text-xs uppercase tracking-widest text-stone-400 font-semibold ml-2">
                Curated & Pre-Owned
              </span>
            </div>
          </button>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-2 hidden md:block">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                id="nav-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, author, or genre..."
                className="w-full pl-10 pr-4 py-2 bg-stone-800/90 text-stone-100 placeholder-stone-400 rounded-full text-sm border border-stone-700 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-200"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Action Links */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            {/* AI Recommendation Launcher */}
            <button
              id="nav-ai-recommend-btn"
              onClick={() => setIsAiRecommendOpen(true)}
              className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-stone-800 hover:bg-stone-700 text-amber-300 border border-amber-500/30 transition cursor-pointer"
              title="AI Book Matcher"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1 text-amber-400 animate-pulse" />
              <span className="hidden sm:inline">AI Matcher</span>
            </button>

            {/* AI Assistant Chat Launcher */}
            <button
              id="nav-ai-chat-btn"
              onClick={() => setIsAiChatOpen(true)}
              className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-stone-800 hover:bg-stone-700 text-emerald-300 border border-emerald-500/30 transition cursor-pointer"
              title="Chat with AI Literature Assistant"
            >
              <Bot className="w-3.5 h-3.5 mr-1 text-emerald-400" />
              <span className="hidden sm:inline">AI Chat</span>
            </button>

            {/* Wishlist Link */}
            <button
              id="nav-wishlist-btn"
              onClick={() => setActiveView('wishlist')}
              className={`p-2 rounded-full relative transition cursor-pointer ${
                activeView === 'wishlist'
                  ? 'bg-amber-500/20 text-amber-400'
                  : 'text-stone-300 hover:bg-stone-800'
              }`}
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {user.wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {user.wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Drawer Toggle */}
            <button
              id="nav-cart-btn"
              onClick={() => setIsCartOpen(true)}
              className="p-2 rounded-full text-stone-300 hover:bg-stone-800 relative transition cursor-pointer"
              title="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-stone-950 font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                  {totalCartCount}
                </span>
              )}
            </button>

            {/* Admin Portal Shortcut if Admin */}
            {isAuthenticated && user.role === 'admin' && (
              <button
                id="nav-admin-btn"
                onClick={() => setActiveView('admin')}
                className={`hidden sm:inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
                  activeView === 'admin'
                    ? 'bg-amber-400 text-stone-950'
                    : 'bg-stone-800 hover:bg-stone-700 text-amber-400 border border-amber-500/40'
                }`}
                title="Admin Control Center"
              >
                <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                <span>Admin</span>
              </button>
            )}

            {/* Authentication / Profile Button */}
            {!isAuthenticated ? (
              <button
                id="nav-signin-btn"
                onClick={() => setIsAuthModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-md transition cursor-pointer"
                title="Sign In / Register"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            ) : (
              <div className="relative" ref={menuRef}>
                <button
                  id="nav-profile-btn"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className={`p-1 pl-1.5 pr-2 rounded-full transition cursor-pointer flex items-center gap-1.5 ${
                    activeView === 'profile'
                      ? 'ring-2 ring-amber-400 bg-stone-800'
                      : 'hover:bg-stone-800 text-stone-300'
                  }`}
                  title="User Profile Menu"
                >
                  {user.profileImageBase64 ? (
                    <img
                      src={`data:image/jpeg;base64,${user.profileImageBase64}`}
                      alt="Profile"
                      className="w-7 h-7 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-stone-700 flex items-center justify-center text-amber-400 text-xs font-bold">
                      {user.email ? user.email[0].toUpperCase() : <User className="w-4 h-4" />}
                    </div>
                  )}
                  <span className="text-xs font-semibold max-w-[80px] truncate hidden lg:inline">
                    {user.email.split('@')[0]}
                  </span>
                  <ChevronDown className="w-3 h-3 text-stone-400" />
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-4 py-2.5 border-b border-stone-800">
                      <p className="text-xs font-bold text-stone-200 truncate">{user.email}</p>
                      <span className="inline-block mt-0.5 text-[10px] uppercase tracking-wider font-extrabold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
                        {user.role === 'admin' ? 'Administrator' : 'Reader Account'}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setActiveView('profile');
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-semibold text-stone-300 hover:bg-stone-800 hover:text-white flex items-center gap-2.5 transition cursor-pointer"
                    >
                      <User className="w-4 h-4 text-amber-400" />
                      <span>My Profile & Reading Goals</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveView('orders');
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-semibold text-stone-300 hover:bg-stone-800 hover:text-white flex items-center gap-2.5 transition cursor-pointer"
                    >
                      <PackageCheck className="w-4 h-4 text-emerald-400" />
                      <span>Order History</span>
                    </button>

                    {user.role === 'admin' && (
                      <button
                        onClick={() => {
                          setActiveView('admin');
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left text-xs font-semibold text-stone-300 hover:bg-stone-800 hover:text-white flex items-center gap-2.5 transition cursor-pointer"
                      >
                        <ShieldCheck className="w-4 h-4 text-amber-400" />
                        <span>Admin Control Center</span>
                      </button>
                    )}

                    <div className="border-t border-stone-800 my-1" />

                    <button
                      id="nav-signout-btn"
                      onClick={() => {
                        logout();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-bold text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 flex items-center gap-2.5 transition cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

