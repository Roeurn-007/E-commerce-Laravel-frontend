<script setup lang="ts">
import { computed } from "vue";
import { ArrowRight, ShoppingBag, Eye, TrendingUp, Sparkles, Award } from "lucide-vue-next";
import { Product, ActiveTab } from "../types";

const props = defineProps<{
  products: Product[];
  setActiveTab: (tab: ActiveTab) => void;
  setSelectedProductId: (id: string) => void;
  addToCart: (product: Product, quantity: number, color?: string) => void;
  toggleWishlist: (product: Product) => void;
  wishlist: Product[];
  triggerRouteAnimation: (targetTab: ActiveTab) => void;
  addToast: (message: string, type: "success" | "error" | "info") => void;
}>();

const mainHeroProduct = computed(() => {
  console.log('HomeView products:', props.products.length);
  return props.products.find((p) => p.id === "sonicpro-headphones") || props.products[0] || null;
});

const featuredGridItems = computed(() => {
  return props.products.slice(1, 5); // next 4 products
});

const handleSubscribe = (e: Event) => {
  e.preventDefault();
  const form = e.target as HTMLFormElement;
  const formData = new FormData(form);
  const email = formData.get("email") as string;
  if (email) {
    props.addToast(`Thank you! ${email} has been subscribed to updates.`, "success");
    form.reset();
  }
};

const selectProductDetail = (pId: string) => {
  props.setSelectedProductId(pId);
  props.triggerRouteAnimation("product-detail");
};
</script>

<template>
  <div class="space-y-16 pb-16">
    
    <!-- Debug info -->
    <div v-if="products.length === 0" class="mx-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-yellow-800">
      <p>No products loaded. Check console for details.</p>
    </div>
    
    <!-- 🚀 Apple Store / Shopify Style Hero Section (Premium Light Theme) -->
    <section v-if="mainHeroProduct" class="relative overflow-hidden bg-slate-50 border border-slate-100/60 rounded-3xl mx-4 sm:mx-6 lg:mx-8 px-6 py-12 sm:py-16 sm:px-12 lg:px-16 mt-6 shadow-sm">
      <!-- Subtle background gradient pattern -->
      <div class="absolute top-0 right-0 w-[50%] h-full bg-linear-to-bl from-blue-50/40 via-transparent to-transparent pointer-events-none" />
      
      <div class="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        <!-- Hero Left Content -->
        <div class="lg:col-span-7 space-y-5 text-left">
          <span class="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-100 rounded-full text-xs text-blue-600 font-semibold uppercase tracking-wider">
            <Sparkles class="w-3.5 h-3.5" />
            <span>Next Standard of Sound</span>
          </span>
          
          <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
            {{ mainHeroProduct.name }}
          </h1>
          
          <p class="text-sm sm:text-base text-slate-600 max-w-lg leading-relaxed font-sans">
            Experience dynamic active noise cancellation and high-fidelity titanium drivers. Up to forty hours of uncompromised battery longevity on a single charge.
          </p>
          
          <!-- Price section -->
          <div class="flex items-baseline gap-3 pt-1">
            <span class="text-2xl font-bold font-mono text-slate-900">${{ mainHeroProduct.price.toFixed(2) }}</span>
            <span v-if="mainHeroProduct.originalPrice" class="text-sm line-through text-slate-400 font-mono">${{ mainHeroProduct.originalPrice.toFixed(2) }}</span>
          </div>

          <!-- Action buttons -->
          <div class="flex flex-wrap gap-3 pt-2">
            <button
              @click="selectProductDetail(mainHeroProduct.id)"
              class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium text-sm transition-all shadow-xs hover:shadow-md flex items-center gap-2 cursor-pointer"
            >
              <span>View Details</span>
              <ArrowRight class="w-4 h-4" />
            </button>
            <button
              @click="triggerRouteAnimation('shop')"
              class="px-6 py-3 bg-white hover:bg-slate-55 text-slate-700 hover:text-slate-900 rounded-xl font-medium text-sm transition-all border border-slate-200 shadow-2xs cursor-pointer"
            >
              Browse Catalog
            </button>
          </div>
        </div>

        <!-- Hero Right Image - Main Highlight focus -->
        <div class="lg:col-span-5 flex justify-center relative">
          <img
            :src="mainHeroProduct.image"
            :alt="mainHeroProduct.name"
            referrerpolicy="no-referrer"
            class="w-64 h-64 sm:w-72 sm:h-72 lg:w-80 lg:h-80 object-contain transform hover:scale-105 transition-transform duration-500 cursor-pointer"
            @click="selectProductDetail(mainHeroProduct.id)"
          />
        </div>

      </div>
    </section>

    <!-- Curated Categories -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-8">
        <h2 class="text-2xl font-bold text-slate-900 tracking-tight font-headline">
          Curated Categories
        </h2>
        <p class="text-sm text-slate-500 mt-1 font-sans">
          Pick a route below to instantly query and explore the product catalogue.
        </p>
      </div>

      <div class="flex flex-wrap justify-center gap-4">
        <button
          v-for="cat in ['Electronics', 'Fashion', 'Home & Garden', 'Sports']"
          :key="cat"
          @click="triggerRouteAnimation('shop')"
          class="flex items-center gap-3 bg-white border border-slate-100 pl-4 pr-6 py-3 rounded-2xl shadow-xs hover:shadow-md hover:border-blue-400 transition-all cursor-pointer group"
        >
          <div class="p-2 bg-blue-50 text-blue-600 rounded-xl group-hover:scale-105 transition-transform">
            <ShoppingBag class="w-4 h-4" />
          </div>
          <span class="text-sm font-semibold text-slate-800">{{ cat }}</span>
        </button>
      </div>
    </section>

    <!-- 🎁 Featured Professional Grid -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-end mb-8">
        <div>
          <span class="flex items-center gap-1.5 text-blue-600 text-xs font-semibold uppercase tracking-wider mb-1">
            <TrendingUp class="w-4 h-4" />
            <span>Weekly Highlights</span>
          </span>
          <h2 class="text-2xl font-bold text-slate-900 tracking-tight font-headline">
            Best-Selling Accessories & Tech
          </h2>
        </div>
        <button
          @click="triggerRouteAnimation('shop')"
          class="hidden sm:flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
        >
          <span>View All</span>
          <ArrowRight class="w-4 h-4" />
        </button>
      </div>

      <!-- Product Cards with exact hover Lift and Zoom effects -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          v-for="prod in featuredGridItems"
          :key="prod.id"
          class="bg-white rounded-2xl overflow-hidden border border-slate-100/50 shadow-xs hover:shadow-md hover:border-slate-200/50 transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full group"
        >
          <!-- Image block -->
          <div class="relative aspect-square overflow-hidden bg-slate-50/50 flex items-center justify-center p-6">
            <img
              :src="prod.image"
              :alt="prod.name"
              referrerpolicy="no-referrer"
              class="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 cursor-pointer mix-blend-multiply rounded-xl"
              @click="selectProductDetail(prod.id)"
            />
            <span v-if="prod.tags && prod.tags.length > 0" class="absolute top-3 left-3 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
              {{ prod.tags[0] }}
            </span>
          </div>

          <!-- Content details block -->
          <div class="p-5 flex-grow flex flex-col justify-between">
            <div class="space-y-1.5">
              <span class="text-xs text-slate-400 font-semibold uppercase tracking-wider">{{ prod.category }}</span>
              <h3
                @click="selectProductDetail(prod.id)"
                class="font-headline text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors cursor-pointer"
              >
                {{ prod.name }}
              </h3>
              <p class="text-xs text-slate-550 line-clamp-2 leading-relaxed">
                {{ prod.description }}
              </p>
            </div>

            <div class="flex items-center justify-between pt-4 mt-4 border-t border-slate-100">
              <div>
                <span class="text-base font-bold font-mono text-slate-900">
                  ${{ prod.price.toFixed(2) }}
                </span>
              </div>
              <div class="flex gap-1.5">
                <button
                  @click="selectProductDetail(prod.id)"
                  class="p-2 bg-slate-50 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 font-medium text-xs transition-colors cursor-pointer border border-slate-200"
                  title="View details"
                >
                  <Eye class="w-4 h-4" />
                </button>
                <button
                  @click="addToCart(prod, 1)"
                  class="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer shadow-2xs"
                  title="Add to cart"
                >
                  <ShoppingBag class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Ambient Trust Blocks (Premium layout with gentle border and light bg) -->
    <section class="bg-slate-50 border border-slate-100 py-10 rounded-3xl mx-4 sm:mx-6 lg:mx-8 px-6">
      <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        
        <div class="flex gap-4">
          <div class="p-3 bg-blue-50 rounded-2xl text-blue-600 flex-shrink-0 h-11 w-11 flex items-center justify-center shadow-2xs">
            <Award class="w-5 h-5" />
          </div>
          <div>
            <h3 class="font-semibold text-sm text-slate-800">Certified Authentic</h3>
            <p class="text-xs text-slate-500 mt-1 leading-relaxed">
              All accessories are verified under rigid dynamic build guidelines to ensure material safety.
            </p>
          </div>
        </div>

        <div class="flex gap-4">
          <div class="p-3 bg-blue-50 rounded-2xl text-blue-600 flex-shrink-0 h-11 w-11 flex items-center justify-center shadow-2xs">
            <ShoppingBag class="w-5 h-5" />
          </div>
          <div>
            <h3 class="font-semibold text-sm text-slate-800">Same-Day Dispatch</h3>
            <p class="text-xs text-slate-500 mt-1 leading-relaxed">
              Submit an order before 14:00 and we hand off packages to the delivery provider immediately.
            </p>
          </div>
        </div>

        <div class="flex gap-4">
          <div class="p-3 bg-blue-50 rounded-2xl text-blue-600 flex-shrink-0 h-11 w-11 flex items-center justify-center shadow-2xs">
            <TrendingUp class="w-5 h-5" />
          </div>
          <div>
            <h3 class="font-semibold text-sm text-slate-800">Premium Materials</h3>
            <p class="text-xs text-slate-500 mt-1 leading-relaxed">
              Our stitch leather utilizes full vegetable tan to optimize physical beauty during continuous usage.
            </p>
          </div>
        </div>

      </div>
    </section>

    <!-- 📬 Newsletter Signup Box (Shopify/Stripe Clean Aesthetic) -->
    <section class="bg-slate-50 border border-slate-100/60 rounded-3xl mx-4 sm:mx-6 lg:mx-8 px-6 py-12 sm:px-12 text-center relative overflow-hidden">
      <div class="relative max-w-2xl mx-auto space-y-5">
        <h2 class="text-2xl font-bold tracking-tight text-slate-900 font-headline">Stay in our orbit</h2>
        
        <p class="text-sm text-slate-600 leading-relaxed font-sans max-w-lg mx-auto">
          Subscribe below to receive standard release updates, product guides, and exclusive, invitation-only discount structures. No spam, ever.
        </p>
        
        <form @submit="handleSubscribe" class="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto pt-2">
          <input
            type="email"
            name="email"
            required
            placeholder="Enter your email address"
            class="px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent flex-grow shadow-2xs"
          />
          <button
            type="submit"
            class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-xs transition-all cursor-pointer whitespace-nowrap"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>

  </div>
</template>
