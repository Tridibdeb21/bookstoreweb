import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Book } from '../../types';
import { X, Plus, Edit2, Trash2, Check, Sparkles } from 'lucide-react';

export const ManageBooksModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose
}) => {
  const { books, addBook, updateBook, deleteBook, categories } = useStore();
  const [editingBookId, setEditingBookId] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState(categories[1]?.id || 'fiction');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [stockCount, setStockCount] = useState('25');
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [isTrending, setIsTrending] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(false);

  if (!isOpen) return null;

  const resetForm = () => {
    setEditingBookId(null);
    setTitle('');
    setAuthor('');
    setPrice('');
    setCategory(categories[1]?.id || 'fiction');
    setImageUrl('');
    setDescription('');
    setStockCount('25');
    setIsBestSeller(false);
    setIsTrending(false);
    setIsNewArrival(false);
  };

  const handleStartEdit = (b: Book) => {
    setEditingBookId(b.id);
    setTitle(b.title);
    setAuthor(b.author);
    setPrice(b.price.toString());
    setCategory(b.category);
    setImageUrl(b.imageUrl);
    setDescription(b.description);
    setStockCount(b.stockCount.toString());
    setIsBestSeller(b.isBestSeller);
    setIsTrending(b.isTrending);
    setIsNewArrival(b.isNewArrival);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = parseFloat(price);
    const stockNum = parseInt(stockCount, 10);
    if (isNaN(priceNum) || priceNum <= 0) return;

    if (editingBookId) {
      updateBook(editingBookId, {
        title,
        author,
        price: priceNum,
        category,
        imageUrl: imageUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
        description,
        stockCount: isNaN(stockNum) ? 10 : stockNum,
        isBestSeller,
        isTrending,
        isNewArrival
      });
    } else {
      addBook({
        title,
        author,
        price: priceNum,
        rating: 5.0,
        reviewsCount: 1,
        category,
        imageUrl: imageUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
        description,
        isFeatured: false,
        stockCount: isNaN(stockNum) ? 10 : stockNum,
        isBestSeller,
        isTrending,
        isNewArrival
      });
    }

    resetForm();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        id="manage-books-modal-container"
        className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl border border-stone-200 text-stone-900"
      >
        <div className="flex items-center justify-between border-b border-stone-200 pb-4">
          <div>
            <h3 className="font-serif font-bold text-xl text-stone-900">
              Inventory & Book Catalogue Manager
            </h3>
            <p className="text-xs text-stone-500">
              Add new catalog titles, edit metadata, pricing, and stock
            </p>
          </div>

          <button onClick={onClose} className="p-2 rounded-full hover:bg-stone-100 text-stone-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Add/Edit Form */}
        <form onSubmit={handleSave} className="bg-stone-50 p-5 rounded-2xl border border-stone-200 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-sm text-stone-800">
              {editingBookId ? 'Edit Book Information' : 'Add New Book to Inventory'}
            </h4>
            {editingBookId && (
              <button
                type="button"
                onClick={resetForm}
                className="text-xs font-bold text-stone-500 hover:text-stone-800"
              >
                Cancel Edit
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Book Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="p-2.5 text-xs bg-white border border-stone-300 rounded-xl focus:outline-none focus:border-amber-500 font-medium"
              required
            />
            <input
              type="text"
              placeholder="Author Name"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="p-2.5 text-xs bg-white border border-stone-300 rounded-xl focus:outline-none focus:border-amber-500 font-medium"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="number"
              step="0.01"
              placeholder="Price ($ USD)"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="p-2.5 text-xs bg-white border border-stone-300 rounded-xl focus:outline-none focus:border-amber-500 font-bold"
              required
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="p-2.5 text-xs bg-white border border-stone-300 rounded-xl focus:outline-none font-medium capitalize"
            >
              {categories.filter((c) => c.id !== 'all').map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Stock Count"
              value={stockCount}
              onChange={(e) => setStockCount(e.target.value)}
              className="p-2.5 text-xs bg-white border border-stone-300 rounded-xl focus:outline-none font-medium"
              required
            />
          </div>

          <input
            type="url"
            placeholder="Cover Image URL (e.g. Unsplash URL)"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full p-2.5 text-xs bg-white border border-stone-300 rounded-xl focus:outline-none font-medium"
          />

          <textarea
            placeholder="Book Synopsis & Description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full p-2.5 text-xs bg-white border border-stone-300 rounded-xl focus:outline-none focus:border-amber-500"
            required
          />

          {/* Tags */}
          <div className="flex flex-wrap gap-4 pt-1">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-stone-700 cursor-pointer">
              <input
                type="checkbox"
                checked={isBestSeller}
                onChange={(e) => setIsBestSeller(e.target.checked)}
                className="rounded text-amber-500"
              />
              <span>Best Seller</span>
            </label>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-stone-700 cursor-pointer">
              <input
                type="checkbox"
                checked={isTrending}
                onChange={(e) => setIsTrending(e.target.checked)}
                className="rounded text-emerald-500"
              />
              <span>Trending</span>
            </label>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-stone-700 cursor-pointer">
              <input
                type="checkbox"
                checked={isNewArrival}
                onChange={(e) => setIsNewArrival(e.target.checked)}
                className="rounded text-sky-500"
              />
              <span>New Arrival</span>
            </label>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-md transition"
            >
              {editingBookId ? 'Update Book' : 'Add to Inventory'}
            </button>
          </div>
        </form>

        {/* Existing Books List */}
        <div className="space-y-3">
          <h4 className="font-serif font-bold text-base text-stone-900">
            Current Inventory ({books.length} Books)
          </h4>

          <div className="divide-y divide-stone-100 border border-stone-200 rounded-2xl overflow-hidden">
            {books.map((b) => (
              <div key={b.id} className="p-3.5 bg-white flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={b.imageUrl}
                    alt={b.title}
                    className="w-10 h-14 object-cover rounded-lg shadow-sm"
                  />
                  <div>
                    <h5 className="font-bold text-xs sm:text-sm text-stone-900">{b.title}</h5>
                    <p className="text-[11px] text-stone-500">
                      by {b.author} • <span className="font-bold">${b.price.toFixed(2)}</span> • Stock: {b.stockCount}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleStartEdit(b)}
                    className="p-2 text-stone-600 hover:bg-stone-100 rounded-lg transition"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Delete "${b.title}"?`)) deleteBook(b.id);
                    }}
                    className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
