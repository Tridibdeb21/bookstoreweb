import { Book, Category, Coupon, Order, Review, ShelfItem, UsedListing, UserProfile } from '../types';
import { CryptoUtils } from '../utils/crypto';

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'all', name: 'All Books', iconName: 'BookOpen' },
  { id: 'fiction', name: 'Fiction', iconName: 'Sparkles' },
  { id: 'sci-fi', name: 'Sci-Fi & Fantasy', iconName: 'Rocket' },
  { id: 'non-fiction', name: 'Non-Fiction', iconName: 'Compass' },
  { id: 'mystery', name: 'Mystery & Thriller', iconName: 'Search' },
  { id: 'self-help', name: 'Self-Help & Tech', iconName: 'Brain' },
  { id: 'history', name: 'History & Bio', iconName: 'Landmark' },
];

export const INITIAL_BOOKS: Book[] = [
  {
    id: 'book-1',
    title: 'The Midnight Library',
    author: 'Matt Haig',
    price: 18.99,
    rating: 4.8,
    reviewsCount: 1420,
    description: 'Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived. To see how things would be if you made other choices... Nora Seed must decide what is truly fulfilling in life.',
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
    isBestSeller: true,
    isTrending: true,
    isNewArrival: false,
    category: 'fiction',
    isFeatured: true,
    stockCount: 24,
    isBookOfDay: true,
    flashSalePrice: 12.99,
    flashSaleExpiry: Date.now() + 1000 * 60 * 60 * 36, // 36 hours from now
    previewImages: [
      'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=80',
    ]
  },
  {
    id: 'book-2',
    title: 'Atomic Habits',
    author: 'James Clear',
    price: 21.50,
    rating: 4.9,
    reviewsCount: 3890,
    description: 'An easy & proven way to build good habits & break bad ones. No matter your goals, Atomic Habits offers a proven framework for improving--every day. Learn how tiny changes in your behavior lead to remarkable results.',
    imageUrl: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=600&auto=format&fit=crop&q=80',
    isBestSeller: true,
    isTrending: true,
    isNewArrival: false,
    category: 'self-help',
    isFeatured: true,
    stockCount: 45,
    isBookOfDay: false,
    previewImages: [
      'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=800&auto=format&fit=crop&q=80',
    ]
  },
  {
    id: 'book-3',
    title: 'Project Hail Mary',
    author: 'Andy Weir',
    price: 24.99,
    rating: 4.9,
    reviewsCount: 2100,
    description: 'Ryland Grace is the sole survivor on a desperate, last-chance mission—and if he fails, humanity and the earth itself are doomed. Except right now, he doesn’t know that. He can’t even remember his own name.',
    imageUrl: 'https://images.unsplash.com/photo-1618609377864-68609b857e90?w=600&auto=format&fit=crop&q=80',
    isBestSeller: true,
    isTrending: true,
    isNewArrival: false,
    category: 'sci-fi',
    isFeatured: true,
    stockCount: 18,
    isBookOfDay: false,
    flashSalePrice: 16.50,
    flashSaleExpiry: Date.now() + 1000 * 60 * 60 * 24,
    previewImages: [
      'https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?w=800&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'book-4',
    title: 'Sapiens: A Brief History of Humankind',
    author: 'Yuval Noah Harari',
    price: 22.00,
    rating: 4.7,
    reviewsCount: 1850,
    description: 'How did an unexceptional ape become the dominant species on planet Earth, capable of creating cities, empires, and technologies that transform the planet? Sapiens integrates biology, anthropology, and economics.',
    imageUrl: 'https://images.unsplash.com/photo-1463320726281-696a485928c7?w=600&auto=format&fit=crop&q=80',
    isBestSeller: false,
    isTrending: true,
    isNewArrival: false,
    category: 'history',
    isFeatured: false,
    stockCount: 12,
    isBookOfDay: false,
  },
  {
    id: 'book-5',
    title: 'The Silent Patient',
    author: 'Alex Michaelides',
    price: 16.99,
    rating: 4.6,
    reviewsCount: 2950,
    description: 'Alicia Berenson’s life is seemingly perfect. One evening she shoots her husband five times in the face and never speaks another word. Theo Faber is a criminal psychotherapist determined to unravel her silence.',
    imageUrl: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600&auto=format&fit=crop&q=80',
    isBestSeller: true,
    isTrending: false,
    isNewArrival: false,
    category: 'mystery',
    isFeatured: true,
    stockCount: 30,
    isBookOfDay: false,
  },
  {
    id: 'book-6',
    title: 'Dune',
    author: 'Frank Herbert',
    price: 25.00,
    rating: 4.8,
    reviewsCount: 4200,
    description: 'Set on the desert planet Arrakis, Dune tells the story of Paul Atreides, heir to a noble family tasked with ruling an inhospitable world where the only valuable substance is the spice melange.',
    imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80',
    isBestSeller: true,
    isTrending: true,
    isNewArrival: false,
    category: 'sci-fi',
    isFeatured: false,
    stockCount: 15,
    isBookOfDay: false,
    flashSalePrice: 17.99,
    flashSaleExpiry: Date.now() + 1000 * 60 * 60 * 48,
  },
  {
    id: 'book-7',
    title: 'Tomorrow, and Tomorrow, and Tomorrow',
    author: 'Gabrielle Zevin',
    price: 19.99,
    rating: 4.7,
    reviewsCount: 1230,
    description: 'In this exhilarating novel, two friends—often in love, but never lovers—come together as creative partners in the world of video game design, where success brings them fame, joy, tragedy, and duplicity.',
    imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80',
    isBestSeller: false,
    isTrending: true,
    isNewArrival: true,
    category: 'fiction',
    isFeatured: true,
    stockCount: 22,
    isBookOfDay: false,
  },
  {
    id: 'book-8',
    title: 'Thinking, Fast and Slow',
    author: 'Daniel Kahneman',
    price: 23.50,
    rating: 4.6,
    reviewsCount: 1600,
    description: 'Daniel Kahneman, the renowned psychologist and winner of the Nobel Prize in Economics, takes us on a groundbreaking tour of the mind and explains the two systems that drive the way we think.',
    imageUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80',
    isBestSeller: false,
    isTrending: false,
    isNewArrival: true,
    category: 'non-fiction',
    isFeatured: false,
    stockCount: 19,
    isBookOfDay: false,
  }
];

export const INITIAL_COUPONS: Coupon[] = [
  {
    id: 'coup-1',
    code: 'WELCOME20',
    discountPercent: 20,
    maxDiscount: 15,
    minOrderAmount: 20,
    isFlashSale: false,
    expiryTimestamp: Date.now() + 1000 * 60 * 60 * 24 * 30,
    active: true,
  },
  {
    id: 'coup-2',
    code: 'BOOKLOVER10',
    discountPercent: 10,
    maxDiscount: 25,
    minOrderAmount: 0,
    isFlashSale: false,
    expiryTimestamp: Date.now() + 1000 * 60 * 60 * 24 * 60,
    active: true,
  },
  {
    id: 'coup-3',
    code: 'FLASH50',
    discountPercent: 50,
    maxDiscount: 30,
    minOrderAmount: 40,
    isFlashSale: true,
    expiryTimestamp: Date.now() + 1000 * 60 * 60 * 12,
    active: true,
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    bookId: 'book-1',
    userId: 'user-2',
    userName: 'Elena Rostova',
    rating: 5,
    comment: 'A genuinely comforting and philosophical read. It completely changed my perspective on regrets and alternate choices!',
    timestamp: Date.now() - 1000 * 60 * 60 * 48,
    helpfulCount: 34,
    reported: false
  },
  {
    id: 'rev-2',
    bookId: 'book-1',
    userId: 'user-3',
    userName: 'Marcus Vance',
    rating: 4,
    comment: 'Engaging premise with deep emotional resonance. Some chapters felt slightly repetitive, but the ending was uplifting.',
    timestamp: Date.now() - 1000 * 60 * 60 * 96,
    helpfulCount: 12,
    reported: false
  },
  {
    id: 'rev-3',
    bookId: 'book-2',
    userId: 'user-4',
    userName: 'Sophia Chen',
    rating: 5,
    comment: 'The clearest, most actionable book on habit formation I have ever encountered. The 2-minute rule is a game changer.',
    timestamp: Date.now() - 1000 * 60 * 60 * 72,
    helpfulCount: 58,
    reported: false
  },
  {
    id: 'rev-4',
    bookId: 'book-3',
    userId: 'user-5',
    userName: 'David K.',
    rating: 5,
    comment: 'Science fiction at its absolute finest! Fast-paced, humorous, and full of brilliant problem-solving.',
    timestamp: Date.now() - 1000 * 60 * 60 * 120,
    helpfulCount: 42,
    reported: false
  }
];

export const INITIAL_USER: UserProfile = {
  uid: 'user-current-1',
  email: 'tridibdeb21@gmail.com',
  role: 'admin',
  readingStreak: 14,
  yearlyGoal: 25,
  booksFinishedThisYear: 18,
  unlockedBadges: ['First Step', 'Halfway There'],
  wishlist: ['book-3', 'book-6'],
};

export const INITIAL_SHELF: ShelfItem[] = [
  {
    id: 'shelf-1',
    userId: 'user-current-1',
    bookId: 'book-1',
    title: 'The Midnight Library',
    author: 'Matt Haig',
    coverUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
    status: 'Finished',
    dateAdded: Date.now() - 1000 * 60 * 60 * 24 * 10,
    noteEncrypted: CryptoUtils.encrypt('Finished this during rainy autumn. The root life message made me appreciate my current job and relationships so much more.')
  },
  {
    id: 'shelf-2',
    userId: 'user-current-1',
    bookId: 'book-2',
    title: 'Atomic Habits',
    author: 'James Clear',
    coverUrl: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=600&auto=format&fit=crop&q=80',
    status: 'Reading',
    dateAdded: Date.now() - 1000 * 60 * 60 * 24 * 3,
    noteEncrypted: CryptoUtils.encrypt('Focusing on implementing the cue-craving-response-reward loop for daily morning writing.')
  },
  {
    id: 'shelf-3',
    userId: 'user-current-1',
    bookId: 'book-7',
    title: 'Tomorrow, and Tomorrow, and Tomorrow',
    author: 'Gabrielle Zevin',
    coverUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80',
    status: 'To Read',
    dateAdded: Date.now() - 1000 * 60 * 60 * 24 * 1,
    noteEncrypted: CryptoUtils.encrypt('Recommended by Sarah for game narrative lovers.')
  }
];

export const INITIAL_USED_LISTINGS: UsedListing[] = [
  {
    id: 'used-1',
    bookId: 'book-1',
    bookTitle: 'The Midnight Library',
    bookCoverUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
    sellerId: 'user-8',
    sellerEmail: 'alex.reader@example.com',
    askingPrice: 8.50,
    condition: 'Like New',
    description: 'Read once carefully, crisp pages, spine unbroken. Smoke-free home.',
    timestamp: Date.now() - 1000 * 60 * 60 * 18,
    status: 'active',
  },
  {
    id: 'used-2',
    bookId: 'book-6',
    bookTitle: 'Dune',
    bookCoverUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80',
    sellerId: 'user-9',
    sellerEmail: 'clara.books@example.com',
    askingPrice: 11.00,
    condition: 'Good',
    description: 'Deluxe paperback edition with minor corner wear. All pages clean.',
    timestamp: Date.now() - 1000 * 60 * 60 * 36,
    status: 'active',
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-984120',
    userId: 'user-current-1',
    userEmail: 'tridibdeb21@gmail.com',
    items: [
      {
        bookId: 'book-1',
        bookTitle: 'The Midnight Library',
        price: 18.99,
        quantity: 1,
        imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80'
      },
      {
        bookId: 'book-5',
        bookTitle: 'The Silent Patient',
        price: 16.99,
        quantity: 1,
        imageUrl: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600&auto=format&fit=crop&q=80'
      }
    ],
    totalAmount: 35.98,
    status: 'Delivered',
    date: Date.now() - 1000 * 60 * 60 * 24 * 7,
    shippingAddress: {
      fullName: 'Tridib Deb',
      street: '742 Evergreen Terrace',
      city: 'Springfield',
      state: 'OR',
      zipCode: '97477'
    },
    paymentMethod: 'Credit Card (•••• 4242)'
  },
  {
    id: 'ORD-512034',
    userId: 'user-current-1',
    userEmail: 'tridibdeb21@gmail.com',
    items: [
      {
        bookId: 'book-3',
        bookTitle: 'Project Hail Mary',
        price: 16.50,
        quantity: 1,
        imageUrl: 'https://images.unsplash.com/photo-1618609377864-68609b857e90?w=600&auto=format&fit=crop&q=80'
      }
    ],
    totalAmount: 16.50,
    status: 'Shipped',
    date: Date.now() - 1000 * 60 * 60 * 24 * 2,
    shippingAddress: {
      fullName: 'Tridib Deb',
      street: '742 Evergreen Terrace',
      city: 'Springfield',
      state: 'OR',
      zipCode: '97477'
    },
    paymentMethod: 'Google Pay'
  }
];
