<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { Search, Heart, ShoppingBag, Eye, SlidersHorizontal, ArrowUpDown, Star, X, ImageOff } from "lucide-vue-next";
import { Product, ActiveTab } from "../types";

const props = defineProps<{
  products: Product[];
  setActiveTab: (tab: ActiveTab) => void;
  setSelectedProductId: (id: string) => void;
  addToCart: (product: Product, quantity: number, color?: string) => void;
  toggleWishlist: (product: Product) => void;
  wishlist: Product[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  triggerRouteAnimation: (targetTab: ActiveTab) => void;
}>();

// Filter States
const selectedCategory = ref<string>("all");
const maxPrice = ref<number>(1500);
const minRating = ref<number>(0);
const sortBy = ref<string>("recommended");
const showMobileFilters = ref<boolean>(false);
const isLoading = ref<boolean>(false);

// Trigger skeleton loader animation whenever filters change
watch(
  [selectedCategory, maxPrice, minRating, sortBy, () => props.searchQuery],
  () => {
    isLoading.value = true;
    const timer = setTimeout(() => {
      isLoading.value = false;
    }, 450);
    return () => clearTimeout(timer);
  }
);

// Extract Categories with Item Counts (from backend-provided products)
const categoriesList = computed<string[]>(() => {
  // Normalize and keep stable ordering: "all" first, then alphabetical.
  const unique = new Set<string>();
  for (const p of props.products) {
    const cat = (p.category || "").trim();
    if (cat) unique.add(cat);
  }
  return ["all", ...Array.from(unique).sort((a, b) => a.localeCompare(b))];
});

const getCategoryCount = (cat: string) => {
  if (cat === "all") return props.products.length;
  return props.products.filter((p) => p.category === cat).length;
};

// Filter & Sort Logic
const filteredProducts = computed(() => {
  return props.products.filter((prod) => {
    const matchesCategory = selectedCategory.value === "all" ? true : prod.category === selectedCategory.value;
    const matchesSearch = props.searchQuery
      ? prod.name.toLowerCase().includes(props.searchQuery.toLowerCase()) ||
        prod.description.toLowerCase().includes(props.searchQuery.toLowerCase()) ||
        prod.category.toLowerCase().includes(props.searchQuery.toLowerCase())
      : true;
    const matchesPrice = prod.price <= maxPrice.value;
    const matchesRating = prod.rating >= minRating.value;

    return matchesCategory && matchesSearch && matchesPrice && matchesRating;
  });
});

const sortedProducts = computed(() => {
  return [...filteredProducts.value].sort((a, b) => {
    if (sortBy.value === "price-low") return a.price - b.price;
    if (sortBy.value === "price-high") return b.price - a.price;
    if (sortBy.value === "rating") return b.rating - a.rating;
    if (sortBy.value === "reviews") return b.reviewCount - a.reviewCount;
    return 0; // standard recommended sequence
  });
});

const handleResetFilters = () => {
  selectedCategory.value = "all";
  maxPrice.value = 1500;
  minRating.value = 0;
  sortBy.value = "recommended";
  props.setSearchQuery("");
};

const openProduct = (id: string) => {
  props.setSelectedProductId(id);
  props.triggerRouteAnimation("product-detail");
};

const isProductInWishlist = (prodId: string) => {
  return props.wishlist.some((item) => item.id === prodId);
};
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    
    <!-- Breadcrumbs -->
    <nav class="flex text-xs text-slate-400 font-semibold mb-6 uppercase tracking-wider" aria-label="Breadcrumb">
      <ol class="flex items-center space-x-2">
        <li>
          <button @click="triggerRouteAnimation('home')" class="hover:text-blue-600 transition-colors cursor-pointer">
            Home
          </button>
        </li>
        <li><span class="text-slate-355">/</span></li>
        <li><span class="text-slate-800 font-bold">Catalog Store</span></li>
      </ol>
    </nav>

    <!-- Main Listing Layout Block -->
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
      
      <!-- 1. Left Filters Sidebar - Desktop -->
      <aside class="hidden lg:block space-y-8 bg-white border border-slate-100/70 rounded-3xl p-6 h-fit shadow-xs">
        
        <div class="flex justify-between items-center pb-4 border-b border-slate-100">
          <h3 class="font-bold text-sm uppercase text-slate-955 flex items-center gap-2">
            <SlidersHorizontal class="w-4 h-4 text-blue-600" />
            <span>Filters</span>
          </h3>
          <button
            @click="handleResetFilters"
            class="text-xs text-blue-600 hover:text-blue-700 font-semibold tracking-tight cursor-pointer"
          >
            Reset All
          </button>
        </div>

        <!-- Category selection -->
        <div class="space-y-3">
          <h4 class="font-bold text-xs uppercase tracking-wider text-slate-405">Categories</h4>
          <div class="space-y-1">
            <button
              v-for="cat in categoriesList"
              :key="cat"
              @click="selectedCategory = cat"
              class="w-full flex justify-between items-center px-3 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer text-left"
              :class="selectedCategory === cat
                ? 'bg-blue-50 text-blue-600 font-semibold'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'"
            >
              <span class="capitalize">{{ cat === "all" ? "All Categories" : cat }}</span>
              <span class="text-xs font-mono bg-slate-100 px-2 py-0.5 rounded-full text-slate-500 font-bold">
                {{ getCategoryCount(cat) }}
              </span>
            </button>
          </div>
        </div>

        <!-- Price limit selection -->
        <div class="space-y-4">
          <div class="flex justify-between items-center text-xs uppercase tracking-wider text-slate-405">
            <span class="font-semibold">Max Price</span>
            <span class="font-bold font-mono text-blue-600">${{ maxPrice }}</span>
          </div>
          <input
            type="range"
            min="10"
            max="1500"
            step="10"
            v-model.number="maxPrice"
            class="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div class="flex justify-between text-[11px] text-slate-400 font-mono">
            <span>$10</span>
            <span>$1,500</span>
          </div>
        </div>

        <!-- Minimum Rating Selection -->
        <div class="space-y-3">
          <h4 class="font-bold text-xs uppercase tracking-wider text-slate-405">Minimum Rating</h4>
          <div class="space-y-1">
            <button
              v-for="ratingVal in [4.5, 4.0, 3.5, 0]"
              :key="ratingVal"
              @click="minRating = ratingVal"
              class="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all text-left cursor-pointer"
              :class="minRating === ratingVal
                ? 'bg-blue-50 text-blue-600 font-semibold'
                : 'text-slate-600 hover:bg-slate-50'"
            >
              <span v-if="ratingVal === 0">Any Rating</span>
              <div v-else class="flex items-center gap-1.5">
                <div class="flex items-center gap-0.5 text-amber-500">
                  <Star class="w-4 h-4 fill-amber-500 text-amber-500" />
                  <span class="text-sm font-semibold text-slate-705">{{ ratingVal.toFixed(1) }}</span>
                </div>
                <span class="text-xs text-slate-400 font-medium">& Up</span>
              </div>
            </button>
          </div>
        </div>

      </aside>

      <!-- 2. Right Products Grid & Header area -->
      <main class="lg:col-span-3 space-y-6">
        
        <!-- Controls Bar -->
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-slate-100 p-4 rounded-3xl shadow-xs transition-colors duration-300">
          
          <div class="flex items-center gap-3">
            <span class="text-sm font-semibold text-slate-900">
              {{ sortedProducts.length }} {{ sortedProducts.length === 1 ? "Product" : "Products" }} found
            </span>
            <span v-if="searchQuery" class="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-[11px] font-semibold text-slate-600 rounded-lg">
              Search: "{{ searchQuery }}"
            </span>
          </div>

          <!-- Sort Dropdown & Filters toggle -->
          <div class="flex items-center gap-2 w-full sm:w-auto">
            <!-- Mobile Filter slide trigger -->
            <button
              @click="showMobileFilters = true"
              class="lg:hidden flex items-center justify-center gap-2 border border-slate-100 px-4 py-2 rounded-xl text-sm text-slate-700 hover:bg-slate-50 cursor-pointer flex-1"
            >
              <SlidersHorizontal class="w-4 h-4 text-blue-600" />
              <span>Filters</span>
            </button>

            <div class="flex items-center gap-1.5 border border-slate-100 px-3 py-2 rounded-xl text-sm text-slate-700 bg-white w-full sm:w-auto">
              <ArrowUpDown class="w-4 h-4 text-slate-400" />
              <select
                v-model="sortBy"
                class="bg-transparent text-sm font-semibold focus:outline-none cursor-pointer w-full"
              >
                <option value="recommended">Sort: Recommended</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Rating: Highest</option>
                <option value="reviews">Review Volume</option>
              </select>
            </div>
          </div>

        </div>

        <!-- Active Filter Chips bar -->
        <div v-if="selectedCategory !== 'all' || maxPrice < 1500 || minRating > 0 || searchQuery" class="flex flex-wrap gap-2 items-center px-1">
          <span class="text-xs text-slate-400 font-semibold">Active Criteria:</span>
          
          <span v-if="selectedCategory !== 'all'" class="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-600 border border-blue-100 rounded-xl text-xs font-semibold">
            <span>Category: {{ selectedCategory }}</span>
            <button @click="selectedCategory = 'all'" class="hover:text-red-500 font-bold ml-1 cursor-pointer">×</button>
          </span>

          <span v-if="maxPrice < 1500" class="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-600 border border-blue-100 rounded-xl text-xs font-semibold">
            <span>Max: ${{ maxPrice }}</span>
            <button @click="maxPrice = 1500" class="hover:text-red-500 font-bold ml-1 cursor-pointer">×</button>
          </span>

          <span v-if="minRating > 0" class="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-600 border border-blue-100 rounded-xl text-xs font-semibold">
            <span>Rating: {{ minRating }}+ ⭐</span>
            <button @click="minRating = 0" class="hover:text-red-500 font-bold ml-1 cursor-pointer">×</button>
          </span>

          <span v-if="searchQuery" class="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-600 border border-blue-100 rounded-xl text-xs font-semibold">
            <span>Keyword: "{{ searchQuery }}"</span>
            <button @click="setSearchQuery('')" class="hover:text-red-500 font-bold ml-1 cursor-pointer">×</button>
          </span>

          <button
            @click="handleResetFilters"
            class="text-xs text-slate-400 hover:text-blue-600 underline font-semibold cursor-pointer"
          >
            Clear all filters
          </button>
        </div>


        <!-- Listing Display Canvas -->
        <div class="relative min-h-[400px]">
          
          <!-- Skeleton Loading Grid -->
          <div v-if="isLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            <div v-for="idx in 6" :key="idx" class="bg-white border border-slate-100 rounded-2xl p-5 space-y-4 animate-pulse">
              <div class="w-full aspect-square bg-slate-100 rounded-xl" />
              <div class="h-4 bg-slate-100 rounded-md w-[40%]" />
              <div class="h-5 bg-slate-100 rounded-md w-[80%]" />
              <div class="h-4 bg-slate-100 rounded-md w-[95%]" />
              <div class="flex justify-between items-center pt-2">
                <div class="h-6 bg-slate-100 rounded-md w-[30%]" />
                <div class="h-8 bg-slate-100 rounded-lg w-[20%]" />
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div
            v-else-if="sortedProducts.length === 0"
            class="flex flex-col items-center justify-center py-20 px-4 text-center bg-white border border-slate-100/70 rounded-3xl"
          >
            <div class="p-4 bg-blue-50 rounded-2xl text-blue-600 mb-4">
              <SlidersHorizontal class="w-8 h-8" />
            </div>
            <h3 class="font-bold text-lg text-slate-900">No products match those criteria</h3>
            <p class="text-sm text-slate-500 mt-2 max-w-sm leading-relaxed">
              We couldn't locate any products matching your selected filters or search keyword. Reset to browse our complete collection!
            </p>
            <button
              @click="handleResetFilters"
              class="mt-6 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-all cursor-pointer shadow-xs"
            >
              Reset Active Filters
            </button>
          </div>

          <!-- Actual Products Grid -->
          <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              v-for="prod in sortedProducts"
              :key="prod.id"
              class="bg-white border border-slate-100/60 rounded-3xl shadow-xs hover:shadow-md hover:border-slate-200/60 transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between group overflow-hidden"
            >
              <!-- Integrated Image block -->
              <div class="relative aspect-[4/3] bg-slate-50/40 flex items-center justify-center p-4 border-b border-slate-100/30 overflow-hidden">
                <img
                  v-if="prod.image"
                  :src="prod.image"
                  :alt="prod.name"
                  referrerpolicy="no-referrer"
                  class="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 cursor-pointer mix-blend-multiply rounded-2xl"
                  @click="openProduct(prod.id)"
                />
                <div v-else class="flex flex-col items-center justify-center text-center gap-1.5 text-slate-400 cursor-pointer" @click="openProduct(prod.id)">
                  <ImageOff class="w-8 h-8 stroke-[1.5]" />
                  <span class="text-[10px] font-bold uppercase tracking-wider text-slate-555">No Photo</span>
                </div>

                <!-- Quick View Overlay -->
                <div class="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <button
                    @click="openProduct(prod.id)"
                    class="px-4 py-2 bg-white text-slate-900 rounded-xl text-xs font-bold shadow-lg hover:bg-slate-50 transition-all cursor-pointer flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
                  >
                    <Eye class="w-4 h-4" />
                    <span>Quick View</span>
                  </button>
                </div>

                <!-- Top-right heart toggle -->
                <button
                  @click="toggleWishlist(prod)"
                  class="absolute top-3 right-3 p-2 rounded-full shadow-xs transition-all cursor-pointer border z-10"
                  :class="isProductInWishlist(prod.id)
                    ? 'bg-rose-500 text-white hover:bg-rose-600 border-rose-500'
                    : 'bg-white text-slate-400 border-slate-100/80 hover:bg-slate-50 hover:text-rose-500'"
                >
                  <Heart class="w-4 h-4" :class="{ 'fill-white': isProductInWishlist(prod.id) }" />
                </button>

                <!-- Tag chips -->
                <span v-if="prod.tags && prod.tags.length > 0" class="absolute bottom-3 left-3 bg-blue-600 text-white text-[9px] font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wider z-10">
                  {{ prod.tags[0] }}
                </span>
              </div>

              <!-- Text Details -->
              <div class="p-4 flex-grow flex flex-col justify-between">
                <div class="space-y-1">
                  <div class="flex justify-between items-center">
                    <span class="text-[10px] text-slate-450 font-bold uppercase tracking-wider">{{ prod.category }}</span>
                    <div class="flex items-center gap-1">
                      <Star class="w-3.5 h-3.5 fill-amber-404 text-amber-404" />
                      <span class="text-xs font-bold text-slate-700">{{ prod.rating.toFixed(1) }}</span>
                    </div>
                  </div>

                  <button 
                    @click="openProduct(prod.id)"
                    class="text-left font-headline font-bold text-sm text-slate-900 group-hover:text-blue-600 transition-colors cursor-pointer block"
                  >
                    {{ prod.name }}
                  </button>
                  
                  <p
                    class="text-xs text-slate-500 line-clamp-2 leading-relaxed"
                    :title="prod.description"
                  >
                    {{ (prod.description || '').trim() ? prod.description : 'No description available.' }}
                  </p>
                </div>

                <!-- Purchase strip -->
                <div class="flex items-center justify-between pt-3 mt-3 border-t border-slate-100">
                  <div>
                    <span class="text-lg font-bold font-mono text-blue-600">
                      ${{ prod.price.toFixed(2) }}
                    </span>
                    <span v-if="prod.originalPrice" class="text-xs line-through text-slate-400 font-mono ml-1.5">
                      ${{ prod.originalPrice.toFixed(2) }}
                    </span>
                  </div>
                  <div class="flex gap-1.5">
                    <button
                      @click="openProduct(prod.id)"
                      class="p-2 bg-slate-50 text-slate-500 hover:text-slate-900 rounded-xl transition-all cursor-pointer border border-slate-200"
                      title="Open specifications details"
                    >
                      <Eye class="w-4 h-4" />
                    </button>
                    <button
                      @click="addToCart(prod, 1)"
                      class="p-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all flex items-center justify-center cursor-pointer shadow-2xs"
                      title="Add to shopping cart"
                    >
                      <ShoppingBag class="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>

      </main>

    </div>

    <!-- 3. Mobile Slide-out Filters Drawer Overlay -->
    <Transition name="slide-left">
      <div v-if="showMobileFilters" class="fixed inset-0 z-[200] overflow-hidden flex justify-end">
        <!-- Backdrop -->
        <div @click="showMobileFilters = false" class="fixed inset-0 bg-slate-950/40 backdrop-blur-xs cursor-pointer" />

        <!-- Sidebar drawer panel -->
        <div class="relative w-full max-w-xs bg-white h-full p-6 shadow-2xl flex flex-col justify-between overflow-y-auto z-10">
          <div class="space-y-8">
            <div class="flex justify-between items-center pb-4 border-b">
              <h3 class="font-bold text-base text-slate-900 flex items-center gap-2">
                <SlidersHorizontal class="w-4 h-4 text-blue-600" />
                <span>Filters Menu</span>
              </h3>
              <button
                @click="showMobileFilters = false"
                class="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-700 transition-colors"
              >
                <X class="w-5 h-5" />
              </button>
            </div>

            <!-- Categories -->
            <div class="space-y-3">
              <h4 class="font-bold text-xs uppercase tracking-wider text-slate-405">Categories</h4>
              <div class="space-y-1">
                <button
                  v-for="cat in categoriesList"
                  :key="cat"
                  @click="selectedCategory = cat; showMobileFilters = false"
                  class="w-full flex justify-between items-center px-3 py-2 rounded-xl text-sm font-medium transition-all text-left"
                  :class="selectedCategory === cat ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-55'"
                >
                  <span class="capitalize">{{ cat === 'all' ? 'All' : cat }}</span>
                  <span class="text-xs font-mono bg-slate-100 px-2 py-0.5 rounded-full text-slate-505">
                    {{ getCategoryCount(cat) }}
                  </span>
                </button>
              </div>
            </div>

            <!-- Price -->
            <div class="space-y-4">
              <div class="flex justify-between items-center text-xs uppercase tracking-wider text-slate-405">
                <span class="font-semibold">Max Price</span>
                <span class="font-bold font-mono text-blue-600">${{ maxPrice }}</span>
              </div>
              <input
                type="range"
                min="10"
                max="1500"
                step="10"
                v-model.number="maxPrice"
                class="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            <!-- Rating -->
            <div class="space-y-3">
              <h4 class="font-bold text-xs uppercase tracking-wider text-slate-45">Minimum Rating</h4>
              <div class="space-y-1">
                <button
                  v-for="ratingVal in [4.5, 4.0, 3.5, 0]"
                  :key="ratingVal"
                  @click="minRating = ratingVal; showMobileFilters = false"
                  class="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all text-left"
                  :class="minRating === ratingVal ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-55'"
                >
                  <span v-if="ratingVal === 0">Any Rating</span>
                  <div v-else class="flex items-center gap-1">
                    <Star class="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span class="text-sm font-bold">{{ ratingVal.toFixed(1) }}</span>
                    <span class="text-xs text-slate-400 ml-1">& Up</span>
                  </div>
                </button>
              </div>
            </div>
          </div>

          <div class="pt-6 border-t mt-8 flex gap-3">
            <button
              @click="handleResetFilters(); showMobileFilters = false"
              class="flex-1 py-3 text-slate-600 font-semibold border border-slate-200 rounded-xl text-sm hover:bg-slate-50 transition-colors"
            >
              Reset
            </button>
            <button
              @click="showMobileFilters = false"
              class="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition-colors shadow-xs"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </Transition>

  </div>
</template>

<style scoped>
.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 0.3s ease-out;
}
.slide-left-enter-from {
  opacity: 0;
  transform: translateX(100%);
}
.slide-left-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
