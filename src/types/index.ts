export interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
  rating: number;
  reviewsCount: number;
  description: string;
  imageUrl: string;
  isBestSeller: boolean;
  isTrending: boolean;
  isNewArrival: boolean;
  category: string;
  isFeatured: boolean;
  previewImages?: string[];
  pdfUrl?: string;
  flashSalePrice?: number | null;
  flashSaleExpiry?: number | null;
  isBookOfDay?: boolean;
  stockCount: number;
}

export interface Category {
  id: string;
  name: string;
  iconName?: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountPercent: number;
  maxDiscount: number;
  minOrderAmount: number;
  isFlashSale: boolean;
  expiryTimestamp: number;
  active: boolean;
}

export interface CartItem {
  book: Book;
  quantity: number;
}

export interface OrderItem {
  bookId: string;
  bookTitle: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface Order {
  id: string;
  userId: string;
  userEmail: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  date: number;
  shippingAddress: {
    fullName: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  paymentMethod: string;
}

export interface ReturnRequest {
  id: string;
  orderId: string;
  userId: string;
  bookId: string;
  bookTitle: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  timestamp: number;
}

export interface Review {
  id: string;
  bookId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  timestamp: number;
  helpfulCount: number;
  reported: boolean;
}

export type ShelfStatus = 'To Read' | 'Reading' | 'Finished';

export interface ShelfItem {
  id: string;
  userId: string;
  bookId: string;
  title: string;
  author: string;
  coverUrl: string;
  status: ShelfStatus;
  dateAdded: number;
  noteEncrypted: string;
}

export type UsedCondition = 'Like New' | 'Good' | 'Acceptable';

export interface UsedListing {
  id: string;
  bookId: string;
  bookTitle: string;
  bookCoverUrl: string;
  sellerId: string;
  sellerEmail: string;
  askingPrice: number;
  condition: UsedCondition;
  description: string;
  timestamp: number;
  status: 'active' | 'sold';
}

export interface UserProfile {
  uid: string;
  email: string;
  role: 'user' | 'admin';
  profileImageBase64?: string;
  readingStreak: number;
  yearlyGoal: number;
  booksFinishedThisYear: number;
  unlockedBadges: string[];
  wishlist: string[]; // bookIds
}

export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: number;
}
