import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { X, Tag, Plus, Trash2, CheckCircle2 } from 'lucide-react';

export const ManageCouponsModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose
}) => {
  const { coupons, addCoupon, deleteCoupon, toggleCouponActive } = useStore();

  const [code, setCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState('15');
  const [maxDiscount, setMaxDiscount] = useState('20');
  const [minOrderAmount, setMinOrderAmount] = useState('25');
  const [isFlashSale, setIsFlashSale] = useState(false);

  if (!isOpen) return null;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    addCoupon({
      code: code.trim().toUpperCase(),
      discountPercent: parseFloat(discountPercent) || 10,
      maxDiscount: parseFloat(maxDiscount) || 20,
      minOrderAmount: parseFloat(minOrderAmount) || 0,
      isFlashSale,
      expiryTimestamp: Date.now() + 1000 * 60 * 60 * 24 * 30, // 30 days
      active: true
    });

    setCode('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        id="manage-coupons-modal-container"
        className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl border border-stone-200 text-stone-900"
      >
        <div className="flex items-center justify-between border-b border-stone-200 pb-4">
          <div>
            <h3 className="font-serif font-bold text-xl text-stone-900">
              Discount Coupons & Promo Codes
            </h3>
            <p className="text-xs text-stone-500">
              Create promotional discount codes for checkout
            </p>
          </div>

          <button onClick={onClose} className="p-2 rounded-full hover:bg-stone-100 text-stone-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Add Coupon Form */}
        <form onSubmit={handleAdd} className="bg-stone-50 p-5 rounded-2xl border border-stone-200 space-y-3">
          <h4 className="font-bold text-sm text-stone-800">Create New Promo Code</h4>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <input
              type="text"
              placeholder="Code (e.g. FLASH30)"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className="p-2.5 text-xs bg-white border border-stone-300 rounded-xl uppercase font-bold"
              required
            />
            <input
              type="number"
              placeholder="Discount %"
              value={discountPercent}
              onChange={(e) => setDiscountPercent(e.target.value)}
              className="p-2.5 text-xs bg-white border border-stone-300 rounded-xl font-bold"
              required
            />
            <input
              type="number"
              placeholder="Max Discount ($)"
              value={maxDiscount}
              onChange={(e) => setMaxDiscount(e.target.value)}
              className="p-2.5 text-xs bg-white border border-stone-300 rounded-xl"
              required
            />
            <input
              type="number"
              placeholder="Min Order ($)"
              value={minOrderAmount}
              onChange={(e) => setMinOrderAmount(e.target.value)}
              className="p-2.5 text-xs bg-white border border-stone-300 rounded-xl"
              required
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-stone-700">
              <input
                type="checkbox"
                checked={isFlashSale}
                onChange={(e) => setIsFlashSale(e.target.checked)}
                className="rounded text-amber-500"
              />
              <span>Flash Sale Coupon</span>
            </label>

            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs"
            >
              Add Coupon
            </button>
          </div>
        </form>

        {/* Existing Coupons List */}
        <div className="space-y-3">
          <h4 className="font-serif font-bold text-base text-stone-900">Active Coupons ({coupons.length})</h4>
          <div className="divide-y divide-stone-200 border border-stone-200 rounded-2xl overflow-hidden">
            {coupons.map((c) => (
              <div key={c.id} className="p-3.5 bg-white flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-sm text-amber-700">{c.code}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-stone-100 text-stone-700">
                      {c.discountPercent}% OFF (Max ${c.maxDiscount})
                    </span>
                    {c.minOrderAmount > 0 && (
                      <span className="text-[11px] text-stone-400">Min Order: ${c.minOrderAmount}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleCouponActive(c.id)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                      c.active
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-stone-200 text-stone-600'
                    }`}
                  >
                    {c.active ? 'Active' : 'Disabled'}
                  </button>

                  <button
                    onClick={() => deleteCoupon(c.id)}
                    className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
