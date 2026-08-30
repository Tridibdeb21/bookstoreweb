import React from 'react';
import { useStore } from './context/StoreContext';
import { Navbar } from './components/layout/Navbar';
import { BottomNav } from './components/layout/BottomNav';
import { HeroBanner } from './components/home/HeroBanner';
import { CategoryChips } from './components/home/CategoryChips';
import { FlashSaleSection } from './components/home/FlashSaleSection';
import { BookOfTheDay } from './components/home/BookOfTheDay';
import { BookCard } from './components/home/BookCard';
import { MarketplaceSection } from './components/home/MarketplaceSection';
import { BookDetailsModal } from './components/books/BookDetailsModal';
import { BookPreviewModal } from './components/books/BookPreviewModal';
import { SellUsedBookModal } from './components/books/SellUsedBookModal';
import { AiChatModal } from './components/ai/AiChatModal';
import { AiRecommendModal } from './components/ai/AiRecommendModal';
import { CartDrawer } from './components/cart/CartDrawer';
import { CheckoutModal } from './components/cart/CheckoutModal';
import { ShelfView } from './components/shelf/ShelfView';
import { ProfileView } from './components/profile/ProfileView';
import { WishlistView } from './components/profile/WishlistView';
import { OrderHistoryView } from './components/profile/OrderHistoryView';
import { OrderDetailsModal } from './components/profile/OrderDetailsModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { Sparkles, BookOpen, Bot } from 'lucide-react';

export const App: React.FC = () => {
  const {
    activeView,
    books,
    selectedCategory,
    searchQuery,
    setIsAiChatOpen,
    setIsAiRecommendOpen
  } = useStore();

  // Filter books according to category and search query
  const filteredBooks = books.filter((book) => {
    const matchesCategory =
      selectedCategory === 'all' || book.category.toLowerCase() === selectedCategory.toLowerCase();
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query) ||
      book.category.toLowerCase().includes(query) ||
      book.description.toLowerCase().includes(query);

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-stone-100/60 text-stone-900 flex flex-col selection:bg-amber-500 selection:text-stone-950 pb-20 sm:pb-8">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Container */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1">
        {activeView === 'home' && (
          <div className="space-y-10">
            {/* Hero Presentation */}
            <HeroBanner />

            {/* Book of the Day Spotlight */}
            <BookOfTheDay />

            {/* Limited-time Flash Sales */}
            <FlashSaleSection />

            {/* Catalog Browser Section */}
            <section className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                    Explore Curated Catalogue
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-600">
                    Showing {filteredBooks.length} titles in current selection
                  </p>
                </div>

                {/* Categories */}
                <CategoryChips />
              </div>

              {/* Book Grid */}
              {filteredBooks.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-stone-200">
                  <BookOpen className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                  <h3 className="font-serif font-bold text-lg text-stone-800">
                    No Books Match Your Criteria
                  </h3>
                  <p className="text-sm text-stone-500 max-w-sm mx-auto mt-1">
                    Try searching for another genre, author, or reset your category filters.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredBooks.map((book) => (
                    <BookCard key={book.id} book={book} />
                  ))}
                </div>
              )}
            </section>

            {/* Used Books Community Marketplace */}
            <section className="pt-6 border-t border-stone-200">
              <MarketplaceSection />
            </section>
          </div>
        )}

        {activeView === 'shelf' && <ShelfView />}
        {activeView === 'marketplace' && <MarketplaceSection />}
        {activeView === 'profile' && <ProfileView />}
        {activeView === 'wishlist' && <WishlistView />}
        {activeView === 'orders' && <OrderHistoryView />}
        {activeView === 'admin' && <AdminDashboard />}
      </main>

      {/* Floating AI Literature Assistant Launcher */}
      <button
        id="floating-ai-chat-btn"
        onClick={() => setIsAiChatOpen(true)}
        className="fixed bottom-20 sm:bottom-6 right-6 z-30 flex items-center gap-2.5 px-4 py-3 rounded-full bg-stone-900 hover:bg-stone-800 text-amber-300 font-bold text-xs shadow-2xl border border-stone-700 hover:scale-105 transition-all cursor-pointer group"
      >
        <Bot className="w-5 h-5 text-emerald-400 group-hover:rotate-12 transition-transform" />
        <span className="hidden sm:inline">Ask AI Assistant</span>
      </button>

      {/* Modals & Drawers */}
      <BookDetailsModal />
      <BookPreviewModal />
      <SellUsedBookModal />
      <AiChatModal />
      <AiRecommendModal />
      <CartDrawer />
      <CheckoutModal />
      <OrderDetailsModal />

      {/* Bottom Nav for Mobile */}
      <BottomNav />
    </div>
  );
};
