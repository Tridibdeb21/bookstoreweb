import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ShelfItem, ShelfStatus } from '../../types';
import {
  BookMarked,
  Lock,
  Unlock,
  CheckCircle2,
  BookOpen,
  Clock,
  Trash2,
  Sparkles,
  Trophy
} from 'lucide-react';

export const ShelfView: React.FC = () => {
  const { shelf, updateShelfStatus, removeFromShelf, decryptShelfNote, user, setActiveView, books, setSelectedBook } = useStore();
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [revealedNotes, setRevealedNotes] = useState<Record<string, boolean>>({});

  const filteredShelf = shelf.filter((item) => {
    if (activeFilter === 'all') return true;
    return item.status === activeFilter;
  });

  const toggleRevealNote = (id: string) => {
    setRevealedNotes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toReadCount = shelf.filter((i) => i.status === 'To Read').length;
  const readingCount = shelf.filter((i) => i.status === 'Reading').length;
  const finishedCount = shelf.filter((i) => i.status === 'Finished').length;

  return (
    <div className="space-y-6">
      {/* Bookshelf Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
              Personal Bookshelf & Time Capsules
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
              {shelf.length} Books
            </span>
          </div>
          <p className="text-xs sm:text-sm text-stone-600">
            Track reading progression and unlock AES encrypted reflection notes when you complete each book.
          </p>
        </div>

        {/* Goal Badge Banner */}
        <div className="flex items-center gap-3 bg-stone-900 text-white px-4 py-2.5 rounded-2xl shadow-md">
          <Trophy className="w-5 h-5 text-amber-400 shrink-0" />
          <div>
            <div className="text-[11px] uppercase tracking-wider text-stone-400 font-bold">
              Yearly Goal Progress
            </div>
            <div className="text-xs font-bold text-amber-300">
              {user.booksFinishedThisYear} / {user.yearlyGoal} Books Read ({Math.min(100, Math.round((user.booksFinishedThisYear / user.yearlyGoal) * 100))}%)
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-stone-200 pb-3">
        {[
          { id: 'all', label: `All Books (${shelf.length})` },
          { id: 'To Read', label: `To Read (${toReadCount})`, icon: Clock },
          { id: 'Reading', label: `Currently Reading (${readingCount})`, icon: BookOpen },
          { id: 'Finished', label: `Finished (${finishedCount})`, icon: CheckCircle2 }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeFilter === tab.id
                ? 'bg-amber-500 text-stone-950 shadow-sm scale-105'
                : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Shelf Items Grid */}
      {filteredShelf.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200">
          <BookMarked className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <h3 className="font-serif font-bold text-lg text-stone-800">
            No Books in This Section
          </h3>
          <p className="text-sm text-stone-500 max-w-sm mx-auto mt-1 mb-6">
            Browse our catalogue and save books to your personal shelf with encrypted notes!
          </p>
          <button
            onClick={() => setActiveView('home')}
            className="px-6 py-2.5 rounded-xl bg-stone-900 text-white font-bold text-xs hover:bg-stone-800 transition"
          >
            Explore Books
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredShelf.map((item) => {
            const isNoteRevealed = !!revealedNotes[item.id];
            const isFinished = item.status === 'Finished';
            const decryptedNote = item.noteEncrypted ? decryptShelfNote(item.noteEncrypted) : '';

            return (
              <div
                key={item.id}
                id={`shelf-item-${item.id}`}
                className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  {/* Book summary */}
                  <div className="flex gap-4">
                    <img
                      src={item.coverUrl}
                      alt={item.title}
                      className="w-20 h-28 object-cover rounded-xl shadow-md shrink-0 cursor-pointer"
                      onClick={() => {
                        const original = books.find((b) => b.id === item.bookId);
                        if (original) setSelectedBook(original);
                      }}
                    />

                    <div className="flex-1 min-w-0">
                      <h4
                        onClick={() => {
                          const original = books.find((b) => b.id === item.bookId);
                          if (original) setSelectedBook(original);
                        }}
                        className="font-serif font-bold text-stone-900 hover:text-amber-600 line-clamp-1 cursor-pointer transition-colors text-base"
                      >
                        {item.title}
                      </h4>
                      <p className="text-xs text-stone-500 mb-2">by {item.author}</p>

                      {/* Status Changer */}
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {(['To Read', 'Reading', 'Finished'] as ShelfStatus[]).map((st) => (
                          <button
                            key={st}
                            onClick={() => updateShelfStatus(item.bookId, st)}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition cursor-pointer ${
                              item.status === st
                                ? st === 'Finished'
                                  ? 'bg-emerald-600 text-white border-emerald-700'
                                  : st === 'Reading'
                                  ? 'bg-amber-500 text-stone-950 border-amber-600'
                                  : 'bg-stone-800 text-white border-stone-900'
                                : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Encrypted Time Capsule Note */}
                  {item.noteEncrypted && (
                    <div className="mt-4 p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[11px] font-bold text-stone-700 flex items-center gap-1">
                          {isFinished ? (
                            <Unlock className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Lock className="w-3.5 h-3.5 text-amber-600" />
                          )}
                          <span>
                            {isFinished ? 'Time Capsule Unlocked' : 'Time Capsule (Encrypted)'}
                          </span>
                        </span>

                        <button
                          onClick={() => toggleRevealNote(item.id)}
                          className="text-[10px] font-bold text-amber-700 hover:underline"
                        >
                          {isNoteRevealed ? 'Hide Note' : 'Reveal Note'}
                        </button>
                      </div>

                      {isNoteRevealed ? (
                        <p className="text-xs text-stone-700 italic bg-white p-2.5 rounded-lg border border-stone-200">
                          "{decryptedNote}"
                        </p>
                      ) : (
                        <p className="text-[11px] text-stone-400 font-mono">
                          ••••••••••••••••••••••••••••••••••••••••
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Footer Controls */}
                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                  <span className="text-stone-400 text-[11px]">
                    Added {new Date(item.dateAdded).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => removeFromShelf(item.bookId)}
                    className="flex items-center gap-1 text-stone-400 hover:text-rose-600 font-semibold transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
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
