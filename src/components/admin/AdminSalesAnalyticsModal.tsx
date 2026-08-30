import React from 'react';
import { useStore } from '../../context/StoreContext';
import { X, TrendingUp, DollarSign, ShoppingBag, PackageCheck, Users } from 'lucide-react';

export const AdminSalesAnalyticsModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose
}) => {
  const { orders, books, returnRequests } = useStore();

  if (!isOpen) return null;

  const totalRevenue = orders.reduce((sum, o) => o.status !== 'Cancelled' ? sum + o.totalAmount : sum, 0);
  const deliveredOrders = orders.filter((o) => o.status === 'Delivered').length;
  const totalItemsSold = orders.reduce((sum, o) => o.status !== 'Cancelled' ? sum + o.items.reduce((s, i) => s + i.quantity, 0) : sum, 0);

  // Group revenue by book
  const salesByBook: Record<string, { title: string; count: number; revenue: number }> = {};
  orders.forEach((o) => {
    if (o.status !== 'Cancelled') {
      o.items.forEach((it) => {
        if (!salesByBook[it.bookId]) {
          salesByBook[it.bookId] = { title: it.bookTitle, count: 0, revenue: 0 };
        }
        salesByBook[it.bookId].count += it.quantity;
        salesByBook[it.bookId].revenue += it.price * it.quantity;
      });
    }
  });

  const topSellers = Object.values(salesByBook).sort((a, b) => b.revenue - a.revenue);

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        id="sales-analytics-modal-container"
        className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl border border-stone-200 text-stone-900"
      >
        <div className="flex items-center justify-between border-b border-stone-200 pb-4">
          <div>
            <h3 className="font-serif font-bold text-xl text-stone-900">
              Sales, Revenue & Inventory Analytics
            </h3>
            <p className="text-xs text-stone-500">
              Performance telemetry across checkout transactions and customer engagement
            </p>
          </div>

          <button onClick={onClose} className="p-2 rounded-full hover:bg-stone-100 text-stone-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200">
            <span className="text-[11px] font-bold text-amber-800 uppercase">Gross Revenue</span>
            <div className="text-2xl font-black text-amber-950 mt-1">
              ${totalRevenue.toFixed(2)}
            </div>
          </div>

          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
            <span className="text-[11px] font-bold text-emerald-800 uppercase">Delivered Orders</span>
            <div className="text-2xl font-black text-emerald-950 mt-1">
              {deliveredOrders} / {orders.length}
            </div>
          </div>

          <div className="p-4 bg-sky-50 rounded-2xl border border-sky-200">
            <span className="text-[11px] font-bold text-sky-800 uppercase">Copies Sold</span>
            <div className="text-2xl font-black text-sky-950 mt-1">
              {totalItemsSold} Copies
            </div>
          </div>

          <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200">
            <span className="text-[11px] font-bold text-purple-800 uppercase">Active Titles</span>
            <div className="text-2xl font-black text-purple-950 mt-1">
              {books.length} Books
            </div>
          </div>
        </div>

        {/* Top Performing Titles */}
        <div className="space-y-3">
          <h4 className="font-serif font-bold text-base text-stone-900">
            Top Performing Titles by Revenue
          </h4>
          <div className="divide-y divide-stone-100 border border-stone-200 rounded-2xl overflow-hidden">
            {topSellers.length === 0 ? (
              <p className="p-4 text-xs text-stone-500 italic">No sales recorded yet.</p>
            ) : (
              topSellers.map((item, idx) => (
                <div key={idx} className="p-3.5 bg-white flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-6 text-xs font-black text-amber-600">#{idx + 1}</span>
                    <span className="font-bold text-xs sm:text-sm text-stone-900">{item.title}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-stone-900 text-sm">
                      ${item.revenue.toFixed(2)}
                    </span>
                    <span className="text-xs text-stone-400 ml-2">({item.count} units)</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
