<script setup lang="ts">
import { Heart, Eye, ShoppingCart, Trash2, ArrowLeft, ImageOff, ShoppingBag, Sparkles } from "lucide-vue-next";
import { Product, ActiveTab } from "../types";

const props = defineProps<{
  wishlist: Product[];
  toggleWishlist: (product: Product) => void;
  addToCart: (product: Product, quantity: number, color?: string) => void;
  triggerRouteAnimation: (targetTab: ActiveTab, prodId?: string) => void;
  setSelectedProductId: (id: string) => void;
  addToast: (message: string, type: "success" | "error" | "info") => void;
  isLoggedIn?: boolean;
  setProfileActiveSubTab?: (tab: "account" | "orders" | "wishlist") => void;
}>();

const openProduct = (id: string) => {
  props.setSelectedProductId(id);
  props.triggerRouteAnimation("product-detail", id);
};

const handleQuickBuy = (prod: Product) => {
  props.addToCart(prod, 1);
};
</script>

<template>
  <div v-if="isLoggedIn === false" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
    <div class="max-w-md mx-auto bg-white border border-slate-100/80 rounded-[2rem] p-8 shadow-md relative overflow-hidden space-y-6">
      <div class="absolute top-[-30%] right-[-20%] w-60 h-60 bg-blue-500/5 blur-[60px] rounded-full pointer-events-none" />
      <div class="absolute bottom-[-30%] left-[-20%] w-60 h-60 bg-indigo-500/5 blur-[60px] rounded-full pointer-events-none" />

      <!-- Locked Heart Icon -->
      <div class="w-16 h-16 bg-rose-50 text-rose-500 rounded-[1.2rem] flex items-center justify-center mx-auto border border-rose-100 shadow-2xs">
        <Heart className="w-8 h-8 fill-rose-100 animate-pulse" />
      </div>

      <div class="space-y-1.5 relative z-10 text-center">
        <h2 class="text-xl font-black text-slate-900 font-headline tracking-tight">
          Unlock Your Favorites
        </h2>
        <p class="text-xs text-slate-450 font-medium leading-relaxed max-w-sm mx-auto">
          Keep a personalized storage vault for items you love. Register or login to synchronize lists across multiple sessions safely.
        </p>
      </div>

      <button
        @click="if (setProfileActiveSubTab) setProfileActiveSubTab('account'); triggerRouteAnimation('profile')"
        class="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
      >
        Sign In / Register
      </button>
    </div>
  </div>

  <div v-else class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in text-left">
    <!-- Elegant Navigation Breadcrumb -->
    <div class="flex items-center justify-between">
      <button
        @click="triggerRouteAnimation('shop')"
        class="flex items-center gap-2 text-xs font-black tracking-widest uppercase text-slate-500 hover:text-blue-600 transition-colors cursor-pointer group"
      >
        <ArrowLeft class="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span>Keep Shopping</span>
      </button>

      <span class="text-[10px] bg-rose-50 text-rose-600 border border-rose-100/60 px-2.5 py-1 rounded-full font-bold tracking-wider uppercase flex items-center gap-1.5">
        <Heart class="w-3 h-3 fill-rose-500 text-rose-500" />
        <span>My Saved Items</span>
      </span>
    </div>

    <!-- Compact Wishlist Header Card -->
    <div class="bg-white border border-slate-100/80 shadow-xs rounded-[1.5rem] p-5 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-5">
      <div class="absolute top-[-40%] right-[-10%] w-72 h-72 bg-rose-500/5 blur-[70px] rounded-full pointer-events-none" />
      <div class="absolute bottom-[-35%] left-[-10%] w-48 h-48 bg-blue-500/5 blur-[60px] rounded-full pointer-events-none" />
      
      <div class="space-y-1.5 flex-grow text-center md:text-left">
        <div class="inline-flex items-center gap-1.5 px-2 py-0.5 bg-rose-50 text-rose-500 rounded-lg text-[10px] font-bold border border-rose-100/40">
          <Sparkles class="w-3 h-3 fill-rose-100" />
          <span>Favorites Vault</span>
        </div>
        <h1 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-headline">
          My Desired Gear
        </h1>
        <p class="text-xs text-slate-400 max-w-lg font-medium">
          You have saved <strong class="text-rose-500 font-bold">{{ wishlist.length }}</strong> {{ wishlist.length === 1 ? "item" : "items" }}. Review details or transfer them directly to your shopping basket.
        </p>
      </div>

      <div class="flex-shrink-0 flex items-center gap-2.5 bg-slate-50/60 border border-slate-100/80 rounded-xl px-3.5 py-2">
        <Heart class="w-6 h-6 text-rose-500 animate-pulse fill-rose-100" />
        <div class="text-left">
          <span class="block text-lg font-extrabold text-slate-950 font-mono leading-none">{{ wishlist.length }}</span>
          <span class="block text-[9px] uppercase font-bold text-slate-400 tracking-wider">Saved</span>
        </div>
      </div>
    </div>

    <!-- Wishlist Grid Display -->
    <div v-if="wishlist.length === 0" class="bg-white border border-slate-100 rounded-[2.5rem] py-16 px-6 text-center shadow-xs max-w-lg mx-auto space-y-6">
      <div class="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto border border-slate-100">
        <Heart class="w-8 h-8 text-slate-300 stroke-[1.5]" />
      </div>
      <div class="space-y-2">
        <h2 class="text-lg font-black text-slate-900 font-headline">Your Wishlist is Empty</h2>
        <p class="text-xs text-slate-505 max-w-sm mx-auto font-medium">
          You haven't added any products to your wishlist yet. Explore our curated collections to find things you love!
        </p>
      </div>
      <button
        @click="triggerRouteAnimation('shop')"
        class="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-500/10 cursor-pointer"
      >
        <ShoppingBag class="w-4 h-4" />
        <span>Discover Products Catalog</span>
      </button>
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="prod in wishlist"
        :key="prod.id"
        class="bg-white border border-slate-100/70 rounded-[1.8rem] overflow-hidden hover:shadow-lg hover:border-rose-100 transition-all duration-300 flex flex-col justify-between group relative"
      >
        <!-- Image Segment -->
        <div class="relative aspect-square bg-slate-50/40 p-6 flex items-center justify-center border-b border-slate-100/30">
          <img
            v-if="prod.image"
            :src="prod.image"
            :alt="prod.name"
            referrerpolicy="no-referrer"
            class="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500 cursor-pointer rounded-2xl"
            @click="openProduct(prod.id)"
          />
          <ImageOff v-else class="w-10 h-10 text-slate-300 stroke-[1.2]" />

          <!-- Top Right Quick Remove Trash icon -->
          <button
            type="button"
            @click="toggleWishlist(prod)"
            class="absolute top-3 right-3 p-2 bg-white/90 hover:bg-rose-50 text-slate-400 hover:text-rose-500 border border-slate-100 rounded-full transition-all cursor-pointer shadow-2xs hover:scale-105"
            title="Remove from favorites"
          >
            <Trash2 class="w-4 h-4" />
          </button>
        </div>

        <!-- Text / Actions Segment -->
        <div class="p-5 space-y-4 flex-grow flex flex-col justify-between">
          <div class="space-y-1.5">
            <span class="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              {{ prod.category }}
            </span>
            <h3
              @click="openProduct(prod.id)"
              class="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug line-clamp-1 cursor-pointer"
            >
              {{ prod.name }}
            </h3>
            <div class="flex items-center gap-2.5">
              <span class="text-base font-extrabold font-mono text-slate-950">
                ${{ prod.price.toFixed(2) }}
              </span>
              <span v-if="prod.originalPrice" class="text-xs text-slate-400 line-through">
                ${{ prod.originalPrice.toFixed(2) }}
              </span>
            </div>
          </div>

          <div class="flex items-center gap-2 pt-3 border-t border-slate-50">
            <!-- Detailed specs button -->
            <button
              @click="openProduct(prod.id)"
              class="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 border border-slate-100 hover:border-slate-205 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <Eye class="w-3.5 h-3.5 text-slate-400" />
              <span>View Detail</span>
            </button>

            <!-- Add directly to shopping basket -->
            <button
              @click="handleQuickBuy(prod)"
              class="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs hover:shadow-sm cursor-pointer"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Add to Basket</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
