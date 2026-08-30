import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Crown, Star, ShoppingBag, BookMarked, Sparkles, Check } from 'lucide-react';

export const BookOfTheDay: React.FC = () => {
  const { books, setSelectedBook, addToCart, addToShelf } = useStore();
  const [isAdded, setIsAdded] = useState(false);

  const bookOfDay = books.find((b) => b.isBookOfDay) || books[0];
  if (!bookOfDay) return null;

  const handleAddToCart = () => {
    addToCart(bookOfDay, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1800);
  };

  const currentPrice =
    bookOfDay.flashSalePrice &&
    bookOfDay.flashSaleExpiry &&
    bookOfDay.flashSaleExpiry > Date.now()
      ? bookOfDay.flashSalePrice
      : bookOfDay.price;

  return (
    <section className="bg-stone-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden border border-stone-800 shadow-xl">
      <div className="absolute -right-20 -top-20 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-widest mb-4">
        <Crown className="w-4 h-4" />
        <span>Featured Editor's Choice — Book of the Day</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        {/* Cover */}
        <div className="md:col-span-4 flex justify-center">
          <div
            onClick={() => setSelectedBook(bookOfDay)}
            className="relative w-48 sm:w-56 aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border-2 border-stone-700/50 group cursor-pointer"
          >
            <img
              src={bookOfDay.imageUrl}
              alt={bookOfDay.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
              <span className="text-xs font-bold text-amber-300">Click to preview details</span>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="md:col-span-8 space-y-4">
          <div className="flex items-center gap-2">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(bookOfDay.rating) ? 'fill-current' : 'text-stone-600'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-bold text-stone-300">
              {bookOfDay.rating.toFixed(1)} / 5.0
            </span>
            <span className="text-xs text-stone-500">
              ({bookOfDay.reviewsCount} verified reviews)
            </span>
          </div>

          <h3
            onClick={() => setSelectedBook(bookOfDay)}
            className="font-serif text-2xl sm:text-3xl font-bold text-stone-100 hover:text-amber-400 transition-colors cursor-pointer"
          >
            {bookOfDay.title}
          </h3>

          <p className="text-sm text-stone-400 font-medium">
            Written by <span className="text-stone-200 font-semibold">{bookOfDay.author}</span>
          </p>

          <p className="text-sm text-stone-300 leading-relaxed line-clamp-3">
            {bookOfDay.description}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-amber-400">
                ${currentPrice.toFixed(2)}
              </span>
              {bookOfDay.flashSalePrice && (
                <span className="text-sm text-stone-500 line-through">
                  ${bookOfDay.price.toFixed(2)}
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                id="book-of-day-cart-btn"
                onClick={handleAddToCart}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm shadow-lg transition-all cursor-pointer ${
                  isAdded
                    ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                    : 'bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-amber-500/20'
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Cart! ✓</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>

              <button
                id="book-of-day-shelf-btn"
                onClick={() => addToShelf(bookOfDay, 'To Read')}
                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold text-sm border border-stone-700 transition cursor-pointer"
              >
                <BookMarked className="w-4 h-4 text-purple-400" />
                <span>Save to Bookshelf</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
