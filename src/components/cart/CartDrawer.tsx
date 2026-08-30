import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  Tag,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    updateCartQuantity,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    cartSubtotal,
    cartDiscount,
    cartTotal,
    setIsCheckoutOpen,
    coupons
  } = useStore();

  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [couponMsg, setCouponMsg] = useState<{ text: string; isError: boolean } | null>(null);

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCodeInput.trim()) return;
    const res = applyCoupon(couponCodeInput);
    setCouponMsg({ text: res.message, isError: !res.success });
    if (res.success) {
      setCouponCodeInput('');
    }
  };

  const handleProceedCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-950/60 backdrop-blur-sm flex justify-end">
      <div
        id="cart-drawer-container"
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-stone-200"
      >
        {/* Cart Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-amber-600" />
            <h3 className="font-serif font-bold text-lg text-stone-900">
              Shopping Cart ({cart.reduce((s, i) => s + i.quantity, 0)})
            </h3>
          </div>
          <button
            id="close-cart-btn"
            onClick={() => setIsCartOpen(false)}
            className="p-2 rounded-full hover:bg-stone-200 text-stone-600 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-stone-500 py-12">
              <ShoppingBag className="w-16 h-16 text-stone-300 mb-3" />
              <p className="font-serif font-bold text-lg text-stone-800">Your Cart is Empty</p>
              <p className="text-xs text-stone-500 max-w-xs mt-1">
                Explore our curated catalog to add your next favorite reads!
              </p>
            </div>
          ) : (
            cart.map((item) => {
              const itemPrice =
                item.book.flashSalePrice &&
                item.book.flashSaleExpiry &&
                item.book.flashSaleExpiry > Date.now()
                  ? item.book.flashSalePrice
                  : item.book.price;

              return (
                <div
                  key={item.book.id}
                  id={`cart-item-${item.book.id}`}
                  className="flex gap-4 p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 items-center justify-between"
                >
                  <img
                    src={item.book.imageUrl}
                    alt={item.book.title}
                    className="w-14 h-18 object-cover rounded-xl shadow-sm shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif font-bold text-xs sm:text-sm text-stone-900 line-clamp-1">
                      {item.book.title}
                    </h4>
                    <p className="text-[11px] text-stone-500 line-clamp-1 mb-1">
                      {item.book.author}
                    </p>
                    <div className="text-xs font-black text-amber-700">
                      ${itemPrice.toFixed(2)}
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex flex-col items-end gap-2">
                    <button
                      onClick={() => removeFromCart(item.book.id)}
                      className="text-stone-400 hover:text-rose-600 transition"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-lg border border-stone-300">
                      <button
                        onClick={() => updateCartQuantity(item.book.id, item.quantity - 1)}
                        className="text-stone-600 hover:text-stone-900"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateCartQuantity(item.book.id, item.quantity + 1)}
                        className="text-stone-600 hover:text-stone-900"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer: Coupon Code & Subtotal Breakdown */}
        {cart.length > 0 && (
          <div className="p-6 border-t border-stone-200 bg-stone-50 space-y-4">
            {/* Coupon Code Input */}
            <form onSubmit={handleApplyCoupon} className="space-y-2">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={couponCodeInput}
                    onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                    placeholder="Coupon code (e.g. WELCOME20)"
                    className="w-full pl-9 pr-3 py-2 text-xs uppercase bg-white border border-stone-300 rounded-xl focus:outline-none focus:border-amber-500 font-bold"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-stone-900 text-white font-bold text-xs rounded-xl hover:bg-stone-800 transition"
                >
                  Apply
                </button>
              </div>

              {couponMsg && (
                <p
                  className={`text-[11px] font-semibold ${
                    couponMsg.isError ? 'text-rose-600' : 'text-emerald-700'
                  }`}
                >
                  {couponMsg.text}
                </p>
              )}

              {appliedCoupon && (
                <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
                  <span className="font-bold">Applied: {appliedCoupon.code}</span>
                  <button
                    type="button"
                    onClick={removeCoupon}
                    className="text-xs text-rose-600 font-bold hover:underline"
                  >
                    Remove
                  </button>
                </div>
              )}
            </form>

            {/* Price Calculations */}
            <div className="space-y-1.5 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-stone-900">${cartSubtotal.toFixed(2)}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Discount ({appliedCoupon.discountPercent}%)</span>
                  <span>-${cartDiscount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-black text-stone-900 pt-2 border-t border-stone-200">
                <span>Total</span>
                <span className="text-amber-700 text-base">${cartTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout Action */}
            <button
              id="proceed-checkout-btn"
              onClick={handleProceedCheckout}
              className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-sm shadow-lg shadow-amber-500/20 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
