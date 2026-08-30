import React, { useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { CheckCircle2, ShoppingBag, BookMarked, Heart, Info, X, ArrowRight } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toast, hideToast, setIsCartOpen, setActiveView } = useStore();

  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => {
      hideToast();
    }, 4500);

    return () => clearTimeout(timer);
  }, [toast, hideToast]);

  if (!toast) return null;

  const getIcon = () => {
    switch (toast.type) {
      case 'cart':
        return <ShoppingBag className="w-5 h-5 text-amber-500" />;
      case 'shelf':
        return <BookMarked className="w-5 h-5 text-purple-400" />;
      case 'wishlist':
        return <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />;
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
      default:
        return <Info className="w-5 h-5 text-amber-400" />;
    }
  };

  const getBadgeColor = () => {
    switch (toast.type) {
      case 'cart':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'shelf':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'wishlist':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
      default:
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
    }
  };

  return (
    <aside
      aria-label="Notification"
      id="global-store-toast"
      className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 max-w-md w-[calc(100vw-2rem)] sm:w-auto bg-stone-900/95 backdrop-blur-md text-white rounded-2xl p-4 shadow-2xl border border-stone-700/80 transition-all duration-300 animate-in fade-in slide-in-from-bottom-5"
    >
      <div className="flex items-start gap-3">
        {/* Cover thumbnail or Icon */}
        {toast.book?.imageUrl ? (
          <div className="relative w-12 h-16 rounded-lg overflow-hidden bg-stone-800 flex-shrink-0 border border-stone-700 shadow-md">
            <img
              src={toast.book.imageUrl}
              alt={toast.book.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 to-transparent" />
            <div className="absolute bottom-1 right-1 p-0.5 rounded-full bg-stone-900/80 text-amber-400">
              <CheckCircle2 className="w-3 h-3" />
            </div>
          </div>
        ) : (
          <div className="p-2.5 rounded-xl bg-stone-800 flex-shrink-0 border border-stone-700">
            {getIcon()}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0 pr-2">
          <div className="flex items-center gap-1.5 mb-1">
            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${getBadgeColor()}`}>
              {toast.type === 'cart' ? 'Added to Cart' : toast.type === 'shelf' ? 'Bookshelf' : toast.type === 'wishlist' ? 'Wishlist' : 'Updated'}
            </span>
          </div>

          <p className="text-sm font-semibold text-stone-100 line-clamp-1">
            {toast.book ? toast.book.title : toast.message}
          </p>

          {toast.book && (
            <p className="text-xs text-stone-400 line-clamp-1 mb-2">
              by {toast.book.author} · ${toast.book.flashSalePrice || toast.book.price}
            </p>
          )}

          {/* Quick Actions */}
          {toast.type === 'cart' && (
            <button
              id="toast-view-cart-btn"
              onClick={() => {
                hideToast();
                setIsCartOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-md transition-transform hover:scale-105 cursor-pointer"
            >
              <span>View Cart & Checkout</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {toast.type === 'shelf' && (
            <button
              id="toast-view-shelf-btn"
              onClick={() => {
                hideToast();
                setActiveView('shelf');
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition-transform hover:scale-105 cursor-pointer"
            >
              <span>View My Bookshelf</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {toast.type === 'wishlist' && (
            <button
              id="toast-view-wishlist-btn"
              onClick={() => {
                hideToast();
                setActiveView('wishlist');
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition-transform hover:scale-105 cursor-pointer"
            >
              <span>View Wishlist</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Dismiss X */}
        <button
          id="toast-dismiss-btn"
          onClick={hideToast}
          className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition cursor-pointer"
          title="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
