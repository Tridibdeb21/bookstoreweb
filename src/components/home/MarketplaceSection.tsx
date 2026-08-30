import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Repeat, PlusCircle, CheckCircle2, DollarSign, Sparkles } from 'lucide-react';

export const MarketplaceSection: React.FC = () => {
  const { usedListings, buyUsedListing, setIsSellUsedOpen, books, setSelectedBook } = useStore();

  const activeListings = usedListings.filter((l) => l.status === 'active');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-2xl font-bold text-stone-900">
              Community Pre-Owned Marketplace
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
              {activeListings.length} Active
            </span>
          </div>
          <p className="text-sm text-stone-600">
            Buy pre-loved books from fellow readers or sell your own copies sustainably.
          </p>
        </div>

        <button
          id="sell-copy-btn"
          onClick={() => setIsSellUsedOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm shadow-md transition cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>List a Book for Sale</span>
        </button>
      </div>

      {activeListings.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200">
          <Repeat className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <h3 className="font-serif font-bold text-lg text-stone-800">No Used Listings Right Now</h3>
          <p className="text-sm text-stone-500 max-w-md mx-auto mt-1 mb-6">
            Be the first to list a gently read book in our community marketplace!
          </p>
          <button
            onClick={() => setIsSellUsedOpen(true)}
            className="px-6 py-2.5 rounded-xl bg-stone-900 text-white font-bold text-sm hover:bg-stone-800 transition"
          >
            Create First Listing
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {activeListings.map((listing) => {
            const conditionColor =
              listing.condition === 'Like New'
                ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                : listing.condition === 'Good'
                ? 'bg-sky-100 text-sky-800 border-sky-300'
                : 'bg-amber-100 text-amber-800 border-amber-300';

            return (
              <div
                key={listing.id}
                id={`used-listing-${listing.id}`}
                className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex gap-4">
                    <img
                      src={listing.bookCoverUrl}
                      alt={listing.bookTitle}
                      className="w-16 h-22 object-cover rounded-lg shadow-sm shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold border mb-1.5 ${conditionColor}`}
                      >
                        {listing.condition}
                      </span>
                      <h4
                        onClick={() => {
                          const original = books.find((b) => b.id === listing.bookId);
                          if (original) setSelectedBook(original);
                        }}
                        className="font-serif font-bold text-stone-900 hover:text-amber-600 line-clamp-1 cursor-pointer transition-colors"
                      >
                        {listing.bookTitle}
                      </h4>
                      <p className="text-xs text-stone-500 mb-1">
                        Seller: <span className="font-semibold text-stone-700">{listing.sellerEmail}</span>
                      </p>
                      <div className="text-lg font-black text-amber-600">
                        ${listing.askingPrice.toFixed(2)}
                      </div>
                    </div>
                  </div>

                  {listing.description && (
                    <p className="mt-3 text-xs text-stone-600 bg-stone-50 p-2.5 rounded-xl border border-stone-100 italic">
                      "{listing.description}"
                    </p>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-[11px] text-stone-400">
                    Listed {new Date(listing.timestamp).toLocaleDateString()}
                  </span>
                  <button
                    id={`buy-used-${listing.id}`}
                    onClick={() => {
                      buyUsedListing(listing.id);
                      alert(`Purchase confirmed for "${listing.bookTitle}" from ${listing.sellerEmail}!`);
                    }}
                    className="px-4 py-1.5 rounded-xl bg-stone-900 hover:bg-amber-500 text-white hover:text-stone-950 font-bold text-xs transition cursor-pointer"
                  >
                    Buy This Copy
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
