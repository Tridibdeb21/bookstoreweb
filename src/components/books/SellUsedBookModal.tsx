import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { X, Repeat, CheckCircle2, DollarSign } from 'lucide-react';
import { UsedCondition } from '../../types';

export const SellUsedBookModal: React.FC = () => {
  const { isSellUsedOpen, setIsSellUsedOpen, books, selectedBook, createUsedListing } = useStore();

  const [chosenBookId, setChosenBookId] = useState<string>(selectedBook ? selectedBook.id : books[0]?.id || '');
  const [askingPrice, setAskingPrice] = useState('');
  const [condition, setCondition] = useState<UsedCondition>('Good');
  const [description, setDescription] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isSellUsedOpen) return null;

  const targetBook = books.find((b) => b.id === chosenBookId) || books[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = parseFloat(askingPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      alert('Please enter a valid asking price.');
      return;
    }

    if (!targetBook) return;

    createUsedListing({
      bookId: targetBook.id,
      bookTitle: targetBook.title,
      bookCoverUrl: targetBook.imageUrl,
      askingPrice: priceNum,
      condition,
      description
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setIsSellUsedOpen(false);
      setAskingPrice('');
      setDescription('');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        id="sell-used-modal-container"
        className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-stone-200"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-800 flex items-center justify-center">
              <Repeat className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-xl text-stone-900">
                Sell Your Used Copy
              </h3>
              <p className="text-xs text-stone-500">
                List your gently read books in our community marketplace
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsSellUsedOpen(false)}
            className="p-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center space-y-3 bg-emerald-50 rounded-2xl border border-emerald-200">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h4 className="font-serif font-bold text-lg text-emerald-900">
              Listing Created Successfully!
            </h4>
            <p className="text-xs text-emerald-700">
              Your copy is now visible to the reading community in the marketplace.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Book Selector */}
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1.5">
                Select Book to Sell
              </label>
              <select
                value={chosenBookId}
                onChange={(e) => setChosenBookId(e.target.value)}
                className="w-full p-3 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:border-amber-500 font-medium"
              >
                {books.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.title} — by {b.author} (Retail: ${b.price.toFixed(2)})
                  </option>
                ))}
              </select>
            </div>

            {/* Selected Book Summary Badge */}
            {targetBook && (
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center gap-3">
                <img
                  src={targetBook.imageUrl}
                  alt={targetBook.title}
                  className="w-12 h-16 object-cover rounded-lg shadow-sm"
                />
                <div>
                  <h4 className="font-bold text-xs text-stone-900 line-clamp-1">{targetBook.title}</h4>
                  <p className="text-[11px] text-stone-500">Author: {targetBook.author}</p>
                  <p className="text-[11px] text-stone-400">Retail Value: ${targetBook.price.toFixed(2)}</p>
                </div>
              </div>
            )}

            {/* Condition Selection */}
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1.5">
                Book Condition
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Like New', 'Good', 'Acceptable'] as UsedCondition[]).map((cond) => (
                  <button
                    key={cond}
                    type="button"
                    onClick={() => setCondition(cond)}
                    className={`py-2.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
                      condition === cond
                        ? 'bg-amber-500 text-stone-950 border-amber-600 shadow-sm'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {cond}
                  </button>
                ))}
              </div>
            </div>

            {/* Asking Price */}
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1.5">
                Your Asking Price ($ USD)
              </label>
              <div className="relative">
                <DollarSign className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="number"
                  step="0.50"
                  min="1"
                  max="500"
                  value={askingPrice}
                  onChange={(e) => setAskingPrice(e.target.value)}
                  placeholder="e.g. 9.50"
                  className="w-full pl-9 pr-4 py-2.5 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:border-amber-500 font-bold"
                  required
                />
              </div>
            </div>

            {/* Description Notes */}
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1.5">
                Notes on Condition / Edition (Optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Read once, paperback, no highlights or dog ears..."
                rows={2}
                className="w-full p-3 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsSellUsedOpen(false)}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-md transition"
              >
                Post Listing
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
