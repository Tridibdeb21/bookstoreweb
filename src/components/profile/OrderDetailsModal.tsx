import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  X,
  PackageCheck,
  Truck,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Clock,
  XCircle,
  Send
} from 'lucide-react';

export const OrderDetailsModal: React.FC = () => {
  const {
    selectedOrderForDetails,
    setSelectedOrderForDetails,
    updateOrderStatus,
    submitReturnRequest,
    returnRequests
  } = useStore();

  const [returnBookId, setReturnBookId] = useState<string>('');
  const [returnReason, setReturnReason] = useState<string>('');
  const [returnSuccess, setReturnSuccess] = useState(false);
  const [showReturnForm, setShowReturnForm] = useState(false);

  if (!selectedOrderForDetails) return null;

  const existingReturns = returnRequests.filter(
    (r) => r.orderId === selectedOrderForDetails.id
  );

  const handleReturnSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!returnBookId || !returnReason.trim()) return;

    const targetItem = selectedOrderForDetails.items.find(
      (i) => i.bookId === returnBookId
    );
    if (!targetItem) return;

    submitReturnRequest(
      selectedOrderForDetails.id,
      targetItem.bookId,
      targetItem.bookTitle,
      returnReason
    );

    setReturnSuccess(true);
    setTimeout(() => {
      setReturnSuccess(false);
      setShowReturnForm(false);
      setReturnReason('');
    }, 1500);
  };

  const handleCancelOrder = () => {
    if (confirm('Are you sure you want to cancel this order?')) {
      updateOrderStatus(selectedOrderForDetails.id, 'Cancelled');
      setSelectedOrderForDetails({ ...selectedOrderForDetails, status: 'Cancelled' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        id="order-details-modal-container"
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl border border-stone-200 text-stone-900"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-black text-lg text-stone-900">
                {selectedOrderForDetails.id}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900">
                {selectedOrderForDetails.status}
              </span>
            </div>
            <p className="text-xs text-stone-500">
              Placed on {new Date(selectedOrderForDetails.date).toLocaleString()}
            </p>
          </div>

          <button
            onClick={() => setSelectedOrderForDetails(null)}
            className="p-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Order Status Progress Stepper */}
        <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200">
          <div className="grid grid-cols-4 gap-2 text-center">
            {['Pending', 'Processing', 'Shipped', 'Delivered'].map((step, idx) => {
              const currentIdx = ['Pending', 'Processing', 'Shipped', 'Delivered'].indexOf(
                selectedOrderForDetails.status
              );
              const isPast = currentIdx >= idx;
              const isCurrent = currentIdx === idx;

              return (
                <div key={step} className="flex flex-col items-center">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mb-1 ${
                      isPast
                        ? 'bg-amber-500 text-stone-950 font-black shadow-sm'
                        : 'bg-stone-200 text-stone-500'
                    }`}
                  >
                    {idx + 1}
                  </div>
                  <span
                    className={`text-[10px] font-bold ${
                      isCurrent
                        ? 'text-amber-800'
                        : isPast
                        ? 'text-stone-800'
                        : 'text-stone-400'
                    }`}
                  >
                    {step}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Line Items */}
        <div>
          <h4 className="font-serif font-bold text-base text-stone-900 mb-3">
            Ordered Items ({selectedOrderForDetails.items.length})
          </h4>
          <div className="space-y-3">
            {selectedOrderForDetails.items.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3.5 bg-stone-50 rounded-xl border border-stone-200/80"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={item.imageUrl}
                    alt={item.bookTitle}
                    className="w-12 h-16 object-cover rounded-lg shadow-sm"
                  />
                  <div>
                    <h5 className="font-bold text-xs sm:text-sm text-stone-900 line-clamp-1">
                      {item.bookTitle}
                    </h5>
                    <p className="text-[11px] text-stone-500">Qty: {item.quantity}</p>
                  </div>
                </div>

                <div className="font-black text-xs sm:text-sm text-stone-900">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery & Payment Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
            <span className="font-bold text-stone-500 uppercase tracking-wider block text-[10px]">
              Shipping Address
            </span>
            <p className="font-semibold text-stone-900">{selectedOrderForDetails.shippingAddress.fullName}</p>
            <p className="text-stone-600">{selectedOrderForDetails.shippingAddress.street}</p>
            <p className="text-stone-600">
              {selectedOrderForDetails.shippingAddress.city}, {selectedOrderForDetails.shippingAddress.state} {selectedOrderForDetails.shippingAddress.zipCode}
            </p>
          </div>

          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
            <span className="font-bold text-stone-500 uppercase tracking-wider block text-[10px]">
              Payment & Total
            </span>
            <p className="text-stone-600">Method: {selectedOrderForDetails.paymentMethod}</p>
            <p className="text-sm font-black text-amber-700 pt-1">
              Grand Total: ${selectedOrderForDetails.totalAmount.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Return Requests Status if any */}
        {existingReturns.length > 0 && (
          <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 space-y-2">
            <h5 className="font-bold text-xs text-amber-900 flex items-center gap-1.5">
              <RotateCcw className="w-4 h-4 text-amber-700" />
              <span>Return Requests for this Order</span>
            </h5>
            {existingReturns.map((ret) => (
              <div key={ret.id} className="text-xs text-stone-700 bg-white p-2.5 rounded-lg border border-amber-200">
                <div className="flex justify-between font-bold">
                  <span>{ret.bookTitle}</span>
                  <span className="uppercase text-[10px] text-amber-800 font-bold">{ret.status}</span>
                </div>
                <p className="text-[11px] text-stone-500 mt-1">Reason: "{ret.reason}"</p>
              </div>
            ))}
          </div>
        )}

        {/* Actions Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-stone-100">
          {selectedOrderForDetails.status === 'Pending' && (
            <button
              onClick={handleCancelOrder}
              className="px-4 py-2 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition"
            >
              Cancel Order
            </button>
          )}

          {selectedOrderForDetails.status === 'Delivered' && (
            <button
              onClick={() => {
                setShowReturnForm(!showReturnForm);
                setReturnBookId(selectedOrderForDetails.items[0]?.bookId || '');
              }}
              className="px-4 py-2 rounded-xl text-xs font-bold text-stone-800 bg-stone-100 hover:bg-stone-200 border border-stone-300 transition flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{showReturnForm ? 'Close Return Form' : 'Request Return / Exchange'}</span>
            </button>
          )}

          <button
            onClick={() => setSelectedOrderForDetails(null)}
            className="px-5 py-2 rounded-xl bg-stone-900 text-white text-xs font-bold hover:bg-stone-800 ml-auto"
          >
            Done
          </button>
        </div>

        {/* Return Request Form */}
        {showReturnForm && (
          <form onSubmit={handleReturnSubmit} className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
            <h5 className="font-bold text-xs text-stone-800">Submit Return Request</h5>
            <div>
              <label className="text-[11px] font-bold text-stone-600 block mb-1">Select Item</label>
              <select
                value={returnBookId}
                onChange={(e) => setReturnBookId(e.target.value)}
                className="w-full p-2 text-xs bg-white border border-stone-300 rounded-lg"
              >
                {selectedOrderForDetails.items.map((i) => (
                  <option key={i.bookId} value={i.bookId}>
                    {i.bookTitle}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-stone-600 block mb-1">Reason for Return</label>
              <textarea
                value={returnReason}
                onChange={(e) => setReturnReason(e.target.value)}
                placeholder="e.g. Received incorrect edition, binding damage, or duplicate purchase..."
                rows={2}
                className="w-full p-2.5 text-xs bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            {returnSuccess ? (
              <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Return request submitted! Our admin team will review shortly.</span>
              </div>
            ) : (
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs hover:bg-amber-400"
                >
                  Submit Request
                </button>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
};
