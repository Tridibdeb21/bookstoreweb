import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { X, Plus, Trash2, Layers } from 'lucide-react';

export const ManageCategoriesModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose
}) => {
  const { categories, addCategory, deleteCategory } = useStore();
  const [newCatName, setNewCatName] = useState('');

  if (!isOpen) return null;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    addCategory(newCatName.trim());
    setNewCatName('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        id="manage-categories-modal-container"
        className="bg-white rounded-3xl max-w-xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl border border-stone-200 text-stone-900"
      >
        <div className="flex items-center justify-between border-b border-stone-200 pb-4">
          <div>
            <h3 className="font-serif font-bold text-xl text-stone-900">
              Genre & Category Taxonomy
            </h3>
            <p className="text-xs text-stone-500">
              Organize bookstore browsing filters and sections
            </p>
          </div>

          <button onClick={onClose} className="p-2 rounded-full hover:bg-stone-100 text-stone-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Add Category */}
        <form onSubmit={handleAdd} className="flex gap-2">
          <input
            type="text"
            placeholder="New Genre / Category Name (e.g. Poetry, Graphic Novels)..."
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            className="flex-1 p-2.5 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-amber-500 font-medium"
            required
          />
          <button
            type="submit"
            className="px-5 py-2.5 bg-stone-900 text-white font-bold text-xs rounded-xl hover:bg-stone-800"
          >
            Add Genre
          </button>
        </form>

        {/* Categories List */}
        <div className="space-y-2">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between"
            >
              <span className="font-bold text-xs text-stone-800">{cat.name}</span>
              {cat.id !== 'all' && (
                <button
                  onClick={() => deleteCategory(cat.id)}
                  className="text-stone-400 hover:text-rose-600 transition"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
