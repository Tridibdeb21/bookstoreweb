import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { X, Sparkles, Compass, Check, ArrowRight } from 'lucide-react';

const MOODS = ['Inspiring & Uplifting', 'Mind-Bending & Sci-Fi', 'Dark & Mysterious', 'Emotional & Thoughtful', 'Fast-Paced Action'];
const PACING = ['Quick & Crisp', 'Deep & Immersive', 'Relaxed Weekend'];

export const AiRecommendModal: React.FC = () => {
  const { isAiRecommendOpen, setIsAiRecommendOpen, getAiRecommendations, books, setSelectedBook } = useStore();

  const [selectedMood, setSelectedMood] = useState(MOODS[0]);
  const [selectedPacing, setSelectedPacing] = useState(PACING[0]);
  const [customPrompt, setCustomPrompt] = useState('');
  const [results, setResults] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isAiRecommendOpen) return null;

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const combinedPrompt = `${selectedMood}, ${selectedPacing}. ${customPrompt}`;
      const recs = await getAiRecommendations(combinedPrompt);
      setResults(recs);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        id="ai-recommend-modal-container"
        className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-stone-200 text-stone-900"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-700 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-xl text-stone-900">
                AI Book Matcher
              </h3>
              <p className="text-xs text-stone-500">
                Tailored recommendations based on your current reading mood
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setIsAiRecommendOpen(false);
              setResults(null);
            }}
            className="p-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {results ? (
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 text-stone-800 text-sm whitespace-pre-wrap leading-relaxed">
              {results}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setResults(null)}
                className="px-5 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs"
              >
                Try Another Mood
              </button>
              <button
                onClick={() => {
                  setIsAiRecommendOpen(false);
                  setResults(null);
                }}
                className="px-5 py-2.5 rounded-xl bg-stone-900 text-white font-bold text-xs hover:bg-stone-800"
              >
                Close Matcher
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Mood selector */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-stone-500 block mb-2">
                1. What is your reading mood?
              </label>
              <div className="flex flex-wrap gap-2">
                {MOODS.map((mood) => (
                  <button
                    key={mood}
                    type="button"
                    onClick={() => setSelectedMood(mood)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                      selectedMood === mood
                        ? 'bg-amber-500 text-stone-950 border-amber-600 shadow-sm'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {mood}
                  </button>
                ))}
              </div>
            </div>

            {/* Pacing selector */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-stone-500 block mb-2">
                2. Desired Book Pacing
              </label>
              <div className="grid grid-cols-3 gap-2">
                {PACING.map((pace) => (
                  <button
                    key={pace}
                    type="button"
                    onClick={() => setSelectedPacing(pace)}
                    className={`py-2 rounded-xl text-xs font-bold border transition cursor-pointer text-center ${
                      selectedPacing === pace
                        ? 'bg-amber-500 text-stone-950 border-amber-600 shadow-sm'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {pace}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom focus prompt */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-stone-500 block mb-1.5">
                3. Any specific topic or author? (Optional)
              </label>
              <input
                type="text"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="e.g. Space exploration, habit building, life decisions..."
                className="w-full p-3 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:border-amber-500 font-medium"
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-stone-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isLoading ? 'Synthesizing Matches...' : 'Find My Next Favorite Book'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
