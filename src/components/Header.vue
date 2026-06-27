<script setup lang="ts">
import { ref } from "vue";
import { Search, Heart, ShoppingCart, User, Menu, X, Store } from "lucide-vue-next";
import { ActiveTab } from "../types";

const props = defineProps<{
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  cartCount: number;
  wishlistCount: number;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  triggerRouteAnimation: (targetTab: ActiveTab) => void;
  setProfileActiveSubTab?: (tab: "account" | "orders" | "wishlist") => void;
  profileActiveSubTab?: "account" | "orders" | "wishlist";
  isLoggedIn?: boolean;
  userProfile?: { fullName: string; avatar: string };
}>();

const mobileMenuOpen = ref(false);
const mobileSearchVisible = ref(false);

const handleNavClick = (tab: ActiveTab) => {
  console.log('Navbar click:', tab);
  props.triggerRouteAnimation(tab);
  mobileMenuOpen.value = false;
};

const handleProfileSubNavClick = (tab: ActiveTab, subTab: "account" | "orders" | "wishlist") => {
  if (props.setProfileActiveSubTab) {
    props.setProfileActiveSubTab(subTab);
  }
  props.triggerRouteAnimation(tab);
  mobileMenuOpen.value = false;
};

const handleSearchInput = (e: Event) => {
  const value = (e.target as HTMLInputElement).value;
  props.setSearchQuery(value);
  if (props.activeTab !== "shop") {
    props.triggerRouteAnimation("shop");
  }
};
</script>

<template>
  <header class="bg-white border-b border-slate-100 shadow-xs sticky top-0 z-50 transition-colors duration-300">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16 gap-4">
        
        <!-- Brand Logo - Apple/Shopify styling with #2563EB (blue-600) -->
        <button
          @click="handleNavClick('home')"
          class="flex items-center gap-2 font-headline text-2xl font-bold text-blue-600 tracking-tight cursor-pointer"
        >
          <Store class="w-6 h-6 text-blue-600" />
          <span>MarketPlace</span>
        </button>

        <!-- Desktop Navigation Links -->
        <nav class="hidden md:flex space-x-6 lg:space-x-8 items-center">
          <button
            @click="handleNavClick('home')"
            class="font-sans font-medium text-sm transition-all pb-1 cursor-pointer border-b-2"
            :class="activeTab === 'home'
              ? 'text-blue-600 border-blue-600 font-semibold'
              : 'text-slate-500 hover:text-blue-600 border-transparent'"
          >
            Home
          </button>
          <button
            @click="handleNavClick('shop')"
            class="font-sans font-medium text-sm transition-all pb-1 cursor-pointer border-b-2"
            :class="activeTab === 'shop' || activeTab === 'product-detail'
              ? 'text-blue-600 border-blue-600 font-semibold'
              : 'text-slate-500 hover:text-blue-600 border-transparent'"
          >
            Products
          </button>
        </nav>

        <!-- Search Bar - Desktop -->
        <div class="hidden md:flex relative flex-1 max-w-sm mx-4">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <Search class="w-4 h-4" />
          </span>
          <input
            type="text"
            :value="searchQuery"
            @input="handleSearchInput"
            placeholder="Search products..."
            class="w-full h-10 pl-10 pr-12 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
          />
          <button
            v-if="searchQuery"
            @click="setSearchQuery('')"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-medium"
          >
            Clear
          </button>
        </div>

        <!-- Action Icons -->
        <div class="flex items-center gap-2 sm:gap-4">
          <!-- Mobile Search Trigger -->
          <button
            @click="mobileSearchVisible = !mobileSearchVisible"
            class="md:hidden p-2 text-slate-600 hover:bg-slate-50 rounded-full transition-colors cursor-pointer"
            title="Search products"
          >
            <Search class="w-5 h-5" />
          </button>

          <!-- Wishlist Button -->
          <button
            @click="handleNavClick('wishlist')"
            class="p-2 rounded-full transition-colors relative group cursor-pointer"
            :class="activeTab === 'wishlist' ? 'bg-rose-50 text-rose-600' : 'text-slate-600 hover:bg-slate-100'"
            title="View Wishlist"
          >
            <Heart
              class="w-5 h-5 group-hover:text-rose-500 transition-colors"
              :class="{ 'fill-rose-500 text-rose-500': activeTab === 'wishlist' }"
            />
            <span v-if="wishlistCount > 0" class="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {{ wishlistCount }}
            </span>
          </button>

          <!-- Cart Button -->
          <button
            @click="handleNavClick('cart')"
            class="p-2 rounded-full transition-colors relative group cursor-pointer"
            :class="activeTab === 'cart' ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-100'"
            title="Open Shopping Cart"
          >
            <ShoppingCart class="w-5 h-5 group-hover:text-blue-600 transition-colors" />
            <span v-if="cartCount > 0" class="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
              {{ cartCount }}
            </span>
          </button>

          <!-- Account Dashboard Button -->
          <button
            v-if="!isLoggedIn"
            @click="handleNavClick('profile')"
            class="p-2 rounded-full transition-colors cursor-pointer"
            :class="activeTab === 'profile' ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-100'"
            title="Profile Dashboard"
          >
            <User class="w-5 h-5" />
          </button>
          
          <!-- User Avatar (when logged in) -->
          <button
            v-else
            @click="handleNavClick('profile')"
            class="w-8 h-8 rounded-full overflow-hidden transition-all cursor-pointer border-2 border-transparent hover:border-blue-500"
            :class="activeTab === 'profile' ? 'border-blue-500 ring-2 ring-blue-200' : ''"
            title="My Account"
          >
            <img
              v-if="userProfile?.avatar"
              :src="userProfile.avatar"
              :alt="userProfile.fullName"
              class="w-full h-full object-cover"
            />
            <div
              v-else
              class="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-xs flex items-center justify-center"
            >
              {{ userProfile?.fullName?.charAt(0).toUpperCase() || 'U' }}
            </div>
          </button>

          <!-- Mobile Menu Toggle Button -->
          <button
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="md:hidden p-2 text-slate-600 hover:bg-slate-50 rounded-full transition-all cursor-pointer"
          >
            <X v-if="mobileMenuOpen" class="w-5 h-5" />
            <Menu v-else class="w-5 h-5" />
          </button>
        </div>

      </div>

      <!-- Mobile Search Dropdown -->
      <div v-if="mobileSearchVisible" class="md:hidden py-3 border-t border-slate-100">
        <div class="relative w-full">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <Search class="w-4 h-4" />
          </span>
          <input
            type="text"
            :value="searchQuery"
            @input="handleSearchInput"
            placeholder="Search products..."
            class="w-full h-11 pl-10 pr-10 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
          />
          <button
            v-if="searchQuery"
            @click="setSearchQuery('')"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <X class="w-4 h-4" />
          </button>
        </div>
      </div>

      <!-- Mobile Navigation Menu Dropdown -->
      <div v-if="mobileMenuOpen" class="md:hidden py-3 border-t border-slate-100 flex flex-col gap-2">
        <button
          @click="handleNavClick('home')"
          class="w-full text-left py-2 px-3 rounded-lg text-sm font-medium transition-colors"
          :class="activeTab === 'home' ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-slate-600 hover:bg-slate-50'"
        >
          Home
        </button>
        <button
          @click="handleNavClick('shop')"
          class="w-full text-left py-2 px-3 rounded-lg text-sm font-medium transition-colors"
          :class="activeTab === 'shop' || activeTab === 'product-detail' ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-slate-600 hover:bg-slate-50'"
        >
          Products
        </button>
        <button
          @click="handleNavClick('wishlist')"
          class="w-full text-left py-2 px-3 rounded-lg text-sm font-medium transition-colors"
          :class="activeTab === 'wishlist' ? 'bg-rose-50 text-rose-600 font-semibold' : 'text-slate-600 hover:bg-slate-50'"
        >
          Wishlist ({{ wishlistCount }})
        </button>
        <button
          @click="handleNavClick('cart')"
          class="w-full text-left py-2 px-3 rounded-lg text-sm font-medium transition-colors"
          :class="activeTab === 'cart' || activeTab === 'checkout' ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-slate-600 hover:bg-slate-50'"
        >
          Cart ({{ cartCount }})
        </button>
        <button
          @click="handleProfileSubNavClick('profile', 'orders')"
          class="w-full text-left py-2 px-3 rounded-lg text-sm font-medium transition-colors"
          :class="activeTab === 'profile' && profileActiveSubTab === 'orders' ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-slate-600 hover:bg-slate-50'"
        >
          Order History
        </button>
        <button
          @click="handleProfileSubNavClick('profile', 'account')"
          class="w-full text-left py-2 px-3 rounded-lg text-sm font-medium transition-colors"
          :class="activeTab === 'profile' && profileActiveSubTab === 'account' ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-slate-600 hover:bg-slate-50'"
        >
          Register / Login
        </button>
      </div>

    </div>
  </header>
</template>
