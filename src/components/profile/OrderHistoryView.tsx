import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Order, OrderStatus } from '../../types';
import { PackageCheck, ChevronRight, Clock, Truck, CheckCircle2, XCircle } from 'lucide-react';

const STATUS_ICONS: Record<OrderStatus, React.FC<{ className?: string }>> = {
  Pending: Clock,
  Processing: Clock,
  Shipped: Truck,
  Delivered: CheckCircle2,
  Cancelled: XCircle
};

const STATUS_COLORS: Record<OrderStatus, string> = {
  Pending: 'bg-amber-100 text-amber-900 border-amber-300',
  Processing: 'bg-sky-100 text-sky-900 border-sky-300',
  Shipped: 'bg-purple-100 text-purple-900 border-purple-300',
  Delivered: 'bg-emerald-100 text-emerald-900 border-emerald-300',
  Cancelled: 'bg-rose-100 text-rose-900 border-rose-300'
};

export const OrderHistoryView: React.FC = () => {
  const { orders, setSelectedOrderForDetails, setActiveView } = useStore();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
              Your Orders & Shipments
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
              {orders.length} Orders
            </span>
          </div>
          <p className="text-xs sm:text-sm text-stone-600">
            Track fulfillment, review shipping status, and request returns
          </p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200">
          <PackageCheck className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <h3 className="font-serif font-bold text-lg text-stone-800">No Orders Placed Yet</h3>
          <p className="text-sm text-stone-500 max-w-sm mx-auto mt-1 mb-6">
            When you purchase books from our store, their tracking details will appear here.
          </p>
          <button
            onClick={() => setActiveView('home')}
            className="px-6 py-2.5 rounded-xl bg-stone-900 text-white font-bold text-xs hover:bg-stone-800 transition"
          >
            Explore Store
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const StatusIcon = STATUS_ICONS[order.status] || Clock;
            const statusColor = STATUS_COLORS[order.status] || 'bg-stone-100 text-stone-800';

            return (
              <div
                key={order.id}
                id={`order-row-${order.id}`}
                onClick={() => setSelectedOrderForDetails(order)}
                className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm hover:shadow-md transition cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono font-bold text-sm text-stone-900">
                      {order.id}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold border ${statusColor}`}
                    >
                      <StatusIcon className="w-3 h-3" />
                      <span>{order.status}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Item thumbnail previews */}
                    <div className="flex -space-x-2">
                      {order.items.slice(0, 3).map((it, idx) => (
                        <img
                          key={idx}
                          src={it.imageUrl}
                          alt={it.bookTitle}
                          className="w-10 h-14 object-cover rounded-lg border-2 border-white shadow-sm"
                        />
                      ))}
                      {order.items.length > 3 && (
                        <div className="w-10 h-14 rounded-lg bg-stone-800 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">
                          +{order.items.length - 3}
                        </div>
                      )}
                    </div>

                    <div className="text-xs text-stone-600">
                      <p className="font-semibold text-stone-800">
                        {order.items.map((i) => i.bookTitle).join(', ').slice(0, 60)}
                        {order.items.map((i) => i.bookTitle).join(', ').length > 60 ? '...' : ''}
                      </p>
                      <p className="text-[11px] text-stone-400">
                        Ordered on {new Date(order.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-stone-100">
                  <div className="text-right">
                    <div className="text-[10px] text-stone-400 uppercase font-bold">Total</div>
                    <div className="text-lg font-black text-amber-700">
                      ${order.totalAmount.toFixed(2)}
                    </div>
                  </div>

                  <button className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition">
                    <span>Details</span>
                    <ChevronRight className="w-4 h-4" />
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
