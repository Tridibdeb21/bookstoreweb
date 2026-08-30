import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Book,
  Category,
  Coupon,
  CartItem,
  Order,
  OrderStatus,
  ReturnRequest,
  Review,
  ShelfItem,
  ShelfStatus,
  UsedListing,
  UserProfile,
  ChatMessage
} from '../types';
import {
  INITIAL_BOOKS,
  INITIAL_CATEGORIES,
  INITIAL_COUPONS,
  INITIAL_ORDERS,
  INITIAL_REVIEWS,
  INITIAL_SHELF,
  INITIAL_USED_LISTINGS,
  INITIAL_USER
} from '../data/mockData';
import { CryptoUtils } from '../utils/crypto';

interface StoreContextType {
  // Navigation & Views
  activeView: 'home' | 'shelf' | 'marketplace' | 'profile' | 'wishlist' | 'orders' | 'admin';
  setActiveView: (view: 'home' | 'shelf' | 'marketplace' | 'profile' | 'wishlist' | 'orders' | 'admin') => void;
  selectedCategory: string;
  setSelectedCategory: (catId: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Selected book for details modal
  selectedBook: Book | null;
  setSelectedBook: (book: Book | null) => void;
  previewBook: Book | null;
  setPreviewBook: (book: Book | null) => void;

  // Modals
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isAiChatOpen: boolean;
  setIsAiChatOpen: (open: boolean) => void;
  isAiRecommendOpen: boolean;
  setIsAiRecommendOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isSellUsedOpen: boolean;
  setIsSellUsedOpen: (open: boolean) => void;
  selectedOrderForDetails: Order | null;
  setSelectedOrderForDetails: (order: Order | null) => void;

  // Data Collections
  books: Book[];
  categories: Category[];
  coupons: Coupon[];
  cart: CartItem[];
  appliedCoupon: Coupon | null;
  user: UserProfile;
  shelf: ShelfItem[];
  orders: Order[];
  returnRequests: ReturnRequest[];
  usedListings: UsedListing[];
  reviews: Review[];

  // Cart operations
  addToCart: (book: Book, quantity?: number) => void;
  removeFromCart: (bookId: string) => void;
  updateCartQuantity: (bookId: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  cartSubtotal: number;
  cartDiscount: number;
  cartTotal: number;

  // Shelf operations
  addToShelf: (book: Book, status?: ShelfStatus, note?: string) => void;
  updateShelfStatus: (bookId: string, newStatus: ShelfStatus) => void;
  removeFromShelf: (bookId: string) => void;
  decryptShelfNote: (encryptedNote: string) => string;

  // Wishlist operations
  toggleWishlist: (bookId: string) => void;
  isInWishlist: (bookId: string) => boolean;

  // User Profile
  updateUserProfile: (updates: Partial<UserProfile>) => void;

  // Order Operations
  placeOrder: (shippingAddress: Order['shippingAddress'], paymentMethod: string) => Order;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  submitReturnRequest: (orderId: string, bookId: string, bookTitle: string, reason: string) => void;
  updateReturnStatus: (returnId: string, newStatus: 'approved' | 'rejected') => void;

  // Used Book Marketplace
  createUsedListing: (listing: Omit<UsedListing, 'id' | 'timestamp' | 'sellerId' | 'sellerEmail' | 'status'>) => void;
  buyUsedListing: (listingId: string) => void;

  // Reviews
  addReview: (bookId: string, rating: number, comment: string) => void;
  reportReview: (reviewId: string) => void;
  toggleHelpful: (reviewId: string) => void;

  // Admin Book Management
  addBook: (bookData: Omit<Book, 'id'>) => void;
  updateBook: (id: string, updates: Partial<Book>) => void;
  deleteBook: (id: string) => void;
  setBookOfDay: (bookId: string, isBookOfDay: boolean) => void;
  setFlashSale: (bookId: string, price: number | null, expiryTimestamp: number | null) => void;

  // Admin Categories & Coupons
  addCategory: (name: string, iconName?: string) => void;
  deleteCategory: (id: string) => void;
  addCoupon: (couponData: Omit<Coupon, 'id'>) => void;
  deleteCoupon: (id: string) => void;
  toggleCouponActive: (id: string) => void;

  // AI Helpers
  chatMessages: ChatMessage[];
  sendChatMessage: (text: string) => Promise<void>;
  clearChatMessages: () => void;
  getAiRecommendations: (prompt: string) => Promise<string>;
  summarizeBookReviews: (bookTitle: string, comments: string[]) => Promise<string>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const loadFromStorage = <T,>(key: string, fallback: T): T => {
  try {
    const item = localStorage.getItem(`bookstore_${key}`);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
};

const saveToStorage = <T,>(key: string, data: T) => {
  try {
    localStorage.setItem(`bookstore_${key}`, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation & Screen states
  const [activeView, setActiveView] = useState<'home' | 'shelf' | 'marketplace' | 'profile' | 'wishlist' | 'orders' | 'admin'>('home');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals and selections
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [previewBook, setPreviewBook] = useState<Book | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);
  const [isAiRecommendOpen, setIsAiRecommendOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSellUsedOpen, setIsSellUsedOpen] = useState(false);
  const [selectedOrderForDetails, setSelectedOrderForDetails] = useState<Order | null>(null);

  // Core Data States with localStorage persistence
  const [books, setBooks] = useState<Book[]>(() => loadFromStorage('books', INITIAL_BOOKS));
  const [categories, setCategories] = useState<Category[]>(() => loadFromStorage('categories', INITIAL_CATEGORIES));
  const [coupons, setCoupons] = useState<Coupon[]>(() => loadFromStorage('coupons', INITIAL_COUPONS));
  const [cart, setCart] = useState<CartItem[]>(() => loadFromStorage('cart', []));
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(() => loadFromStorage('appliedCoupon', null));
  const [user, setUser] = useState<UserProfile>(() => loadFromStorage('user', INITIAL_USER));
  const [shelf, setShelf] = useState<ShelfItem[]>(() => loadFromStorage('shelf', INITIAL_SHELF));
  const [orders, setOrders] = useState<Order[]>(() => loadFromStorage('orders', INITIAL_ORDERS));
  const [returnRequests, setReturnRequests] = useState<ReturnRequest[]>(() => loadFromStorage('returnRequests', []));
  const [usedListings, setUsedListings] = useState<UsedListing[]>(() => loadFromStorage('usedListings', INITIAL_USED_LISTINGS));
  const [reviews, setReviews] = useState<Review[]>(() => loadFromStorage('reviews', INITIAL_REVIEWS));

  // Chatbot State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      text: 'Hello! I am your AI Literature and Bookstore Assistant. Ask me for book recommendations, plot summaries, author background, or what to read next!',
      isUser: false,
      timestamp: Date.now()
    }
  ]);

  // Sync to storage
  useEffect(() => saveToStorage('books', books), [books]);
  useEffect(() => saveToStorage('categories', categories), [categories]);
  useEffect(() => saveToStorage('coupons', coupons), [coupons]);
  useEffect(() => saveToStorage('cart', cart), [cart]);
  useEffect(() => saveToStorage('appliedCoupon', appliedCoupon), [appliedCoupon]);
  useEffect(() => saveToStorage('user', user), [user]);
  useEffect(() => saveToStorage('shelf', shelf), [shelf]);
  useEffect(() => saveToStorage('orders', orders), [orders]);
  useEffect(() => saveToStorage('returnRequests', returnRequests), [returnRequests]);
  useEffect(() => saveToStorage('usedListings', usedListings), [usedListings]);
  useEffect(() => saveToStorage('reviews', reviews), [reviews]);

  // Cart operations
  const addToCart = (book: Book, quantity: number = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.book.id === book.id);
      if (existing) {
        return prev.map((item) =>
          item.book.id === book.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { book, quantity }];
    });
  };

  const removeFromCart = (bookId: string) => {
    setCart((prev) => prev.filter((item) => item.book.id !== bookId));
  };

  const updateCartQuantity = (bookId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(bookId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.book.id === bookId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const cartSubtotal = cart.reduce((acc, item) => {
    const itemPrice =
      item.book.flashSalePrice &&
      item.book.flashSaleExpiry &&
      item.book.flashSaleExpiry > Date.now()
        ? item.book.flashSalePrice
        : item.book.price;
    return acc + itemPrice * item.quantity;
  }, 0);

  const cartDiscount = appliedCoupon
    ? Math.min((cartSubtotal * appliedCoupon.discountPercent) / 100, appliedCoupon.maxDiscount)
    : 0;

  const cartTotal = Math.max(0, cartSubtotal - cartDiscount);

  const applyCoupon = (code: string): { success: boolean; message: string } => {
    const found = coupons.find(
      (c) => c.code.trim().toUpperCase() === code.trim().toUpperCase() && c.active
    );
    if (!found) {
      return { success: false, message: 'Invalid or expired coupon code.' };
    }
    if (found.expiryTimestamp && found.expiryTimestamp < Date.now()) {
      return { success: false, message: 'This coupon has expired.' };
    }
    if (cartSubtotal < found.minOrderAmount) {
      return {
        success: false,
        message: `Minimum order amount of $${found.minOrderAmount.toFixed(2)} required for this coupon.`
      };
    }
    setAppliedCoupon(found);
    return { success: true, message: `Coupon ${found.code} applied: ${found.discountPercent}% OFF!` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  // Shelf operations
  const addToShelf = (book: Book, status: ShelfStatus = 'To Read', note: string = '') => {
    const existing = shelf.find((item) => item.bookId === book.id);
    const encryptedNote = note.trim() ? CryptoUtils.encrypt(note) : '';

    if (existing) {
      setShelf((prev) =>
        prev.map((item) =>
          item.bookId === book.id
            ? {
                ...item,
                status,
                noteEncrypted: encryptedNote || item.noteEncrypted
              }
            : item
        )
      );
    } else {
      const newItem: ShelfItem = {
        id: `shelf-${Date.now()}`,
        userId: user.uid,
        bookId: book.id,
        title: book.title,
        author: book.author,
        coverUrl: book.imageUrl,
        status,
        dateAdded: Date.now(),
        noteEncrypted: encryptedNote
      };
      setShelf((prev) => [newItem, ...prev]);
    }
  };

  const updateShelfStatus = (bookId: string, newStatus: ShelfStatus) => {
    setShelf((prev) =>
      prev.map((item) => (item.bookId === bookId ? { ...item, status: newStatus } : item))
    );

    // If marked finished, check badges & update user finished stats
    if (newStatus === 'Finished') {
      setUser((prev) => {
        const newFinished = prev.booksFinishedThisYear + 1;
        const badges = [...prev.unlockedBadges];
        if (!badges.includes('First Step')) badges.push('First Step');
        if (prev.yearlyGoal > 0 && newFinished >= prev.yearlyGoal / 2 && !badges.includes('Halfway There')) {
          badges.push('Halfway There');
        }
        if (prev.yearlyGoal > 0 && newFinished >= prev.yearlyGoal && !badges.includes('Goal Achiever')) {
          badges.push('Goal Achiever');
        }
        return {
          ...prev,
          booksFinishedThisYear: newFinished,
          unlockedBadges: badges
        };
      });
    }
  };

  const removeFromShelf = (bookId: string) => {
    setShelf((prev) => prev.filter((item) => item.bookId !== bookId));
  };

  const decryptShelfNote = (encryptedNote: string): string => {
    return CryptoUtils.decrypt(encryptedNote);
  };

  // Wishlist
  const toggleWishlist = (bookId: string) => {
    setUser((prev) => {
      const exists = prev.wishlist.includes(bookId);
      const newWishlist = exists
        ? prev.wishlist.filter((id) => id !== bookId)
        : [...prev.wishlist, bookId];
      return { ...prev, wishlist: newWishlist };
    });
  };

  const isInWishlist = (bookId: string): boolean => {
    return user.wishlist.includes(bookId);
  };

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...updates }));
  };

  // Orders
  const placeOrder = (shippingAddress: Order['shippingAddress'], paymentMethod: string): Order => {
    const newOrder: Order = {
      id: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
      userId: user.uid,
      userEmail: user.email,
      items: cart.map((item) => ({
        bookId: item.book.id,
        bookTitle: item.book.title,
        price:
          item.book.flashSalePrice &&
          item.book.flashSaleExpiry &&
          item.book.flashSaleExpiry > Date.now()
            ? item.book.flashSalePrice
            : item.book.price,
        quantity: item.quantity,
        imageUrl: item.book.imageUrl
      })),
      totalAmount: Number(cartTotal.toFixed(2)),
      status: 'Pending',
      date: Date.now(),
      shippingAddress,
      paymentMethod
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order))
    );
  };

  const submitReturnRequest = (
    orderId: string,
    bookId: string,
    bookTitle: string,
    reason: string
  ) => {
    const newReq: ReturnRequest = {
      id: `ret-${Date.now()}`,
      orderId,
      userId: user.uid,
      bookId,
      bookTitle,
      reason,
      status: 'pending',
      timestamp: Date.now()
    };
    setReturnRequests((prev) => [newReq, ...prev]);
  };

  const updateReturnStatus = (returnId: string, newStatus: 'approved' | 'rejected') => {
    setReturnRequests((prev) =>
      prev.map((req) => (req.id === returnId ? { ...req, status: newStatus } : req))
    );
  };

  // Used Book Marketplace
  const createUsedListing = (
    listing: Omit<UsedListing, 'id' | 'timestamp' | 'sellerId' | 'sellerEmail' | 'status'>
  ) => {
    const newListing: UsedListing = {
      ...listing,
      id: `used-${Date.now()}`,
      sellerId: user.uid,
      sellerEmail: user.email,
      timestamp: Date.now(),
      status: 'active'
    };
    setUsedListings((prev) => [newListing, ...prev]);
  };

  const buyUsedListing = (listingId: string) => {
    setUsedListings((prev) =>
      prev.map((item) => (item.id === listingId ? { ...item, status: 'sold' } : item))
    );
  };

  // Reviews
  const addReview = (bookId: string, rating: number, comment: string) => {
    const newRev: Review = {
      id: `rev-${Date.now()}`,
      bookId,
      userId: user.uid,
      userName: user.email.split('@')[0],
      rating,
      comment,
      timestamp: Date.now(),
      helpfulCount: 0,
      reported: false
    };
    setReviews((prev) => [newRev, ...prev]);

    // Update book rating
    const bookRevs = [...reviews.filter((r) => r.bookId === bookId), newRev];
    const avgRating = Number((bookRevs.reduce((a, b) => a + b.rating, 0) / bookRevs.length).toFixed(1));
    setBooks((prev) =>
      prev.map((b) =>
        b.id === bookId ? { ...b, rating: avgRating, reviewsCount: bookRevs.length } : b
      )
    );
  };

  const reportReview = (reviewId: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, reported: true } : r))
    );
  };

  const toggleHelpful = (reviewId: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, helpfulCount: r.helpfulCount + 1 } : r))
    );
  };

  // Admin Book Management
  const addBook = (bookData: Omit<Book, 'id'>) => {
    const newBook: Book = {
      ...bookData,
      id: `book-${Date.now()}`
    };
    setBooks((prev) => [newBook, ...prev]);
  };

  const updateBook = (id: string, updates: Partial<Book>) => {
    setBooks((prev) => prev.map((b) => (b.id === id ? { ...b, ...updates } : b)));
  };

  const deleteBook = (id: string) => {
    setBooks((prev) => prev.filter((b) => b.id !== id));
  };

  const setBookOfDay = (bookId: string, isBookOfDay: boolean) => {
    setBooks((prev) =>
      prev.map((b) => ({
        ...b,
        isBookOfDay: b.id === bookId ? isBookOfDay : isBookOfDay ? false : b.isBookOfDay
      }))
    );
  };

  const setFlashSale = (bookId: string, price: number | null, expiryTimestamp: number | null) => {
    setBooks((prev) =>
      prev.map((b) =>
        b.id === bookId ? { ...b, flashSalePrice: price, flashSaleExpiry: expiryTimestamp } : b
      )
    );
  };

  // Admin Categories & Coupons
  const addCategory = (name: string, iconName: string = 'BookOpen') => {
    const id = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const newCat: Category = { id, name, iconName };
    setCategories((prev) => [...prev, newCat]);
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  const addCoupon = (couponData: Omit<Coupon, 'id'>) => {
    const newCoupon: Coupon = {
      ...couponData,
      id: `coup-${Date.now()}`
    };
    setCoupons((prev) => [newCoupon, ...prev]);
  };

  const deleteCoupon = (id: string) => {
    setCoupons((prev) => prev.filter((c) => c.id !== id));
  };

  const toggleCouponActive = (id: string) => {
    setCoupons((prev) =>
      prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c))
    );
  };

  // AI Helpers
  const sendChatMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      text,
      isUser: true,
      timestamp: Date.now()
    };

    setChatMessages((prev) => [...prev, userMsg]);

    // Generate intelligent contextual response using bookstore catalog
    try {
      // Simulate/perform AI chat response
      await new Promise((r) => setTimeout(r, 600));

      const lower = text.toLowerCase();
      let responseText = '';

      if (lower.includes('recommend') || lower.includes('suggest') || lower.includes('what should i read')) {
        const sampleBooks = books.slice(0, 3);
        responseText = `Based on our curated collection, I highly recommend:
• **${sampleBooks[0].title}** by ${sampleBooks[0].author} - ${sampleBooks[0].description.slice(0, 90)}...
• **${sampleBooks[1]?.title || 'Atomic Habits'}** by ${sampleBooks[1]?.author || 'James Clear'} - A phenomenal choice for self-growth and mindful reading.
• **${sampleBooks[2]?.title || 'Project Hail Mary'}** by ${sampleBooks[2]?.author || 'Andy Weir'} - Fast-paced sci-fi with unforgettable moments.

Would you like to focus on a particular genre like Fiction, Sci-Fi, or Non-Fiction?`;
      } else if (lower.includes('discount') || lower.includes('coupon') || lower.includes('deal') || lower.includes('sale')) {
        const activeCoups = coupons.filter((c) => c.active).map((c) => `\`${c.code}\` (${c.discountPercent}% OFF)`).join(', ');
        responseText = `We currently have great offers! You can use coupon codes: ${activeCoups}. Plus, check out our **Flash Sales** section for limited-time price drops!`;
      } else if (lower.includes('used') || lower.includes('secondhand') || lower.includes('sell')) {
        responseText = `You can buy verified pre-owned copies at huge discounts in our **Community Marketplace**, or list your own copies directly from any book detail page!`;
      } else if (lower.includes('shelf') || lower.includes('capsule') || lower.includes('time capsule')) {
        responseText = `Our **Personal Bookshelf** allows you to track your reading stages ('To Read', 'Reading', 'Finished'). When you finish a book, your private encrypted Time Capsule note unlocks!`;
      } else {
        const matchingBook = books.find((b) => lower.includes(b.title.toLowerCase()) || lower.includes(b.author.toLowerCase()));
        if (matchingBook) {
          responseText = `**${matchingBook.title}** by ${matchingBook.author} ($${matchingBook.price.toFixed(2)}, Rated ⭐ ${matchingBook.rating}/5.0):\n\n${matchingBook.description}\n\nWould you like me to help you add this to your cart or bookshelf?`;
        } else {
          responseText = `I'd love to help! Our bookstore features top titles in Fiction, Sci-Fi, Mystery, Personal Growth, and History. You can ask me to find books by your favorite topic, summarize reviews, or find current flash deals. What are you in the mood for today?`;
        }
      }

      const aiMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        text: responseText,
        isUser: false,
        timestamp: Date.now()
      };

      setChatMessages((prev) => [...prev, aiMsg]);
    } catch {
      const errorMsg: ChatMessage = {
        id: `msg-err-${Date.now()}`,
        text: "I'm having a brief connection pause. Please try asking again!",
        isUser: false,
        timestamp: Date.now()
      };
      setChatMessages((prev) => [...prev, errorMsg]);
    }
  };

  const clearChatMessages = () => {
    setChatMessages([
      {
        id: 'welcome',
        text: 'Chat cleared! How can I assist your reading journey today?',
        isUser: false,
        timestamp: Date.now()
      }
    ]);
  };

  const getAiRecommendations = async (prompt: string): Promise<string> => {
    await new Promise((r) => setTimeout(r, 800));
    const matching = books.filter((b) => {
      const p = prompt.toLowerCase();
      return (
        b.title.toLowerCase().includes(p) ||
        b.author.toLowerCase().includes(p) ||
        b.category.toLowerCase().includes(p) ||
        b.description.toLowerCase().includes(p)
      );
    });

    const recommendations = matching.length > 0 ? matching.slice(0, 3) : books.slice(0, 3);
    return `Here are top recommendations tailored to "${prompt}":\n\n` +
      recommendations
        .map(
          (b, idx) =>
            `${idx + 1}. **${b.title}** by ${b.author} ($${b.price.toFixed(2)})\n   • *Why you will enjoy it*: ${b.description.slice(0, 110)}... Rated ⭐ ${b.rating} by ${b.reviewsCount} readers.`
        )
        .join('\n\n');
  };

  const summarizeBookReviews = async (bookTitle: string, comments: string[]): Promise<string> => {
    await new Promise((r) => setTimeout(r, 600));
    if (comments.length === 0) {
      return `No reviews yet for "${bookTitle}". Be the first reader to share your insights!`;
    }
    return `Readers highlight "${bookTitle}" for its compelling storytelling, strong pacing, and emotional depth. Reviewers consistently praise the vivid character development, with multiple readers citing it as an unforgettable read that sparks thoughtful reflection.`;
  };

  return (
    <StoreContext.Provider
      value={{
        activeView,
        setActiveView,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        selectedBook,
        setSelectedBook,
        previewBook,
        setPreviewBook,
        isCartOpen,
        setIsCartOpen,
        isAiChatOpen,
        setIsAiChatOpen,
        isAiRecommendOpen,
        setIsAiRecommendOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isSellUsedOpen,
        setIsSellUsedOpen,
        selectedOrderForDetails,
        setSelectedOrderForDetails,
        books,
        categories,
        coupons,
        cart,
        appliedCoupon,
        user,
        shelf,
        orders,
        returnRequests,
        usedListings,
        reviews,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        applyCoupon,
        removeCoupon,
        cartSubtotal,
        cartDiscount,
        cartTotal,
        addToShelf,
        updateShelfStatus,
        removeFromShelf,
        decryptShelfNote,
        toggleWishlist,
        isInWishlist,
        updateUserProfile,
        placeOrder,
        updateOrderStatus,
        submitReturnRequest,
        updateReturnStatus,
        createUsedListing,
        buyUsedListing,
        addReview,
        reportReview,
        toggleHelpful,
        addBook,
        updateBook,
        deleteBook,
        setBookOfDay,
        setFlashSale,
        addCategory,
        deleteCategory,
        addCoupon,
        deleteCoupon,
        toggleCouponActive,
        chatMessages,
        sendChatMessage,
        clearChatMessages,
        getAiRecommendations,
        summarizeBookReviews
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
