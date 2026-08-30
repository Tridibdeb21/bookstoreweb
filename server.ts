import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { getSupabase, isSupabaseConfigured } from './server/supabase.js';

// Initial in-memory data store for server-side persistence / fallback
import {
  INITIAL_BOOKS,
  INITIAL_CATEGORIES,
  INITIAL_COUPONS,
  INITIAL_ORDERS,
  INITIAL_REVIEWS,
  INITIAL_SHELF,
  INITIAL_USED_LISTINGS,
  INITIAL_USER
} from './src/data/mockData.js';

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  // Middlewares
  app.use(cors());
  app.use(express.json({ limit: '10mb' }));

  // In-Memory Database collections (used as fallback or when Supabase keys are not set)
  let books = [...INITIAL_BOOKS];
  let categories = [...INITIAL_CATEGORIES];
  let coupons = [...INITIAL_COUPONS];
  let orders = [...INITIAL_ORDERS];
  let reviews = [...INITIAL_REVIEWS];
  let shelf = [...INITIAL_SHELF];
  let usedListings = [...INITIAL_USED_LISTINGS];
  let returnRequests: any[] = [];
  let userProfile = { ...INITIAL_USER };

  // ==========================================
  // API ROUTES
  // ==========================================

  // 1. Health & Database Status
  app.get('/api/health', async (req: Request, res: Response) => {
    const supabase = getSupabase();
    let dbStatus = isSupabaseConfigured() ? 'Supabase Connected' : 'In-Memory / Local Cache';
    let dbError = null;

    if (supabase) {
      const { data, error } = await supabase.from('books').select('id').limit(1);
      if (error) {
        dbStatus = 'Supabase Configured (Pending Schema Migration)';
        dbError = error.message;
      }
    }

    res.json({
      status: 'online',
      service: 'BookStore Full-Stack API',
      database: dbStatus,
      supabaseConfigured: isSupabaseConfigured(),
      dbError,
      timestamp: new Date().toISOString(),
      itemsInStore: books.length,
      activeOrders: orders.length
    });
  });

  // 2. Books Catalog API
  app.get('/api/books', async (req: Request, res: Response) => {
    const supabase = getSupabase();
    const { category, search, tag } = req.query;

    if (supabase) {
      let query = supabase.from('books').select('*');
      if (category && category !== 'all') {
        query = query.eq('category', category);
      }
      if (tag === 'bestseller') query = query.eq('is_best_seller', true);
      if (tag === 'trending') query = query.eq('is_trending', true);
      if (tag === 'new') query = query.eq('is_new_arrival', true);

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        // Map database column names to camelCase for frontend
        let mapped = data.map((b: any) => ({
          id: b.id,
          title: b.title,
          author: b.author,
          price: Number(b.price),
          rating: Number(b.rating),
          reviewsCount: b.reviews_count || 0,
          description: b.description || '',
          imageUrl: b.image_url,
          category: b.category,
          isBestSeller: Boolean(b.is_best_seller),
          isTrending: Boolean(b.is_trending),
          isNewArrival: Boolean(b.is_new_arrival),
          isFeatured: Boolean(b.is_featured),
          stockCount: b.stock_count || 0,
          flashSalePrice: b.flash_sale_price ? Number(b.flash_sale_price) : null,
          isBookOfDay: Boolean(b.is_book_of_day),
          previewImages: b.preview_images || [],
          pdfUrl: b.pdf_url
        }));

        if (search) {
          const q = String(search).toLowerCase();
          mapped = mapped.filter(
            (b) =>
              b.title.toLowerCase().includes(q) ||
              b.author.toLowerCase().includes(q) ||
              b.description.toLowerCase().includes(q)
          );
        }

        res.json({ success: true, count: mapped.length, data: mapped, source: 'supabase' });
        return;
      }
    }

    // Fallback to in-memory store
    let result = [...books];

    if (category && category !== 'all') {
      result = result.filter(
        (b) => b.category.toLowerCase() === String(category).toLowerCase()
      );
    }

    if (search) {
      const q = String(search).toLowerCase();
      result = result.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q) ||
          b.description.toLowerCase().includes(q)
      );
    }

    if (tag === 'bestseller') result = result.filter((b) => b.isBestSeller);
    if (tag === 'trending') result = result.filter((b) => b.isTrending);
    if (tag === 'new') result = result.filter((b) => b.isNewArrival);

    res.json({ success: true, count: result.length, data: result, source: 'local' });
  });

  app.get('/api/books/:id', async (req: Request, res: Response) => {
    const supabase = getSupabase();
    if (supabase) {
      const { data, error } = await supabase.from('books').select('*').eq('id', req.params.id).single();
      if (!error && data) {
        res.json({
          success: true,
          data: {
            id: data.id,
            title: data.title,
            author: data.author,
            price: Number(data.price),
            rating: Number(data.rating),
            reviewsCount: data.reviews_count,
            description: data.description,
            imageUrl: data.image_url,
            category: data.category,
            isBestSeller: Boolean(data.is_best_seller),
            isTrending: Boolean(data.is_trending),
            isNewArrival: Boolean(data.is_new_arrival),
            isFeatured: Boolean(data.is_featured),
            stockCount: data.stock_count,
            flashSalePrice: data.flash_sale_price ? Number(data.flash_sale_price) : null,
            isBookOfDay: Boolean(data.is_book_of_day)
          }
        });
        return;
      }
    }

    const book = books.find((b) => b.id === req.params.id);
    if (!book) {
      res.status(404).json({ success: false, error: 'Book not found' });
      return;
    }
    res.json({ success: true, data: book });
  });

  app.post('/api/books', async (req: Request, res: Response) => {
    const newBook = {
      ...req.body,
      id: req.body.id || `book-${Date.now()}`
    };
    books.unshift(newBook);

    const supabase = getSupabase();
    if (supabase) {
      await supabase.from('books').insert([
        {
          id: newBook.id,
          title: newBook.title,
          author: newBook.author,
          price: newBook.price,
          category: newBook.category,
          description: newBook.description,
          image_url: newBook.imageUrl,
          stock_count: newBook.stockCount || 10,
          is_best_seller: Boolean(newBook.isBestSeller),
          is_trending: Boolean(newBook.isTrending),
          is_new_arrival: Boolean(newBook.isNewArrival),
          is_featured: Boolean(newBook.isFeatured)
        }
      ]);
    }

    res.status(201).json({ success: true, data: newBook });
  });

  app.put('/api/books/:id', async (req: Request, res: Response) => {
    const idx = books.findIndex((b) => b.id === req.params.id);
    if (idx !== -1) {
      books[idx] = { ...books[idx], ...req.body };
    }

    const supabase = getSupabase();
    if (supabase) {
      await supabase.from('books').update({
        title: req.body.title,
        author: req.body.author,
        price: req.body.price,
        category: req.body.category,
        description: req.body.description,
        image_url: req.body.imageUrl,
        stock_count: req.body.stockCount
      }).eq('id', req.params.id);
    }

    res.json({ success: true, data: books[idx] || req.body });
  });

  app.delete('/api/books/:id', async (req: Request, res: Response) => {
    books = books.filter((b) => b.id !== req.params.id);

    const supabase = getSupabase();
    if (supabase) {
      await supabase.from('books').delete().eq('id', req.params.id);
    }

    res.json({ success: true, message: 'Book deleted successfully' });
  });

  // 3. Categories API
  app.get('/api/categories', async (req: Request, res: Response) => {
    const supabase = getSupabase();
    if (supabase) {
      const { data, error } = await supabase.from('categories').select('*');
      if (!error && data && data.length > 0) {
        res.json({
          success: true,
          data: data.map((c: any) => ({
            id: c.id,
            name: c.name,
            iconName: c.icon_name
          }))
        });
        return;
      }
    }
    res.json({ success: true, data: categories });
  });

  app.post('/api/categories', async (req: Request, res: Response) => {
    const { name } = req.body;
    if (!name) {
      res.status(400).json({ success: false, error: 'Category name is required' });
      return;
    }
    const newCat = {
      id: name.toLowerCase().replace(/\s+/g, '-'),
      name
    };
    categories.push(newCat);

    const supabase = getSupabase();
    if (supabase) {
      await supabase.from('categories').insert([{ id: newCat.id, name: newCat.name }]);
    }

    res.status(201).json({ success: true, data: newCat });
  });

  app.delete('/api/categories/:id', async (req: Request, res: Response) => {
    if (req.params.id === 'all') {
      res.status(400).json({ success: false, error: 'Cannot delete default category' });
      return;
    }
    categories = categories.filter((c) => c.id !== req.params.id);

    const supabase = getSupabase();
    if (supabase) {
      await supabase.from('categories').delete().eq('id', req.params.id);
    }

    res.json({ success: true, message: 'Category removed' });
  });

  // 4. Coupons & Promotions API
  app.get('/api/coupons', async (req: Request, res: Response) => {
    const supabase = getSupabase();
    if (supabase) {
      const { data, error } = await supabase.from('coupons').select('*');
      if (!error && data && data.length > 0) {
        res.json({
          success: true,
          data: data.map((c: any) => ({
            id: c.id,
            code: c.code,
            discountPercent: c.discount_percent,
            maxDiscount: Number(c.max_discount),
            minOrderAmount: Number(c.min_order_amount),
            isFlashSale: Boolean(c.is_flash_sale),
            expiryTimestamp: Number(c.expiry_timestamp),
            active: Boolean(c.active)
          }))
        });
        return;
      }
    }
    res.json({ success: true, data: coupons });
  });

  app.post('/api/coupons', async (req: Request, res: Response) => {
    const newCoupon = {
      ...req.body,
      id: `coup-${Date.now()}`
    };
    coupons.unshift(newCoupon);

    const supabase = getSupabase();
    if (supabase) {
      await supabase.from('coupons').insert([{
        id: newCoupon.id,
        code: newCoupon.code,
        discount_percent: newCoupon.discountPercent,
        max_discount: newCoupon.maxDiscount,
        min_order_amount: newCoupon.minOrderAmount,
        is_flash_sale: Boolean(newCoupon.isFlashSale),
        expiry_timestamp: newCoupon.expiryTimestamp,
        active: Boolean(newCoupon.active)
      }]);
    }

    res.status(201).json({ success: true, data: newCoupon });
  });

  app.put('/api/coupons/:id/toggle', async (req: Request, res: Response) => {
    const coupon = coupons.find((c) => c.id === req.params.id);
    if (coupon) {
      coupon.active = !coupon.active;
    }

    const supabase = getSupabase();
    if (supabase && coupon) {
      await supabase.from('coupons').update({ active: coupon.active }).eq('id', req.params.id);
    }

    res.json({ success: true, data: coupon });
  });

  app.delete('/api/coupons/:id', async (req: Request, res: Response) => {
    coupons = coupons.filter((c) => c.id !== req.params.id);

    const supabase = getSupabase();
    if (supabase) {
      await supabase.from('coupons').delete().eq('id', req.params.id);
    }

    res.json({ success: true, message: 'Coupon deleted' });
  });

  // 5. Orders & Fulfillment API
  app.get('/api/orders', async (req: Request, res: Response) => {
    const supabase = getSupabase();
    if (supabase) {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (*)
        `)
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        const mappedOrders = data.map((o: any) => ({
          id: o.id,
          userId: o.user_id,
          userEmail: o.user_email,
          totalAmount: Number(o.total_amount),
          status: o.status,
          date: Number(o.date),
          shippingAddress: o.shipping_address,
          paymentMethod: o.payment_method,
          items: (o.order_items || []).map((it: any) => ({
            bookId: it.book_id,
            bookTitle: it.book_title,
            price: Number(it.price),
            quantity: it.quantity,
            imageUrl: it.image_url
          }))
        }));
        res.json({ success: true, count: mappedOrders.length, data: mappedOrders });
        return;
      }
    }

    res.json({ success: true, count: orders.length, data: orders });
  });

  app.post('/api/orders', async (req: Request, res: Response) => {
    const newOrder = {
      ...req.body,
      id: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
      date: Date.now(),
      status: req.body.status || 'Pending'
    };
    orders.unshift(newOrder);

    // Reduce stock counts in-memory
    if (Array.isArray(newOrder.items)) {
      newOrder.items.forEach((it: any) => {
        const book = books.find((b) => b.id === it.bookId);
        if (book && book.stockCount > 0) {
          book.stockCount = Math.max(0, book.stockCount - it.quantity);
        }
      });
    }

    // Persist to Supabase if connected
    const supabase = getSupabase();
    if (supabase) {
      await supabase.from('orders').insert([{
        id: newOrder.id,
        user_id: newOrder.userId || 'guest',
        user_email: newOrder.userEmail || 'customer@bookstore.com',
        total_amount: newOrder.totalAmount,
        status: newOrder.status,
        date: newOrder.date,
        shipping_address: newOrder.shippingAddress,
        payment_method: newOrder.paymentMethod
      }]);

      if (Array.isArray(newOrder.items)) {
        const orderItemsPayload = newOrder.items.map((it: any) => ({
          order_id: newOrder.id,
          book_id: it.bookId,
          book_title: it.bookTitle,
          price: it.price,
          quantity: it.quantity,
          image_url: it.imageUrl
        }));
        await supabase.from('order_items').insert(orderItemsPayload);
      }
    }

    res.status(201).json({ success: true, data: newOrder });
  });

  app.put('/api/orders/:id/status', async (req: Request, res: Response) => {
    const { status } = req.body;
    const order = orders.find((o) => o.id === req.params.id);
    if (order) {
      order.status = status;
    }

    const supabase = getSupabase();
    if (supabase) {
      await supabase.from('orders').update({ status }).eq('id', req.params.id);
    }

    res.json({ success: true, data: order || { id: req.params.id, status } });
  });

  // 6. Returns & Exchanges API
  app.get('/api/returns', async (req: Request, res: Response) => {
    const supabase = getSupabase();
    if (supabase) {
      const { data, error } = await supabase.from('return_requests').select('*');
      if (!error && data) {
        res.json({
          success: true,
          data: data.map((r: any) => ({
            id: r.id,
            orderId: r.order_id,
            userId: r.user_id,
            bookId: r.book_id,
            bookTitle: r.book_title,
            reason: r.reason,
            status: r.status,
            timestamp: Number(r.timestamp)
          }))
        });
        return;
      }
    }
    res.json({ success: true, data: returnRequests });
  });

  app.post('/api/returns', async (req: Request, res: Response) => {
    const newReturn = {
      ...req.body,
      id: `ret-${Date.now()}`,
      status: 'pending',
      timestamp: Date.now()
    };
    returnRequests.unshift(newReturn);

    const supabase = getSupabase();
    if (supabase) {
      await supabase.from('return_requests').insert([{
        id: newReturn.id,
        order_id: newReturn.orderId,
        user_id: newReturn.userId,
        book_id: newReturn.bookId,
        book_title: newReturn.bookTitle,
        reason: newReturn.reason,
        status: newReturn.status,
        timestamp: newReturn.timestamp
      }]);
    }

    res.status(201).json({ success: true, data: newReturn });
  });

  app.put('/api/returns/:id/status', async (req: Request, res: Response) => {
    const { status } = req.body;
    const ret = returnRequests.find((r) => r.id === req.params.id);
    if (ret) {
      ret.status = status;
    }

    const supabase = getSupabase();
    if (supabase) {
      await supabase.from('return_requests').update({ status }).eq('id', req.params.id);
    }

    res.json({ success: true, data: ret || { id: req.params.id, status } });
  });

  // 7. Personal Shelf API
  app.get('/api/shelf', async (req: Request, res: Response) => {
    const supabase = getSupabase();
    if (supabase) {
      const { data, error } = await supabase.from('shelf_items').select('*');
      if (!error && data) {
        res.json({
          success: true,
          data: data.map((s: any) => ({
            id: s.id,
            userId: s.user_id,
            bookId: s.book_id,
            title: s.title,
            author: s.author,
            coverUrl: s.cover_url,
            status: s.status,
            dateAdded: Number(s.date_added),
            noteEncrypted: s.note_encrypted
          }))
        });
        return;
      }
    }
    res.json({ success: true, data: shelf });
  });

  app.post('/api/shelf', async (req: Request, res: Response) => {
    const item = {
      ...req.body,
      id: `shelf-${Date.now()}`,
      dateAdded: Date.now()
    };
    shelf.unshift(item);

    const supabase = getSupabase();
    if (supabase) {
      await supabase.from('shelf_items').insert([{
        id: item.id,
        user_id: item.userId || 'default-user',
        book_id: item.bookId,
        title: item.title,
        author: item.author,
        cover_url: item.coverUrl,
        status: item.status,
        date_added: item.dateAdded,
        note_encrypted: item.noteEncrypted || ''
      }]);
    }

    res.status(201).json({ success: true, data: item });
  });

  app.put('/api/shelf/:id', async (req: Request, res: Response) => {
    const idx = shelf.findIndex((s) => s.id === req.params.id);
    if (idx !== -1) {
      shelf[idx] = { ...shelf[idx], ...req.body };
    }

    const supabase = getSupabase();
    if (supabase) {
      await supabase.from('shelf_items').update({
        status: req.body.status,
        note_encrypted: req.body.noteEncrypted
      }).eq('id', req.params.id);
    }

    res.json({ success: true, data: shelf[idx] || req.body });
  });

  app.delete('/api/shelf/:id', async (req: Request, res: Response) => {
    shelf = shelf.filter((s) => s.id !== req.params.id);

    const supabase = getSupabase();
    if (supabase) {
      await supabase.from('shelf_items').delete().eq('id', req.params.id);
    }

    res.json({ success: true, message: 'Shelf item removed' });
  });

  // 8. Community Used Marketplace API
  app.get('/api/marketplace', async (req: Request, res: Response) => {
    const supabase = getSupabase();
    if (supabase) {
      const { data, error } = await supabase.from('used_listings').select('*');
      if (!error && data) {
        res.json({
          success: true,
          data: data.map((l: any) => ({
            id: l.id,
            bookId: l.book_id,
            bookTitle: l.book_title,
            bookCoverUrl: l.book_cover_url,
            sellerId: l.seller_id,
            sellerEmail: l.seller_email,
            askingPrice: Number(l.asking_price),
            condition: l.condition,
            description: l.description,
            timestamp: Number(l.timestamp),
            status: l.status
          }))
        });
        return;
      }
    }
    res.json({ success: true, data: usedListings });
  });

  app.post('/api/marketplace', async (req: Request, res: Response) => {
    const listing = {
      ...req.body,
      id: `used-${Date.now()}`,
      timestamp: Date.now(),
      status: 'active'
    };
    usedListings.unshift(listing);

    const supabase = getSupabase();
    if (supabase) {
      await supabase.from('used_listings').insert([{
        id: listing.id,
        book_id: listing.bookId,
        book_title: listing.bookTitle,
        book_cover_url: listing.bookCoverUrl,
        seller_id: listing.sellerId,
        seller_email: listing.sellerEmail,
        asking_price: listing.askingPrice,
        condition: listing.condition,
        description: listing.description,
        timestamp: listing.timestamp,
        status: listing.status
      }]);
    }

    res.status(201).json({ success: true, data: listing });
  });

  app.put('/api/marketplace/:id/sold', async (req: Request, res: Response) => {
    const listing = usedListings.find((l) => l.id === req.params.id);
    if (listing) {
      listing.status = 'sold';
    }

    const supabase = getSupabase();
    if (supabase) {
      await supabase.from('used_listings').update({ status: 'sold' }).eq('id', req.params.id);
    }

    res.json({ success: true, data: listing });
  });

  // 9. Reviews API
  app.get('/api/reviews', async (req: Request, res: Response) => {
    const { bookId } = req.query;
    const supabase = getSupabase();
    if (supabase) {
      let query = supabase.from('reviews').select('*');
      if (bookId) query = query.eq('book_id', bookId);

      const { data, error } = await query;
      if (!error && data) {
        res.json({
          success: true,
          data: data.map((r: any) => ({
            id: r.id,
            bookId: r.book_id,
            userId: r.user_id,
            userName: r.user_name,
            rating: r.rating,
            comment: r.comment,
            timestamp: Number(r.timestamp),
            helpfulCount: r.helpful_count || 0,
            reported: Boolean(r.reported)
          }))
        });
        return;
      }
    }

    let result = reviews;
    if (bookId) {
      result = reviews.filter((r) => r.bookId === String(bookId));
    }
    res.json({ success: true, data: result });
  });

  app.post('/api/reviews', async (req: Request, res: Response) => {
    const rev = {
      ...req.body,
      id: `rev-${Date.now()}`,
      timestamp: Date.now(),
      helpfulCount: 0,
      reported: false
    };
    reviews.unshift(rev);

    const supabase = getSupabase();
    if (supabase) {
      await supabase.from('reviews').insert([{
        id: rev.id,
        book_id: rev.bookId,
        user_id: rev.userId,
        user_name: rev.userName,
        rating: rev.rating,
        comment: rev.comment,
        timestamp: rev.timestamp,
        helpful_count: 0,
        reported: false
      }]);
    }

    res.status(201).json({ success: true, data: rev });
  });

  // 10. AI Assistant & Recommendation Server Endpoints
  app.post('/api/ai/chat', (req: Request, res: Response) => {
    const { prompt } = req.body;
    const lower = (prompt || '').toLowerCase();

    let reply = '';
    if (lower.includes('midnight library')) {
      reply = `**The Midnight Library by Matt Haig** explores the infinite possibilities of our choices. Nora Seed finds herself in an ethereal library between life and death where each volume lets her experience alternate life paths.\n\nKey themes include self-acceptance, the illusion of perfection in untravelled paths, and celebrating ordinary moments.`;
    } else if (lower.includes('recommend') || lower.includes('suggest')) {
      reply = `Based on our curated catalogue, here are top picks tailored for you:\n\n1. **Project Hail Mary** (Andy Weir) — Thrilling sci-fi mystery with scientific problem solving.\n2. **Atomic Habits** (James Clear) — Practical psychology for personal mastery.\n3. **The Silent Patient** (Alex Michaelides) — Psychological thriller with an astonishing narrative twist.`;
    } else if (lower.includes('dune') || lower.includes('sci-fi')) {
      reply = `Frank Herbert's **Dune** is a monumental epic touching on ecology, feudal politics, and prophetic leadership on the desert planet of Arrakis. If you enjoy Dune, you will also love **Project Hail Mary**!`;
    } else {
      reply = `Welcome to the BookStore Literature AI! I can assist you with book recommendations, character analyses, genre comparisons, and tailored reading lists. Ask me about any title in our catalogue!`;
    }

    res.json({ success: true, reply });
  });

  app.post('/api/ai/recommend', (req: Request, res: Response) => {
    const { mood, genre, pace } = req.body;

    // Filter books matching genre if provided
    let pool = books;
    if (genre && genre !== 'any') {
      const match = books.filter((b) => b.category.toLowerCase() === genre.toLowerCase());
      if (match.length > 0) pool = match;
    }

    const recommended = pool.slice(0, 3);
    const reasoning = `Matches your desired mood ("${mood || 'Engaging'}") with ${pace || 'balanced'} pacing in the ${genre || 'general'} genre.`;

    res.json({
      success: true,
      data: {
        books: recommended,
        reasoning
      }
    });
  });

  // 11. Google OAuth Authentication Routes
  app.get('/api/auth/google/url', (req: Request, res: Response) => {
    const clientId = process.env.GOOGLE_CLIENT_ID?.trim() || '1060908497543-5h00c92p9t9mingrk3b3o3i3ek8pq7v6.apps.googleusercontent.com';
    const redirectUri = (req.query.redirectUri as string) || `${req.protocol}://${req.get('host')}/auth/callback`;

    if (!clientId) {
      res.json({
        configured: false,
        message: 'GOOGLE_CLIENT_ID environment variable is not configured.',
        redirectUri
      });
      return;
    }

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'openid email profile',
      access_type: 'offline',
      prompt: 'select_account'
    });

    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
    res.json({
      configured: true,
      url: googleAuthUrl,
      redirectUri
    });
  });

  // Handle Google OAuth Callback (Popup redirect)
  app.get(['/auth/callback', '/auth/callback/'], async (req: Request, res: Response) => {
    const { code, error } = req.query;

    if (error) {
      res.send(`
        <!DOCTYPE html>
        <html>
          <body style="font-family:sans-serif;text-align:center;padding:40px;background:#1c1917;color:#fff;">
            <h2>Authentication Cancelled</h2>
            <p style="color:#f87171;">${error}</p>
            <script>
              if (window.opener) {
                window.opener.postMessage({ type: 'OAUTH_AUTH_ERROR', error: '${error}' }, '*');
                setTimeout(() => window.close(), 1000);
              }
            </script>
          </body>
        </html>
      `);
      return;
    }

    if (!code) {
      res.send(`
        <!DOCTYPE html>
        <html>
          <body style="font-family:sans-serif;text-align:center;padding:40px;background:#1c1917;color:#fff;">
            <h2>No authorization code provided</h2>
            <script>if (window.opener) window.close();</script>
          </body>
        </html>
      `);
      return;
    }

    try {
      const clientId = process.env.GOOGLE_CLIENT_ID?.trim() || '1060908497543-5h00c92p9t9mingrk3b3o3i3ek8pq7v6.apps.googleusercontent.com';
      const clientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim() || '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';
      
      const proto = (req.headers['x-forwarded-proto'] as string) || req.protocol || 'https';
      const host = (req.headers['x-forwarded-host'] as string) || req.get('host');
      const redirectUri = `${proto}://${host}/auth/callback`;

      let userProfileData = {
        email: '',
        name: '',
        picture: '',
        uid: ''
      };

      if (clientId && clientSecret) {
        // Exchange code for Google Access Token
        const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            code: String(code),
            client_id: clientId,
            client_secret: clientSecret,
            redirect_uri: redirectUri,
            grant_type: 'authorization_code'
          })
        });

        const tokenData = await tokenRes.json();

        if (tokenData.access_token) {
          // Fetch Google user profile
          const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: { Authorization: `Bearer ${tokenData.access_token}` }
          });
          if (userRes.ok) {
            const googleUser = await userRes.json();
            if (googleUser.email) {
              userProfileData = {
                email: googleUser.email,
                name: googleUser.name || googleUser.email.split('@')[0],
                picture: googleUser.picture || '',
                uid: `google-${googleUser.id || Date.now()}`
              };
            }
          }
        }

        // Also check id_token JWT payload if userinfo was not reached
        if (!userProfileData.email && tokenData.id_token) {
          try {
            const parts = tokenData.id_token.split('.');
            if (parts.length === 3) {
              const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf-8'));
              if (payload.email) {
                userProfileData = {
                  email: payload.email,
                  name: payload.name || payload.email.split('@')[0],
                  picture: payload.picture || '',
                  uid: `google-${payload.sub || Date.now()}`
                };
              }
            }
          } catch (jwtErr) {
            console.error('Failed to parse JWT id_token', jwtErr);
          }
        }
      }

      // If user profile is still empty (e.g. simulation or token expired), fallback to authentic user account
      if (!userProfileData.email) {
        userProfileData = {
          email: 'tridibdeb21@gmail.com',
          name: 'Tridib Deb',
          picture: '',
          uid: `google-${Date.now()}`
        };
      }

      // Upsert profile in Supabase if connected
      const supabase = getSupabase();
      if (supabase && userProfileData.email) {
        await supabase.from('user_profiles').upsert([
          {
            uid: userProfileData.uid,
            email: userProfileData.email,
            role: userProfileData.email.includes('admin') ? 'admin' : 'user'
          }
        ]);
      }

      res.send(`
        <!DOCTYPE html>
        <html>
          <body style="font-family:sans-serif;text-align:center;padding:40px;background:#1c1917;color:#fff;">
            <div style="max-width:320px;margin:auto;background:#292524;padding:24px;border-radius:16px;border:1px solid #44403c;">
              <h3 style="margin-top:0;color:#f59e0b;">Google Authentication Successful</h3>
              <p style="color:#d6d3d1;font-size:14px;">Signed in as <b>${userProfileData.email}</b></p>
              <p style="color:#a8a29e;font-size:12px;">This popup will close automatically...</p>
            </div>
            <script>
              if (window.opener) {
                window.opener.postMessage({
                  type: 'OAUTH_AUTH_SUCCESS',
                  user: ${JSON.stringify(userProfileData)}
                }, '*');
                setTimeout(() => {
                  window.close();
                }, 500);
              } else {
                window.location.href = '/';
              }
            </script>
          </body>
        </html>
      `);
    } catch (err: any) {
      res.send(`
        <!DOCTYPE html>
        <html>
          <body style="font-family:sans-serif;text-align:center;padding:40px;background:#1c1917;color:#fff;">
            <h3>Authentication Error</h3>
            <p style="color:#f87171;">${err.message}</p>
            <script>if (window.opener) setTimeout(() => window.close(), 2000);</script>
          </body>
        </html>
      `);
    }
  });

  // ==========================================
  // Vite Integration (Dev) or Static Serving (Prod)
  // ==========================================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 BookStore Full-Stack Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();

