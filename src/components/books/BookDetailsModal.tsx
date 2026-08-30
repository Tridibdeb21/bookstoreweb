import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  X,
  Star,
  ShoppingBag,
  Heart,
  BookMarked,
  Volume2,
  VolumeX,
  Eye,
  Repeat,
  Sparkles,
  Send,
  MessageSquare,
  Lock,
  CheckCircle2,
  Share2
} from 'lucide-react';

export const BookDetailsModal: React.FC = () => {
  const {
    selectedBook,
    setSelectedBook,
    setPreviewBook,
    addToCart,
    addToShelf,
    toggleWishlist,
    isInWishlist,
    reviews,
    addReview,
    summarizeBookReviews,
    usedListings,
    setIsSellUsedOpen
  } = useStore();

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);

  // Review Form state
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');

  // Bookshelf note state
  const [showShelfModal, setShowShelfModal] = useState(false);
  const [shelfStatus, setShelfStatus] = useState<'To Read' | 'Reading' | 'Finished'>('To Read');
  const [capsuleNote, setCapsuleNote] = useState('');
  const [shelfSuccess, setShelfSuccess] = useState(false);

  if (!selectedBook) return null;

  const bookReviews = reviews.filter((r) => r.bookId === selectedBook.id);
  const bookUsedListings = usedListings.filter(
    (l) => l.bookId === selectedBook.id && l.status === 'active'
  );
  const isWishlisted = isInWishlist(selectedBook.id);

  const hasFlashSale =
    selectedBook.flashSalePrice != null &&
    selectedBook.flashSaleExpiry != null &&
    selectedBook.flashSaleExpiry > Date.now();

  const currentPrice = hasFlashSale ? selectedBook.flashSalePrice! : selectedBook.price;

  // Text to Speech
  const toggleTTS = () => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in this browser.');
      return;
    }
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      const textToRead = `${selectedBook.title} by ${selectedBook.author}. ${selectedBook.description}`;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.rate = 1.0;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  const handleSummarize = async () => {
    setIsSummarizing(true);
    try {
      const comments = bookReviews.map((r) => r.comment);
      const summary = await summarizeBookReviews(selectedBook.title, comments);
      setAiSummary(summary);
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    addReview(selectedBook.id, newRating, newComment);
    setNewComment('');
  };

  const handleSaveToShelf = () => {
    addToShelf(selectedBook, shelfStatus, capsuleNote);
    setShelfSuccess(true);
    setTimeout(() => {
      setShelfSuccess(false);
      setShowShelfModal(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div
        id="book-details-modal-container"
        className="relative bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-stone-200"
      >
        {/* Close Button */}
        <button
          id="close-book-details-btn"
          onClick={() => {
            if (isSpeaking) {
              window.speechSynthesis.cancel();
              setIsSpeaking(false);
            }
            setSelectedBook(null);
          }}
          className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 transition cursor-pointer shadow-sm"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8 space-y-8">
          {/* Header Grid: Cover + Info */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Book Cover Column */}
            <div className="md:col-span-4 flex flex-col items-center">
              <div className="relative w-full max-w-[240px] aspect-[3/4] rounded-2xl overflow-hidden shadow-xl border border-stone-200">
                <img
                  src={selectedBook.imageUrl}
                  alt={selectedBook.title}
                  className="w-full h-full object-cover"
                />
                {hasFlashSale && (
                  <div className="absolute top-3 left-3 bg-rose-600 text-white font-black text-xs px-2.5 py-1 rounded-md shadow-md">
                    FLASH SALE
                  </div>
                )}
              </div>

              {/* Action previews */}
              <div className="flex flex-col w-full max-w-[240px] gap-2.5 mt-4">
                <button
                  id="preview-pages-btn"
                  onClick={() => setPreviewBook(selectedBook)}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs transition border border-stone-300 cursor-pointer"
                >
                  <Eye className="w-4 h-4 text-amber-600" />
                  <span>Preview Sample Pages</span>
                </button>

                <button
                  id="tts-audio-reader-btn"
                  onClick={toggleTTS}
                  className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-xl font-bold text-xs transition border cursor-pointer ${
                    isSpeaking
                      ? 'bg-rose-50 border-rose-300 text-rose-700 animate-pulse'
                      : 'bg-stone-100 hover:bg-stone-200 border-stone-300 text-stone-800'
                  }`}
                >
                  {isSpeaking ? (
                    <>
                      <VolumeX className="w-4 h-4" />
                      <span>Stop Audio Reading</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-4 h-4 text-emerald-600" />
                      <span>Listen to Audio Snippet</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Details Column */}
            <div className="md:col-span-8 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 uppercase tracking-wider">
                  {selectedBook.category}
                </span>
                {selectedBook.isBestSeller && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-stone-900 text-amber-300">
                    Bestseller
                  </span>
                )}
                <span className="text-xs font-semibold text-stone-500">
                  Stock: {selectedBook.stockCount} copies available
                </span>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 leading-tight">
                {selectedBook.title}
              </h2>

              <p className="text-sm font-semibold text-stone-600">
                Author: <span className="text-amber-700 font-bold">{selectedBook.author}</span>
              </p>

              {/* Rating */}
              <div className="flex items-center gap-2 text-sm">
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(selectedBook.rating) ? 'fill-current' : 'text-stone-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="font-bold text-stone-800">{selectedBook.rating.toFixed(1)}</span>
                <span className="text-stone-400">({selectedBook.reviewsCount} customer reviews)</span>
              </div>

              {/* Pricing Box */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block">
                    Price
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-stone-900">
                      ${currentPrice.toFixed(2)}
                    </span>
                    {hasFlashSale && (
                      <span className="text-sm text-stone-400 line-through font-semibold">
                        ${selectedBook.price.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    id="details-wishlist-toggle"
                    onClick={() => toggleWishlist(selectedBook.id)}
                    className={`p-3 rounded-xl border transition cursor-pointer ${
                      isWishlisted
                        ? 'bg-rose-50 border-rose-300 text-rose-600'
                        : 'bg-white border-stone-300 text-stone-700 hover:bg-stone-100'
                    }`}
                    title="Wishlist"
                  >
                    <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  id="details-add-to-cart-btn"
                  onClick={() => addToCart(selectedBook, 1)}
                  className="flex-1 min-w-[160px] flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>

                <button
                  id="details-save-shelf-btn"
                  onClick={() => setShowShelfModal(true)}
                  className="flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-sm transition cursor-pointer"
                >
                  <BookMarked className="w-4 h-4 text-purple-400" />
                  <span>Save to Bookshelf</span>
                </button>

                <button
                  id="details-sell-used-btn"
                  onClick={() => {
                    setIsSellUsedOpen(true);
                  }}
                  className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-sm border border-stone-300 transition cursor-pointer"
                  title="Sell your copy"
                >
                  <Repeat className="w-4 h-4 text-amber-600" />
                  <span>Sell Copy</span>
                </button>
              </div>

              {/* Synopsis */}
              <div className="pt-3">
                <h4 className="font-serif font-bold text-stone-900 text-base mb-1.5">
                  About This Book
                </h4>
                <p className="text-stone-600 text-sm leading-relaxed whitespace-pre-line">
                  {selectedBook.description}
                </p>
              </div>
            </div>
          </div>

          {/* Used copies for this book if any */}
          {bookUsedListings.length > 0 && (
            <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Repeat className="w-4 h-4 text-amber-700" />
                <h4 className="font-serif font-bold text-stone-900 text-sm">
                  Pre-Owned Copies Available from Community ({bookUsedListings.length})
                </h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {bookUsedListings.map((listing) => (
                  <div
                    key={listing.id}
                    className="bg-white p-3.5 rounded-xl border border-amber-200/60 shadow-sm flex items-center justify-between"
                  >
                    <div>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-800 mr-2">
                        {listing.condition}
                      </span>
                      <span className="text-sm font-black text-amber-700">
                        ${listing.askingPrice.toFixed(2)}
                      </span>
                      <p className="text-xs text-stone-500 mt-1">
                        Seller: {listing.sellerEmail}
                      </p>
                    </div>
                    <button
                      onClick={() => alert(`Pre-owned copy purchase started for seller: ${listing.sellerEmail}`)}
                      className="px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-amber-500 text-white hover:text-stone-950 text-xs font-bold transition"
                    >
                      Buy Used
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reviews & AI Review Summary Section */}
          <div className="pt-6 border-t border-stone-200 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif font-bold text-xl text-stone-900">
                  Reader Reviews & Discussion
                </h3>
                <p className="text-xs text-stone-500">
                  Read genuine thoughts or generate an instantaneous AI synthesis.
                </p>
              </div>

              {/* Gemini AI Review Summarizer */}
              <button
                id="ai-summarize-reviews-btn"
                onClick={handleSummarize}
                disabled={isSummarizing}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-bold text-xs shadow-md hover:from-amber-400 hover:to-amber-500 transition cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4 text-stone-950 animate-spin" />
                <span>{isSummarizing ? 'Analyzing Reviews...' : 'AI Review Summary'}</span>
              </button>
            </div>

            {/* AI Summary Card */}
            {aiSummary && (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-stone-800 text-sm leading-relaxed relative">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-800 uppercase tracking-wider mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Gemini AI Reader Consensus</span>
                </div>
                <p className="italic">{aiSummary}</p>
              </div>
            )}

            {/* Write a Review Form */}
            <form
              onSubmit={handleReviewSubmit}
              className="bg-stone-50 p-5 rounded-2xl border border-stone-200 space-y-3"
            >
              <h4 className="font-bold text-sm text-stone-800">Leave Your Review</h4>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-stone-600">Your Rating:</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewRating(star)}
                      className="p-1 text-amber-500 hover:scale-110 transition cursor-pointer"
                    >
                      <Star
                        className={`w-5 h-5 ${star <= newRating ? 'fill-current' : 'text-stone-300'}`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write your review, what you loved or criticisms..."
                rows={3}
                className="w-full p-3 rounded-xl border border-stone-300 text-sm bg-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                required
              />

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs transition cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Post Review</span>
                </button>
              </div>
            </form>

            {/* Reviews List */}
            <div className="space-y-4">
              {bookReviews.length === 0 ? (
                <p className="text-sm text-stone-500 italic text-center py-4">
                  No reviews yet. Be the first reader to share your thoughts!
                </p>
              ) : (
                bookReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-stone-900">{rev.userName}</span>
                      <span className="text-[11px] text-stone-400">
                        {new Date(rev.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < rev.rating ? 'fill-current' : 'text-stone-200'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-stone-700 text-xs sm:text-sm leading-relaxed">
                      {rev.comment}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Save to Bookshelf Modal Dialog */}
      {showShelfModal && (
        <div className="fixed inset-0 z-60 bg-stone-950/80 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 border border-stone-200 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-lg text-stone-900">
                Add to Personal Bookshelf
              </h3>
              <button
                onClick={() => setShowShelfModal(false)}
                className="text-stone-400 hover:text-stone-600"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="text-xs font-bold text-stone-600 block mb-1.5">
                Reading Status
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['To Read', 'Reading', 'Finished'] as const).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setShelfStatus(st)}
                    className={`py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                      shelfStatus === st
                        ? 'bg-amber-500 text-stone-950 border-amber-600'
                        : 'bg-stone-100 text-stone-700 border-stone-200 hover:bg-stone-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-stone-600 flex items-center gap-1 mb-1.5">
                <Lock className="w-3.5 h-3.5 text-amber-600" />
                <span>Encrypted Time Capsule Note (Optional)</span>
              </label>
              <p className="text-[11px] text-stone-500 mb-2">
                This note will be encrypted with AES and only unlocked when you mark the book as "Finished"!
              </p>
              <textarea
                value={capsuleNote}
                onChange={(e) => setCapsuleNote(e.target.value)}
                placeholder="What are your initial expectations, who recommended it, or where were you when starting?"
                rows={3}
                className="w-full p-3 text-xs rounded-xl border border-stone-300 bg-stone-50 focus:bg-white focus:outline-none focus:border-amber-500"
              />
            </div>

            {shelfSuccess ? (
              <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Saved to your personal bookshelf!</span>
              </div>
            ) : (
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowShelfModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveToShelf}
                  className="px-5 py-2 rounded-xl bg-stone-900 text-white font-bold text-xs hover:bg-stone-800 shadow-md"
                >
                  Save to Shelf
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
