import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { X, CheckCircle2, ShieldCheck, CreditCard, Truck, ArrowRight } from 'lucide-react';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    cartTotal,
    appliedCoupon,
    placeOrder,
    setActiveView,
    user
  } = useStore();

  const [fullName, setFullName] = useState('Tridib Deb');
  const [street, setStreet] = useState('742 Evergreen Terrace');
  const [city, setCity] = useState('Springfield');
  const [state, setState] = useState('OR');
  const [zipCode, setZipCode] = useState('97477');
  const [paymentMethod, setPaymentMethod] = useState('Credit Card (•••• 4242)');
  const [placedOrderId, setPlacedOrderId] = useState<string | null>(null);

  if (!isCheckoutOpen) return null;

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const order = placeOrder({ fullName, street, city, state, zipCode }, paymentMethod);
    setPlacedOrderId(order.id);
  };

  const handleFinish = () => {
    setPlacedOrderId(null);
    setIsCheckoutOpen(false);
    setActiveView('orders');
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        id="checkout-modal-container"
        className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-stone-200 text-stone-900"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-700 flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-xl text-stone-900">
                Secure Checkout
              </h3>
              <p className="text-xs text-stone-500">
                Order fulfillment with tracking and easy returns
              </p>
            </div>
          </div>

          {!placedOrderId && (
            <button
              onClick={() => setIsCheckoutOpen(false)}
              className="p-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {placedOrderId ? (
          <div className="p-8 text-center space-y-4 bg-emerald-50 rounded-2xl border border-emerald-200">
            <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto animate-bounce" />
            <h4 className="font-serif font-bold text-2xl text-emerald-950">
              Order Placed Successfully!
            </h4>
            <p className="text-xs sm:text-sm text-emerald-800">
              Your order ID is <span className="font-mono font-bold">{placedOrderId}</span>.
              A confirmation receipt has been sent to <span className="font-semibold">{user.email}</span>.
            </p>

            <div className="pt-4">
              <button
                id="view-placed-order-btn"
                onClick={handleFinish}
                className="px-6 py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs shadow-md transition"
              >
                Track in Order History
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmitOrder} className="space-y-4">
            {/* Shipping Address Inputs */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2 flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-amber-600" />
                <span>Shipping Address</span>
              </h4>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full p-2.5 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:border-amber-500 font-medium"
                  required
                />
                <input
                  type="text"
                  placeholder="Street Address"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full p-2.5 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:border-amber-500 font-medium"
                  required
                />
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="p-2.5 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:bg-white font-medium"
                    required
                  />
                  <input
                    type="text"
                    placeholder="State"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="p-2.5 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:bg-white font-medium"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Zip Code"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    className="p-2.5 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:bg-white font-medium"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                Payment Method
              </h4>
              <div className="grid grid-cols-3 gap-2">
                {[
                  'Credit Card (•••• 4242)',
                  'Google Pay',
                  'Cash on Delivery'
                ].map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPaymentMethod(method)}
                    className={`py-2 px-2 text-[11px] font-bold rounded-xl border transition text-center ${
                      paymentMethod === method
                        ? 'bg-amber-500 text-stone-950 border-amber-600 shadow-sm'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>

            {/* Order Items summary */}
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex justify-between items-center text-xs">
              <span className="text-stone-600">{cart.length} unique titles</span>
              <span className="font-black text-amber-700 text-base">
                Total: ${cartTotal.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsCheckoutOpen(false)}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100"
              >
                Back to Cart
              </button>
              <button
                id="confirm-place-order-btn"
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs shadow-md transition"
              >
                Place Order (${cartTotal.toFixed(2)})
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
