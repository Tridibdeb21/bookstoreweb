import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  ShieldCheck,
  BookOpen,
  PackageCheck,
  Zap,
  Tag,
  RotateCcw,
  TrendingUp,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { ManageBooksModal } from './ManageBooksModal';
import { ManageOrdersModal } from './ManageOrdersModal';
import { ManageCouponsModal } from './ManageCouponsModal';
import { ManageReturnsModal } from './ManageReturnsModal';
import { ManageFlashSaleModal } from './ManageFlashSaleModal';
import { AdminSalesAnalyticsModal } from './AdminSalesAnalyticsModal';
import { ManageCategoriesModal } from './ManageCategoriesModal';

export const AdminDashboard: React.FC = () => {
  const { books, orders, returnRequests, coupons } = useStore();

  const [openModal, setOpenModal] = useState<
    'books' | 'orders' | 'coupons' | 'returns' | 'flash' | 'analytics' | 'categories' | null
  >(null);

  const pendingOrders = orders.filter((o) => o.status === 'Pending').length;
  const pendingReturns = returnRequests.filter((r) => r.status === 'pending').length;
  const totalRevenue = orders.reduce(
    (sum, o) => (o.status !== 'Cancelled' ? sum + o.totalAmount : sum),
    0
  );

  const ADMIN_CARDS = [
    {
      id: 'books',
      title: 'Inventory & Catalogue',
      desc: 'Add, update stock, prices, and descriptions',
      stat: `${books.length} Active Books`,
      icon: BookOpen,
      color: 'bg-amber-500/15 text-amber-700 border-amber-300'
    },
    {
      id: 'orders',
      title: 'Order Fulfillment',
      desc: 'Process shipments & update customer delivery status',
      stat: `${pendingOrders} Pending Shipments`,
      icon: PackageCheck,
      color: 'bg-emerald-500/15 text-emerald-700 border-emerald-300'
    },
    {
      id: 'flash',
      title: 'Flash Sales & Spotlight',
      desc: 'Set promotional countdown prices & Book of the Day',
      stat: 'Live Promotions',
      icon: Zap,
      color: 'bg-rose-500/15 text-rose-700 border-rose-300'
    },
    {
      id: 'coupons',
      title: 'Promos & Coupons',
      desc: 'Manage discount codes and voucher thresholds',
      stat: `${coupons.filter((c) => c.active).length} Active Codes`,
      icon: Tag,
      color: 'bg-sky-500/15 text-sky-700 border-sky-300'
    },
    {
      id: 'returns',
      title: 'Customer Returns',
      desc: 'Review and approve customer return & refund requests',
      stat: `${pendingReturns} Awaiting Review`,
      icon: RotateCcw,
      color: 'bg-purple-500/15 text-purple-700 border-purple-300'
    },
    {
      id: 'analytics',
      title: 'Sales & Revenue Telemetry',
      desc: 'Total turnover, top selling titles, and transactions',
      stat: `$${totalRevenue.toFixed(2)} Total Revenue`,
      icon: TrendingUp,
      color: 'bg-stone-500/15 text-stone-800 border-stone-300'
    },
    {
      id: 'categories',
      title: 'Genre Taxonomy',
      desc: 'Create and organize book classifications',
      stat: 'Catalogue Categories',
      icon: Layers,
      color: 'bg-amber-600/15 text-amber-800 border-amber-300'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-stone-900 text-white rounded-3xl p-6 sm:p-8 border border-stone-800 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-4 h-4" />
            <span>Administrator Control Suite</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-100">
            BookStore Operations Center
          </h2>
          <p className="text-xs sm:text-sm text-stone-400 mt-1">
            Complete management over inventory, orders, discounts, returns, and sales metrics.
          </p>
        </div>

        {/* Quick KPI pills */}
        <div className="flex flex-wrap gap-2 text-xs">
          <div className="bg-stone-800 px-3 py-2 rounded-xl border border-stone-700">
            <span className="text-stone-400 block text-[10px]">Gross Sales</span>
            <span className="font-bold text-amber-400">${totalRevenue.toFixed(2)}</span>
          </div>
          <div className="bg-stone-800 px-3 py-2 rounded-xl border border-stone-700">
            <span className="text-stone-400 block text-[10px]">Pending Orders</span>
            <span className="font-bold text-emerald-400">{pendingOrders} Orders</span>
          </div>
        </div>
      </div>

      {/* Admin Modules Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {ADMIN_CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              id={`admin-card-${card.id}`}
              onClick={() => setOpenModal(card.id as any)}
              className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${card.color} shadow-sm group-hover:scale-105 transition-transform`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-stone-400 group-hover:text-amber-600 transition-colors" />
                </div>

                <h3 className="font-serif font-bold text-lg text-stone-900 group-hover:text-amber-700 transition-colors">
                  {card.title}
                </h3>
                <p className="text-xs text-stone-500 mt-1 leading-relaxed">{card.desc}</p>
              </div>

              <div className="mt-6 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-stone-800">
                <span>{card.stat}</span>
                <span className="text-amber-600 group-hover:underline">Open &rarr;</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modals */}
      <ManageBooksModal isOpen={openModal === 'books'} onClose={() => setOpenModal(null)} />
      <ManageOrdersModal isOpen={openModal === 'orders'} onClose={() => setOpenModal(null)} />
      <ManageCouponsModal isOpen={openModal === 'coupons'} onClose={() => setOpenModal(null)} />
      <ManageReturnsModal isOpen={openModal === 'returns'} onClose={() => setOpenModal(null)} />
      <ManageFlashSaleModal isOpen={openModal === 'flash'} onClose={() => setOpenModal(null)} />
      <AdminSalesAnalyticsModal
        isOpen={openModal === 'analytics'}
        onClose={() => setOpenModal(null)}
      />
      <ManageCategoriesModal
        isOpen={openModal === 'categories'}
        onClose={() => setOpenModal(null)}
      />
    </div>
  );
};
