import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { X, Zap, Crown, CheckCircle2 } from 'lucide-react';

export const ManageFlashSaleModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose
}) => {
  const { books, setFlashSale, setBookOfDay } = useStore();

  const [selectedBookId, setSelectedBookId] = useState(books[0]?.id || '');
  const [salePrice, setSalePrice] = useState('');
  const [durationHours, setDurationHours] = useState('24');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const targetBook = books.find((b) => b.id === selectedBookId) || books[0];

  const handleApplyFlashSale = (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = parseFloat(salePrice);
    const hoursNum = parseFloat(durationHours);
    if (isNaN(priceNum) || priceNum <= 0) return;

    const expiry = Date.now() + hoursNum * 60 * 60 * 1000;
    setFlashSale(selectedBookId, priceNum, expiry);

    setSuccessMsg(`Flash sale set for "${targetBook.title}" at $${priceNum.toFixed(2)} for ${hoursNum} hours!`);
    setTimeout(() => setSuccessMsg(''), 2500);
  };

  const handleRemoveFlashSale = (bookId: string) => {
    setFlashSale(bookId, null, null);
  };

  const handleToggleBookOfDay = (bookId: string, current: boolean) => {
    setBookOfDay(bookId, !current);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        id="manage-flash-sale-modal-container"
        className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl border border-stone-200 text-stone-900"
      >
        <div className="flex items-center justify-between border-b border-stone-200 pb-4">
          <div>
            <h3 className="font-serif font-bold text-xl text-stone-900">
              Flash Deals & Book of the Day Control
            </h3>
            <p className="text-xs text-stone-500">
              Configure promotional timers and homepage spotlight features
            </p>
          </div>

          <button onClick={onClose} className="p-2 rounded-full hover:bg-stone-100 text-stone-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Set Flash Sale Form */}
        <form onSubmit={handleApplyFlashSale} className="bg-stone-50 p-5 rounded-2xl border border-stone-200 space-y-4">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-rose-600" />
            <h4 className="font-bold text-sm text-stone-800">Launch New Flash Deal</h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] font-bold text-stone-600 block mb-1">Select Book</label>
              <select
                value={selectedBookId}
                onChange={(e) => setSelectedBookId(e.target.value)}
                className="w-full p-2 text-xs bg-white border border-stone-300 rounded-xl font-medium"
              >
                {books.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.title} (Retail: ${b.price.toFixed(2)})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-stone-600 block mb-1">Flash Price ($ USD)</label>
              <input
                type="number"
                step="0.01"
                placeholder="e.g. 12.99"
                value={salePrice}
                onChange={(e) => setSalePrice(e.target.value)}
                className="w-full p-2 text-xs bg-white border border-stone-300 rounded-xl font-bold"
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-stone-600 block mb-1">Duration (Hours)</label>
              <select
                value={durationHours}
                onChange={(e) => setDurationHours(e.target.value)}
                className="w-full p-2 text-xs bg-white border border-stone-300 rounded-xl font-medium"
              >
                <option value="12">12 Hours</option>
                <option value="24">24 Hours</option>
                <option value="48">48 Hours</option>
                <option value="72">72 Hours</option>
              </select>
            </div>
          </div>

          {successMsg && (
            <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition"
            >
              Activate Flash Deal
            </button>
          </div>
        </form>

        {/* Current Catalogue Flash & Spotlight Status */}
        <div className="space-y-3">
          <h4 className="font-serif font-bold text-base text-stone-900">
            Book Promotions & Spotlight
          </h4>

          <div className="divide-y divide-stone-100 border border-stone-200 rounded-2xl overflow-hidden">
            {books.map((b) => {
              const isFlashActive =
                b.flashSalePrice != null &&
                b.flashSaleExpiry != null &&
                b.flashSaleExpiry > Date.now();

              return (
                <div key={b.id} className="p-3.5 bg-white flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={b.imageUrl}
                      alt={b.title}
                      className="w-10 h-14 object-cover rounded-lg shadow-sm"
                    />
                    <div>
                      <h5 className="font-bold text-xs sm:text-sm text-stone-900">{b.title}</h5>
                      <p className="text-[11px] text-stone-500">
                        Retail: ${b.price.toFixed(2)}
                        {isFlashActive && (
                          <span className="ml-2 font-bold text-rose-600">
                            Flash: ${b.flashSalePrice?.toFixed(2)}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Book of Day Toggle */}
                    <button
                      onClick={() => handleToggleBookOfDay(b.id, !!b.isBookOfDay)}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                        b.isBookOfDay
                          ? 'bg-amber-400 text-stone-950 shadow-sm'
                          : 'bg-stone-100 hover:bg-stone-200 text-stone-600'
                      }`}
                      title="Set as Book of the Day"
                    >
                      <Crown className="w-3.5 h-3.5" />
                      <span>{b.isBookOfDay ? 'Book of Day' : 'Set Spotlight'}</span>
                    </button>

                    {/* Remove Flash Sale if active */}
                    {isFlashActive && (
                      <button
                        onClick={() => handleRemoveFlashSale(b.id)}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-100 text-rose-800 hover:bg-rose-200"
                      >
                        End Flash Sale
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
