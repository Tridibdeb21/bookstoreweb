import React from 'react';
import { useStore } from '../../context/StoreContext';
import { BookCard } from '../home/BookCard';
import { Heart, BookOpen } from 'lucide-react';

export const WishlistView: React.FC = () => {
  const { user, books, setActiveView } = useStore();

  const wishlistedBooks = books.filter((b) => user.wishlist.includes(b.id));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
              Your Wishlist
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
              {wishlistedBooks.length} Items
            </span>
          </div>
          <p className="text-xs sm:text-sm text-stone-600">
            Books saved to read later or waiting for flash discounts
          </p>
        </div>
      </div>

      {wishlistedBooks.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200">
          <Heart className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <h3 className="font-serif font-bold text-lg text-stone-800">Your Wishlist is Empty</h3>
          <p className="text-sm text-stone-500 max-w-sm mx-auto mt-1 mb-6">
            Click the heart icon on any book card to save it to your personal wishlist!
          </p>
          <button
            onClick={() => setActiveView('home')}
            className="px-6 py-2.5 rounded-xl bg-stone-900 text-white font-bold text-xs hover:bg-stone-800 transition"
          >
            Explore Books
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {wishlistedBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
};
