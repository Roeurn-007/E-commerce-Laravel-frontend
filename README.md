# E-Commerce Frontend (Vue.js)

A modern, responsive Vue.js 3 e-commerce storefront that provides a complete shopping experience with real-time API synchronization.

## Features

### Customer-Facing Pages
- **Home Page** - Featured products, promotional modal, hero section
- **Product Catalog** - Browse all products with search and category filtering
- **Product Details** - View product information, reviews, add to cart/wishlist
- **Shopping Cart** - Manage cart items, update quantities, remove items
- **Checkout** - Complete purchase with shipping address and optional coupon
- **Order History** - View past orders with detailed status
- **Wishlist** - Save favorite products for later
- **User Profile** - Manage account details, update avatar, change password
- **Authentication** - Login and registration forms

### Key Functionality
- **Real-time API Sync** - Automatically syncs with Laravel backend when available
- **Offline Mode** - Works with local data when backend is unavailable
- **Token Authentication** - Secure API access with Bearer tokens stored in localStorage
- **Shopping Cart** - Persistent cart with optimistic UI updates
- **Wishlist Management** - Save and manage favorite products
- **Product Search** - Search products by name and category
- **Category Filtering** - Filter products by category
- **Product Reviews** - View and submit product reviews (requires login)
- **Responsive Design** - Mobile-first design with smooth animations
- **Toast Notifications** - User-friendly feedback messages

## Tech Stack

- **Framework**: Vue.js 3 (Composition API with `<script setup>`)
- **Language**: TypeScript
- **Build Tool**: Vite
- **State Management**: Vue 3 Reactivity System (ref, computed, watch)
- **HTTP Client**: Native Fetch API
- **Styling**: Tailwind CSS
- **Icons**: Font Awesome (via CDN or SVG icons)
- **Storage**: Browser localStorage for persistence

## Requirements

- Node.js 16+
- npm or yarn
- Modern web browser (Chrome, Firefox, Safari, Edge)

## Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

## Configuration

The frontend is configured to connect to the Laravel backend API at `http://localhost:8000/api` by default. You can change this through:

1. **API Settings Modal** - Click the gear icon in the footer to open API settings
2. **localStorage** - The API URL is stored in `marketplace_api_url` in browser localStorage
3. **Auto-sync** - Enable/disable automatic synchronization with the backend via `marketplace_api_autosync`

## Project Structure

```
frontend/src/
├── App.vue                 # Main application component with state management
├── main.ts                 # Application entry point
├── types.ts                # TypeScript type definitions
├── data.ts                 # Static product data (offline fallback)
├── index.css               # Global styles
├── components/
│   ├── Header.vue          # Navigation header with cart/wishlist counts
│   ├── Footer.vue          # Site footer
│   ├── HomeView.vue        # Home page with featured products
│   ├── CatalogView.vue     # Product listing with search/filter
│   ├── ProductDetailView.vue  # Individual product page
│   ├── CartView.vue        # Shopping cart management
│   ├── CheckoutView.vue    # Checkout process
│   ├── WishlistView.vue    # User wishlist
│   ├── ProfileView.vue     # User profile and order history
│   ├── Toasts.vue          # Toast notification component
│   ├── PromoModal.vue      # Promotional popup modal
│   └── ApiSettingsModal.vue # API configuration modal
└── assets/                 # Static assets (images, fonts)
```

## Key Components

### State Management
The app uses Vue 3's reactive system for global state:
- `products` - Product catalog (synced with API or local)
- `cart` - Shopping cart items
- `wishlist` - Saved favorite products
- `orders` - User order history
- `userProfile` - Current user information
- `authToken` - API authentication token
- `isLoggedIn` - Authentication status

### API Integration
- **Public Endpoints**: Products, categories, reviews (no auth required)
- **Protected Endpoints**: Cart, wishlist, checkout, orders, profile (requires Bearer token)
- **Optimistic Updates**: UI updates immediately, syncs with backend in background
- **Error Handling**: Automatic fallback to offline mode if API unavailable

## Usage

### Browsing Products
1. Visit the home page to see featured products
2. Navigate to "Shop" to browse all products
3. Use the search bar to find specific products
4. Filter products by category using the category dropdown

### Managing Cart
1. Click "Add to Cart" on any product
2. View cart by clicking the cart icon in the header
3. Update quantities or remove items
4. Proceed to checkout when ready

### Checkout Process
1. Must be logged in to checkout
2. Enter shipping address
3. (Optional) Apply coupon code `OFFER25` for 25% discount
4. Review order summary
5. Place order

### Login/Registration
1. Click "Login" in the header
2. Enter email and password, or register a new account
3. Once logged in, access wishlist, orders, and profile features

## API Connection

The frontend expects the Laravel backend to be running. To connect:
1. Ensure backend is running at `http://localhost:8000`
2. Open API Settings (gear icon in footer)
3. Set API URL to `http://localhost:8000/api`
4. Click "Test Connection" to verify
5. Click "Sync Products" to load products from the API

## Development

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Lint Code
```bash
npm run lint
```

## Features in Detail

### Responsive Design
- Mobile-optimized layouts
- Hamburger menu for mobile navigation
- Touch-friendly interface elements

### Offline Capabilities
- Products cached in localStorage
- Cart persists across sessions
- Graceful degradation when API is unavailable

### User Experience
- Smooth page transitions and animations
- Loading indicators
- Toast notifications for feedback
- Form validation
- Image lazy loading
- Product rating displays

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is open-source and available under the MIT License.
