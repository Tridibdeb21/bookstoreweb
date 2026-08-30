import React from 'react';
import { useStore } from '../../context/StoreContext';
import {
  Home,
  BookMarked,
  Repeat,
  PackageCheck,
  User,
  ShieldCheck
} from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeView, setActiveView, user, shelf } = useStore();

  const navItems = [
    { id: 'home', label: 'Store', icon: Home },
    {
      id: 'shelf',
      label: 'Bookshelf',
      icon: BookMarked,
      badge: shelf.length > 0 ? shelf.length : undefined
    },
    { id: 'marketplace', label: 'Used Books', icon: Repeat },
    { id: 'orders', label: 'Orders', icon: PackageCheck },
    { id: 'profile', label: 'Profile', icon: User },
    ...(user.role === 'admin'
      ? [{ id: 'admin', label: 'Admin', icon: ShieldCheck }]
      : [])
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-stone-900/95 backdrop-blur-md border-t border-stone-800 px-2 py-2 sm:hidden shadow-lg">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              id={`bottom-nav-${item.id}`}
              onClick={() => setActiveView(item.id as any)}
              className={`flex flex-col items-center justify-center w-14 py-1 rounded-xl transition cursor-pointer relative ${
                isActive
                  ? 'text-amber-400 font-bold'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''} transition-transform`} />
              <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
              {item.badge !== undefined && (
                <span className="absolute top-0 right-2.5 bg-amber-500 text-stone-950 text-[9px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
