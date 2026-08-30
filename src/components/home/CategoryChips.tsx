import React from 'react';
import { useStore } from '../../context/StoreContext';
import {
  BookOpen,
  Sparkles,
  Rocket,
  Compass,
  Search,
  Brain,
  Landmark,
  Layers
} from 'lucide-react';

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  BookOpen,
  Sparkles,
  Rocket,
  Compass,
  Search,
  Brain,
  Landmark,
  Layers
};

export const CategoryChips: React.FC = () => {
  const { categories, selectedCategory, setSelectedCategory } = useStore();

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none py-1">
      {categories.map((cat) => {
        const IconComponent = cat.iconName && ICON_MAP[cat.iconName] ? ICON_MAP[cat.iconName] : BookOpen;
        const isSelected = selectedCategory === cat.id;

        return (
          <button
            key={cat.id}
            id={`category-chip-${cat.id}`}
            onClick={() => setSelectedCategory(cat.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
              isSelected
                ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20 scale-105'
                : 'bg-stone-200/80 hover:bg-stone-300 text-stone-700 hover:text-stone-900 border border-stone-300/60'
            }`}
          >
            <IconComponent className={`w-3.5 h-3.5 ${isSelected ? 'text-stone-950' : 'text-amber-600'}`} />
            <span>{cat.name}</span>
          </button>
        );
      })}
    </div>
  );
};
