# 📚 BookStore Web Application

A comprehensive, curated bookstore application ported to **React 18**, **TypeScript**, and **Tailwind CSS**, featuring AI book recommendations, personal bookshelf management with encrypted notes, community pre-owned marketplace, order tracking, and a full administrator operations suite.

## ✨ Features

### 👤 Customer Experience
- **Curated Catalogue & Search:** Filter by genres (Fiction, Sci-Fi, Mystery, Non-Fiction, etc.) and search by author or keyword in real-time.
- **Book Previews & Audio Reader:** Interactive sample chapter excerpt reader with page navigation and Web Speech API audio narration.
- **AI Literature Assistant & Matcher:** Conversational AI powered by Gemini/Groq for plot analysis, author insights, reading mood matching, and review summarization.
- **Personal Bookshelf & Time Capsules:** Organize reading status (`To Read`, `Reading`, `Finished`) with AES-encrypted reflection notes that unlock upon completing each book.
- **Pre-Owned Book Marketplace:** Browse gently used books listed by the reader community or post your own copies with condition ratings.
- **Cart & Checkout:** Dynamic subtotal calculation, coupon promo code engine (`WELCOME20`, `FLASH50`), and shipping address fulfillment.
- **Order Tracking & Returns:** Track order progression (`Pending` ➔ `Processing` ➔ `Shipped` ➔ `Delivered`) and submit return requests with custom justifications.
- **Reading Profiles & Badges:** Track annual reading targets, daily reading streaks, and unlock achievement badges.

### 🛡️ Administrator Operations Center
- **Inventory & Catalogue Manager:** Full CRUD for book inventory, stock tracking, and metadata tagging (Bestseller, Trending, New Arrival).
- **Order Fulfillment Pipeline:** Transition customer orders across fulfillment statuses with real-time feedback.
- **Flash Sales & Spotlight Control:** Launch limited-time countdown discount sales and designate the featured *Book of the Day*.
- **Promo Codes & Coupons:** Configure discount percentages, minimum order thresholds, and maximum discount caps.
- **Return Requests Management:** Review, approve, or reject customer return and refund tickets.
- **Sales Telemetry & Analytics:** Monitor gross revenue, order completion ratios, and top-performing book titles.

## 🛠️ Technology Stack
- **Framework:** React 18 + Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **State Management:** React Context + LocalStorage Persistence

## 🚀 Running Locally
```bash
npm install
npm run dev
```
The application will be accessible at `http://localhost:3000`.
