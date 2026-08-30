import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Sparkles, Flame, Repeat, BookOpen, Bot } from 'lucide-react';

export const HeroBanner: React.FC = () => {
  const { setIsAiRecommendOpen, setIsAiChatOpen, setActiveView } = useStore();

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-stone-900 via-stone-850 to-stone-950 text-white p-6 sm:p-10 shadow-xl border border-stone-800">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 -mb-12 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-2xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-wider mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI-Powered Curated Bookstore</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-stone-100 leading-tight mb-4">
          Discover Stories That <span className="text-amber-400 italic">Transform</span> Your World
        </h1>

        <p className="text-sm sm:text-base text-stone-300 mb-8 leading-relaxed">
          Explore bestsellers, limited flash promotions, personal library tracking with encrypted notes, and peer-to-peer pre-owned book marketplace.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <button
            id="hero-ai-match-btn"
            onClick={() => setIsAiRecommendOpen(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm shadow-lg shadow-amber-500/25 transition cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Book Matcher</span>
          </button>

          <button
            id="hero-ai-chat-btn"
            onClick={() => setIsAiChatOpen(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-100 font-semibold text-sm border border-stone-700 transition cursor-pointer"
          >
            <Bot className="w-4 h-4 text-emerald-400" />
            <span>Talk to AI Assistant</span>
          </button>

          <button
            id="hero-marketplace-btn"
            onClick={() => setActiveView('marketplace')}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-stone-800/80 hover:bg-stone-700 text-stone-300 hover:text-white font-medium text-sm border border-stone-700/80 transition cursor-pointer"
          >
            <Repeat className="w-4 h-4 text-amber-400" />
            <span>Used Books</span>
          </button>
        </div>
      </div>
    </div>
  );
};
