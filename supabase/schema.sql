-- ==============================================================================
-- BookStore PostgreSQL / Supabase Database Schema & Initial Data
-- Run this in your Supabase SQL Editor (https://app.supabase.com/project/_/sql)
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Drop existing tables if re-running (in reverse dependency order)
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS return_requests CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS shelf_items CASCADE;
DROP TABLE IF EXISTS used_listings CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;
DROP TABLE IF EXISTS coupons CASCADE;
DROP TABLE IF EXISTS books CASCADE;
DROP TABLE IF EXISTS categories CASCADE;

-- ==========================================
-- TABLES DEFINITION
-- ==========================================

-- Categories Table
CREATE TABLE categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    icon_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Books Table
CREATE TABLE books (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    rating NUMERIC(3, 2) DEFAULT 5.0,
    reviews_count INT DEFAULT 0,
    description TEXT,
    image_url TEXT,
    category TEXT REFERENCES categories(id) ON DELETE SET NULL,
    is_best_seller BOOLEAN DEFAULT FALSE,
    is_trending BOOLEAN DEFAULT FALSE,
    is_new_arrival BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    stock_count INT DEFAULT 10,
    flash_sale_price NUMERIC(10, 2),
    flash_sale_expiry BIGINT,
    is_book_of_day BOOLEAN DEFAULT FALSE,
    preview_images JSONB DEFAULT '[]'::jsonb,
    pdf_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Coupons Table
CREATE TABLE coupons (
    id TEXT PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    discount_percent INT NOT NULL,
    max_discount NUMERIC(10, 2) NOT NULL,
    min_order_amount NUMERIC(10, 2) DEFAULT 0.00,
    is_flash_sale BOOLEAN DEFAULT FALSE,
    expiry_timestamp BIGINT NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Profiles Table
CREATE TABLE user_profiles (
    uid TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    profile_image TEXT,
    reading_streak INT DEFAULT 0,
    yearly_goal INT DEFAULT 12,
    books_finished_this_year INT DEFAULT 0,
    unlocked_badges JSONB DEFAULT '[]'::jsonb,
    wishlist JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders Table
CREATE TABLE orders (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    user_email TEXT NOT NULL,
    total_amount NUMERIC(10, 2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled')),
    date BIGINT NOT NULL,
    shipping_address JSONB NOT NULL,
    payment_method TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order Items Table
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id TEXT REFERENCES orders(id) ON DELETE CASCADE,
    book_id TEXT REFERENCES books(id) ON DELETE SET NULL,
    book_title TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Personal Shelf Items Table
CREATE TABLE shelf_items (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    book_id TEXT REFERENCES books(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    cover_url TEXT,
    status TEXT NOT NULL DEFAULT 'To Read' CHECK (status IN ('To Read', 'Reading', 'Finished')),
    date_added BIGINT NOT NULL,
    note_encrypted TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Community Used Book Marketplace Table
CREATE TABLE used_listings (
    id TEXT PRIMARY KEY,
    book_id TEXT,
    book_title TEXT NOT NULL,
    book_cover_url TEXT,
    seller_id TEXT NOT NULL,
    seller_email TEXT NOT NULL,
    asking_price NUMERIC(10, 2) NOT NULL,
    condition TEXT NOT NULL CHECK (condition IN ('Like New', 'Good', 'Acceptable')),
    description TEXT,
    timestamp BIGINT NOT NULL,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'sold')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reviews Table
CREATE TABLE reviews (
    id TEXT PRIMARY KEY,
    book_id TEXT REFERENCES books(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL,
    user_name TEXT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    timestamp BIGINT NOT NULL,
    helpful_count INT DEFAULT 0,
    reported BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Return Requests Table
CREATE TABLE return_requests (
    id TEXT PRIMARY KEY,
    order_id TEXT REFERENCES orders(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL,
    book_id TEXT NOT NULL,
    book_title TEXT NOT NULL,
    reason TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    timestamp BIGINT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE shelf_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE used_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE return_requests ENABLE ROW LEVEL SECURITY;

-- Allow public read access to catalog, coupons, reviews, marketplace
CREATE POLICY "Public Read Categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public Read Books" ON books FOR SELECT USING (true);
CREATE POLICY "Public Read Coupons" ON coupons FOR SELECT USING (true);
CREATE POLICY "Public Read Reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "Public Read Marketplace" ON used_listings FOR SELECT USING (true);

-- Allow full access for anon/service role in development
CREATE POLICY "Full Access Categories" ON categories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Full Access Books" ON books FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Full Access Coupons" ON coupons FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Full Access Orders" ON orders FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Full Access Order Items" ON order_items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Full Access Shelf" ON shelf_items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Full Access Marketplace" ON used_listings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Full Access Reviews" ON reviews FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Full Access Return Requests" ON return_requests FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Full Access User Profiles" ON user_profiles FOR ALL USING (true) WITH CHECK (true);

-- ==========================================
-- SEED INITIAL DATA
-- ==========================================

-- Seed Categories
INSERT INTO categories (id, name, icon_name) VALUES
('all', 'All Genres', 'BookOpen'),
('fiction', 'Fiction', 'Sparkles'),
('non-fiction', 'Non-Fiction', 'Compass'),
('sci-fi', 'Sci-Fi & Fantasy', 'Rocket'),
('mystery', 'Mystery & Thriller', 'Search'),
('business', 'Business & Tech', 'Briefcase'),
('self-help', 'Self-Help', 'Smile');

-- Seed Books
INSERT INTO books (id, title, author, price, rating, reviews_count, description, image_url, category, is_best_seller, is_trending, is_new_arrival, is_featured, stock_count, flash_sale_price, is_book_of_day) VALUES
('1', 'The Midnight Library', 'Matt Haig', 18.99, 4.8, 1240, 'Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived.', 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600', 'fiction', true, true, false, true, 15, 12.99, true),
('2', 'Atomic Habits', 'James Clear', 21.50, 4.9, 3420, 'No matter your goals, Atomic Habits offers a proven framework for improving--every day. James Clear reveals practical strategies to master tiny behaviors.', 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=600', 'self-help', true, true, false, true, 28, NULL, false),
('3', 'Project Hail Mary', 'Andy Weir', 19.99, 4.9, 980, 'Ryland Grace is the sole survivor on a desperate, last-chance mission—and if he fails, humanity and the earth itself are doomed.', 'https://images.unsplash.com/photo-1618609377864-68609b857e90?auto=format&fit=crop&q=80&w=600', 'sci-fi', false, true, true, true, 8, 14.50, false),
('4', 'The Psychology of Money', 'Morgan Housel', 17.20, 4.7, 850, 'Timeless lessons on wealth, greed, and happiness doing well with money isn’t necessarily about what you know. It’s about how you behave.', 'https://images.unsplash.com/photo-1592496431122-2349e0fbc666?auto=format&fit=crop&q=80&w=600', 'business', true, false, false, false, 12, NULL, false),
('5', 'The Silent Patient', 'Alex Michaelides', 15.80, 4.6, 2100, 'Alicia Berenson’s life is seemingly perfect. One evening she shoots her husband five times in the face, and then never speaks another word.', 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=600', 'mystery', false, false, false, true, 5, NULL, false),
('6', 'Klara and the Sun', 'Kazuo Ishiguro', 16.50, 4.5, 620, 'A thrilling book that offers a look at our rapidly changing modern world through the eyes of an unforgettable narrator.', 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=600', 'sci-fi', false, false, true, false, 20, NULL, false);

-- Seed Coupons
INSERT INTO coupons (id, code, discount_percent, max_discount, min_order_amount, is_flash_sale, expiry_timestamp, active) VALUES
('c1', 'WELCOME10', 10, 15.00, 20.00, false, 1798761600000, true),
('c2', 'SUMMER20', 20, 30.00, 50.00, true, 1798761600000, true),
('c3', 'BOOKWORM15', 15, 20.00, 35.00, false, 1798761600000, true);

-- Seed Initial Reviews
INSERT INTO reviews (id, book_id, user_id, user_name, rating, comment, timestamp, helpful_count, reported) VALUES
('r1', '1', 'u1', 'Sarah Jenkins', 5, 'An utterly mesmerizing concept! It made me rethink so many choices in life with empathy.', 1709120000000, 14, false),
('r2', '2', 'u2', 'Marcus Vance', 5, 'The 1% daily improvement rule changed my daily morning routine completely. Essential read.', 1709210000000, 23, false),
('r3', '3', 'u3', 'Elena Rostova', 5, 'Rocky is hands down the best sci-fi character written in the last decade. Amaze!', 1709290000000, 45, false);

-- Seed User Profile
INSERT INTO user_profiles (uid, email, role, reading_streak, yearly_goal, books_finished_this_year, unlocked_badges, wishlist) VALUES
('default-user', 'reader@bookstore.dev', 'admin', 7, 24, 6, '["streak_master", "early_bird", "genre_explorer"]'::jsonb, '["3", "6"]'::jsonb);
