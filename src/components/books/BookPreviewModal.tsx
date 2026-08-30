import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { X, ChevronLeft, ChevronRight, BookOpen, ZoomIn, ZoomOut } from 'lucide-react';

export const BookPreviewModal: React.FC = () => {
  const { previewBook, setPreviewBook } = useStore();
  const [currentPage, setCurrentPage] = useState(0);

  if (!previewBook) return null;

  const pages = previewBook.previewImages && previewBook.previewImages.length > 0
    ? previewBook.previewImages
    : [
        previewBook.imageUrl,
        'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&auto=format&fit=crop&q=80'
      ];

  const handlePrev = () => {
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleNext = () => {
    setCurrentPage((prev) => (prev < pages.length - 1 ? prev + 1 : prev));
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
      <div
        id="book-preview-modal-container"
        className="relative bg-stone-900 rounded-3xl max-w-4xl w-full h-[90vh] flex flex-col shadow-2xl border border-stone-800 overflow-hidden text-stone-100"
      >
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800 bg-stone-950/50">
          <div className="flex items-center gap-3">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-serif font-bold text-stone-100 text-sm sm:text-base line-clamp-1">
                {previewBook.title}
              </h3>
              <p className="text-xs text-stone-400">
                Sample Excerpt & Chapter Preview (Page {currentPage + 1} of {pages.length})
              </p>
            </div>
          </div>

          <button
            id="close-preview-btn"
            onClick={() => setPreviewBook(null)}
            className="p-2 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Page Content View */}
        <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-stone-950/80 relative select-none">
          <div className="max-h-full max-w-lg w-full aspect-[3/4] bg-stone-900 rounded-2xl overflow-hidden shadow-2xl border border-stone-800 relative">
            <img
              src={pages[currentPage]}
              alt={`Page ${currentPage + 1}`}
              className="w-full h-full object-cover"
            />
            {/* Sample overlay typography text to emulate authentic book page reading */}
            <div className="absolute inset-0 bg-stone-950/40 p-6 flex flex-col justify-between text-stone-100 backdrop-blur-[0.5px]">
              <div className="text-center font-serif text-xs uppercase tracking-widest text-amber-300 font-bold">
                {previewBook.title} — Chapter {currentPage + 1}
              </div>
              <div className="space-y-3 font-serif text-xs sm:text-sm leading-relaxed text-stone-200 bg-stone-950/60 p-4 rounded-xl backdrop-blur-sm border border-stone-700/50 shadow-lg">
                <p>
                  "The beginning of any journey is marked by the quiet decisions made in solitude.
                  As the pages turned, the weight of the universe seemed to settle gently upon the table..."
                </p>
                <p>
                  "In every book lies a portal to another mind. To read is to inhabit the dreams of strangers
                  who suddenly become our dearest companions."
                </p>
              </div>
              <div className="text-center text-[10px] text-stone-400 font-mono">
                — Excerpt Page {currentPage + 1} —
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Pagination Controls */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-stone-800 bg-stone-950/50">
          <button
            id="preview-prev-page-btn"
            onClick={handlePrev}
            disabled={currentPage === 0}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 disabled:opacity-30 disabled:pointer-events-none text-xs font-bold transition cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="flex items-center gap-2">
            {pages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPage(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  currentPage === idx ? 'w-6 bg-amber-400' : 'bg-stone-700 hover:bg-stone-600'
                }`}
              />
            ))}
          </div>

          <button
            id="preview-next-page-btn"
            onClick={handleNext}
            disabled={currentPage === pages.length - 1}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 disabled:opacity-30 disabled:pointer-events-none text-xs font-bold transition cursor-pointer"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
