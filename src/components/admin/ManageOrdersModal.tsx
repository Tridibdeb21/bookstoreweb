import React from 'react';
import { useStore } from '../../context/StoreContext';
import { OrderStatus } from '../../types';
import { X, PackageCheck, Clock, Truck, CheckCircle2, XCircle } from 'lucide-react';

const ALL_STATUSES: OrderStatus[] = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

export const ManageOrdersModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose
}) => {
  const { orders, updateOrderStatus } = useStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        id="manage-orders-modal-container"
        className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl border border-stone-200 text-stone-900"
      >
        <div className="flex items-center justify-between border-b border-stone-200 pb-4">
          <div>
            <h3 className="font-serif font-bold text-xl text-stone-900">
              Customer Orders & Fulfillment Manager
            </h3>
            <p className="text-xs text-stone-500">
              Update shipment statuses and verify customer delivery pipelines
            </p>
          </div>

          <button onClick={onClose} className="p-2 rounded-full hover:bg-stone-100 text-stone-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {orders.length === 0 ? (
            <p className="text-center py-8 text-stone-500 text-sm">No orders recorded in system.</p>
          ) : (
            orders.map((order) => (
              <div
                key={order.id}
                className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="font-mono font-bold text-sm text-stone-900">{order.id}</span>
                    <span className="text-xs text-stone-500 ml-2">Customer: {order.userEmail}</span>
                  </div>
                  <div className="text-xs text-stone-500">
                    Date: {new Date(order.date).toLocaleString()}
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-stone-200">
                  <div className="text-xs text-stone-700">
                    <span className="font-semibold">Items ({order.items.length}): </span>
                    {order.items.map((i) => `${i.bookTitle} (x${i.quantity})`).join(', ')}
                  </div>
                  <div className="font-black text-amber-700 text-sm">
                    ${order.totalAmount.toFixed(2)}
                  </div>
                </div>

                {/* Status Selector Dropdown */}
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <span className="text-xs font-bold text-stone-600">Status:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {ALL_STATUSES.map((st) => (
                      <button
                        key={st}
                        onClick={() => updateOrderStatus(order.id, st)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                          order.status === st
                            ? st === 'Delivered'
                              ? 'bg-emerald-600 text-white shadow-sm'
                              : st === 'Shipped'
                              ? 'bg-purple-600 text-white shadow-sm'
                              : st === 'Processing'
                              ? 'bg-sky-600 text-white shadow-sm'
                              : st === 'Cancelled'
                              ? 'bg-rose-600 text-white shadow-sm'
                              : 'bg-amber-500 text-stone-950 shadow-sm'
                            : 'bg-white text-stone-600 hover:bg-stone-200 border border-stone-300'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
