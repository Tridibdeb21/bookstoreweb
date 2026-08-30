import React from 'react';
import { Book } from '../../types';
import { useStore } from '../../context/StoreContext';
import { Star, Heart, ShoppingBag, Zap } from 'lucide-react';

interface BookCardProps {
  book: Book;
}

export const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const { setSelectedBook, addToCart, toggleWishlist, isInWishlist } = useStore();
  const isWishlisted = isInWishlist(book.id);

  const hasActiveFlashSale =
    book.flashSalePrice != null &&
    book.flashSaleExpiry != null &&
    book.flashSaleExpiry > Date.now();

  const currentPrice = hasActiveFlashSale ? book.flashSalePrice! : book.price;

  return (
    <div
      id={`book-card-${book.id}`}
      onClick={() => setSelectedBook(book)}
      className="group relative bg-white rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 border border-stone-200/80 flex flex-col justify-between cursor-pointer overflow-hidden"
    >
      {/* Badges Top Bar */}
      <div className="relative w-full aspect-[3/4] mb-3 rounded-xl overflow-hidden bg-stone-100 shadow-inner">
        <img
          src={book.imageUrl}
          alt={book.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Wishlist Button */}
        <button
          id={`wishlist-toggle-${book.id}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(book.id);
          }}
          className="absolute top-2.5 right-2.5 p-2 rounded-full bg-stone-900/60 hover:bg-stone-900 backdrop-blur-sm text-white transition-transform hover:scale-110 cursor-pointer shadow-md"
          title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isWishlisted ? 'fill-rose-500 text-rose-500' : 'text-white'
            }`}
          />
        </button>

        {/* Dynamic Status Tags */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 items-start">
          {hasActiveFlashSale && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-rose-600 text-white shadow-md">
              <Zap className="w-3 h-3 fill-amber-300 text-amber-300" />
              Flash Sale
            </span>
          )}
          {book.isBestSeller && !hasActiveFlashSale && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-amber-500 text-stone-950 shadow-sm">
              Best Seller
            </span>
          )}
          {book.isTrending && !book.isBestSeller && !hasActiveFlashSale && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-600 text-white shadow-sm">
              Trending
            </span>
          )}
        </div>
      </div>

      {/* Book Information */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-1 text-xs text-amber-600 font-semibold mb-1">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{book.rating.toFixed(1)}</span>
            <span className="text-stone-400 font-normal">({book.reviewsCount})</span>
          </div>

          <h3 className="font-serif font-bold text-base text-stone-900 line-clamp-1 group-hover:text-amber-600 transition-colors">
            {book.title}
          </h3>

          <p className="text-xs text-stone-500 font-medium line-clamp-1 mb-2">
            by {book.author}
          </p>
        </div>

        {/* Pricing & Add to Cart */}
        <div className="mt-2 pt-2 border-t border-stone-100 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-black text-stone-900">
                ${currentPrice.toFixed(2)}
              </span>
              {hasActiveFlashSale && (
                <span className="text-xs text-stone-400 line-through font-semibold">
                  ${book.price.toFixed(2)}
                </span>
              )}
            </div>
            {book.stockCount <= 5 && book.stockCount > 0 && (
              <span className="text-[10px] font-bold text-rose-600">
                Only {book.stockCount} left!
              </span>
            )}
          </div>

          <button
            id={`quick-add-cart-${book.id}`}
            onClick={(e) => {
              e.stopPropagation();
              addToCart(book, 1);
            }}
            className="p-2 rounded-xl bg-stone-900 hover:bg-amber-500 text-white hover:text-stone-950 transition-colors shadow-sm cursor-pointer"
            title="Add to Cart"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
