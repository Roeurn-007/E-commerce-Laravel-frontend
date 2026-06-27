<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { Star, Heart, ShoppingBag, ArrowLeft, Check, Award, StarHalf, ImageOff } from "lucide-vue-next";
import { Product, ActiveTab } from "../types";

const props = defineProps<{
  productId: string;
  products: Product[];
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  setSelectedProductId: (id: string) => void;
  addToCart: (product: Product, quantity: number, color?: string) => void;
  toggleWishlist: (product: Product) => void;
  wishlist: Product[];
  triggerRouteAnimation: (targetTab: ActiveTab) => void;
  updateProductImage: (productId: string, newUrl: string) => void;
  removeProductImage: (productId: string) => void;
  addToast: (message: string, type: "success" | "error" | "info") => void;
}>();

// Find current product detail
const product = computed(() => {
  const found = props.products.find((p) => p.id === props.productId) || props.products[0];
  return found || {
    id: "",
    name: "Loading...",
    description: "",
    price: 0,
    rating: 0,
    reviewCount: 0,
    image: "",
    images: [],
    category: "",
    tags: [],
    colors: [],
    specifications: []
  };
});

// Active States
const activeImage = ref<string>("");
const selectedColor = ref<string>("");
const quantity = ref<number>(1);
const activeTabPanel = ref<"details" | "specs" | "reviews">("details");

// Watch for product changes to sync options
watch(
  product,
  (newProduct) => {
    if (newProduct) {
      activeImage.value = newProduct.image;
      selectedColor.value = newProduct.colors && newProduct.colors.length > 0 ? newProduct.colors[0].name : "";
      quantity.value = 1;
    }
  },
  { immediate: true }
);

const handleQuantityAdd = () => {
  quantity.value += 1;
};
const handleQuantitySub = () => {
  if (quantity.value > 1) {
    quantity.value -= 1;
  }
};

// Suggest products based on category overlap or price similarity
const relatedProducts = computed(() => {
  return props.products
    .filter((p) => p.id !== product.value.id)
    .map((p) => {
      let score = 0;
      const reasons: string[] = [];

      // 1. Same category is extremely relevant
      if (p.category === product.value.category) {
        score += 150;
        reasons.push("Same Category");
      }

      // 2. Price proximity
      const priceDiff = Math.abs(p.price - product.value.price);
      const avgPrice = (p.price + product.value.price) / 2;
      const discountPercentage = avgPrice > 0 ? (priceDiff / avgPrice) * 100 : 100;
      
      if (discountPercentage <= 15) {
        score += 100;
        reasons.push("Similar Price");
      } else if (discountPercentage <= 35) {
        score += 65;
        reasons.push("Comparable Price");
      }

      // 3. Shared tags
      if (p.tags && product.value.tags) {
        const commonTags = p.tags.filter((t) => product.value.tags?.includes(t));
        if (commonTags.length > 0) {
          score += commonTags.length * 30;
          reasons.push("Matching Style");
        }
      }

      const primaryReason = reasons[0] || (p.price < product.value.price ? "Value Alternative" : "Premium Option");

      return { product: p, score, reason: primaryReason };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 4); // Suggest up to 4 high-match alternatives
});

const isWishlined = computed(() => {
  return props.wishlist.some((item) => item.id === product.value.id);
});

const handleRelatedClick = (pId: string) => {
  props.setSelectedProductId(pId);
  window.scrollTo({ top: 0, behavior: "smooth" });
};
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
    
    <!-- Upper Navigation Strip -->
    <div class="flex items-center justify-between">
      <button
        @click="triggerRouteAnimation('shop')"
        class="flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-blue-600 cursor-pointer transition-colors"
      >
        <ArrowLeft class="w-4 h-4 text-blue-600" />
        <span>Back to Catalog Store</span>
      </button>

      <nav class="text-xs text-slate-400 font-semibold uppercase tracking-wider">
        <ol class="flex items-center space-x-2">
          <li><span class="text-slate-300">Shop</span></li>
          <li><span class="text-slate-300">/</span></li>
          <li><span class="text-slate-300">{{ product.category }}</span></li>
          <li><span class="text-slate-300">/</span></li>
          <li class="text-slate-900 font-bold">Details</li>
        </ol>
      </nav>
    </div>

    <!-- Main Details Canvas Grid Split -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-12">
      
      <!-- Left Side: Images Viewer & Thumbnails -->
      <div class="lg:col-span-6 space-y-4">
        <div class="bg-white rounded-3xl aspect-square overflow-hidden flex items-center justify-center p-8 border border-slate-100/70 relative shadow-xs">
          <img
            v-if="product.image"
            :src="activeImage"
            :alt="product.name"
            referrerpolicy="no-referrer"
            class="w-full h-full object-contain transform hover:scale-[1.02] transition-transform duration-500 mix-blend-multiply"
          />
          <div v-else class="flex flex-col items-center justify-center text-center p-6 space-y-3 font-sans text-slate-400">
            <div class="w-16 h-16 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
              <ImageOff class="w-8 h-8 stroke-[1.5]" />
            </div>
            <div class="space-y-1">
              <span class="text-sm font-bold text-slate-800 block">No Product Image Available</span>
              <span class="text-xs block max-w-[240px]">This catalogue space is currently empty.</span>
            </div>
          </div>

          <!-- upper tag chip -->
          <span v-if="product.tags && product.tags.length > 0 && product.image" class="absolute top-4 left-4 bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-lg uppercase tracking-wider shadow-xs">
            {{ product.tags[0] }}
          </span>
        </div>

        <!-- Thumbnails list slider -->
        <div v-if="product.images && product.images.length > 1" class="flex gap-3 overflow-x-auto pb-1 mt-4 scrollbar-none">
          <button
            v-for="imgUrl in product.images"
            :key="imgUrl"
            @click="activeImage = imgUrl"
            class="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 bg-white border-2 rounded-xl overflow-hidden p-2 flex items-center justify-center transition-all cursor-pointer"
            :class="activeImage === imgUrl ? 'border-blue-600' : 'border-slate-100 hover:border-slate-300'"
          >
            <img :src="imgUrl" alt="Thumbnail Close-up" referrerpolicy="no-referrer" class="w-full h-full object-contain mix-blend-multiply" />
          </button>
        </div>
      </div>

      <!-- Right Side: Options & Details Form controls -->
      <div class="lg:col-span-6 space-y-6">
        <div class="space-y-3">
          <span class="text-xs text-blue-600 font-bold uppercase tracking-wider">{{ product.category }}</span>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight font-headline">
            {{ product.name }}
          </h1>

          <!-- Star metrics -->
          <div class="flex items-center gap-3">
            <div class="flex items-center gap-0.5 text-amber-500">
              <Star class="w-4 h-4 fill-amber-500 text-amber-500" />
              <Star class="w-4 h-4 fill-amber-500 text-amber-500" />
              <Star class="w-4 h-4 fill-amber-500 text-amber-500" />
              <Star class="w-4 h-4 fill-amber-500 text-amber-500" />
              <Star v-if="product.rating >= 4.5" class="w-4 h-4 fill-amber-500 text-amber-500" />
              <StarHalf v-else class="w-4 h-4 fill-amber-500 text-amber-500" />
            </div>
            <span class="text-xs text-slate-500 font-semibold">
              {{ product.rating.toFixed(1) }} rating (based on {{ product.reviewCount }} customer reviews)
            </span>
          </div>
        </div>

        <!-- Pricing strip -->
        <div class="flex items-baseline gap-3 pb-4 border-b border-slate-100">
          <span class="text-2xl sm:text-3xl font-extrabold font-mono text-blue-600">
            ${{ product.price.toFixed(2) }}
          </span>
          <span v-if="product.originalPrice" class="text-sm line-through text-slate-400 font-mono">
            ${{ product.originalPrice.toFixed(2) }}
          </span>
        </div>

        <!-- Description Text -->
        <p class="text-sm text-slate-600 leading-relaxed font-sans">
          {{ product.description }}
        </p>

        <!-- Color Selector Dot representation -->
        <div v-if="product.colors && product.colors.length > 0" class="space-y-2">
          <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Select Color: <span class="text-slate-900 font-bold">{{ selectedColor }}</span>
          </span>
          <div class="flex gap-3">
            <button
              v-for="color in product.colors"
              :key="color.name"
              @click="selectedColor = color.name"
              class="w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer shadow-2xs"
              :class="selectedColor === color.name ? 'border-blue-600 scale-105' : 'border-slate-150'"
              :style="{ backgroundColor: color.value }"
              :title="color.name"
            >
              <Check v-if="selectedColor === color.name" class="w-4 h-4" :class="color.name === 'Lunar White' ? 'text-slate-900' : 'text-white'" />
            </button>
          </div>
        </div>

        <!-- Quantity selector and checkout button row -->
        <div class="space-y-3 pt-4 border-t border-slate-100">
          <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Adjustment Quantity</span>
          <div class="flex flex-wrap items-center gap-4">
            
            <!-- Box -->
            <div class="flex items-center border border-slate-200 bg-slate-50 rounded-xl h-12 overflow-hidden shadow-2xs">
              <button
                type="button"
                @click="handleQuantitySub"
                class="px-4 text-slate-500 hover:text-slate-900 font-bold text-center h-full hover:bg-slate-100 transition-colors cursor-pointer"
              >
                -
              </button>
              <span class="px-4 text-sm font-bold font-mono text-slate-900 w-12 text-center h-full flex items-center justify-center">
                {{ quantity }}
              </span>
              <button
                type="button"
                @click="handleQuantityAdd"
                class="px-4 text-slate-500 hover:text-slate-900 font-bold h-full hover:bg-slate-100 transition-colors cursor-pointer"
              >
                +
              </button>
            </div>

            <!-- Add To Cart -->
            <button
              @click="addToCart(product, quantity, selectedColor)"
              class="flex-grow h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-all shadow-xs hover:shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShoppingBag class="w-4 h-4" />
              <span>Add to Shopping Cart</span>
            </button>

            <!-- Wishlist toggle -->
            <button
              @click="toggleWishlist(product)"
              class="w-12 h-12 rounded-xl flex items-center justify-center border shadow-2xs transition-all cursor-pointer"
              :class="isWishlined
                ? 'bg-rose-500 text-white border-rose-500 hover:bg-rose-600'
                : 'border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300'"
            >
              <Heart class="w-5 h-5" :class="{ 'fill-white': isWishlined }" />
            </button>

          </div>
        </div>

        <!-- Specification specs toggler boxes -->
        <div v-if="product.specifications && product.specifications.length > 0" class="pt-6 border-t border-slate-100">
          <div class="flex gap-4 border-b border-slate-100 pb-2">
            <button
              @click="activeTabPanel = 'details'"
              class="text-sm font-bold pb-1 border-b-2 transition-all cursor-pointer"
              :class="activeTabPanel === 'details' ? 'text-blue-600 border-blue-600' : 'text-slate-400 border-transparent hover:text-slate-600'"
            >
              Highlights
            </button>
            <button
              @click="activeTabPanel = 'specs'"
              class="text-sm font-bold pb-1 border-b-2 transition-all cursor-pointer"
              :class="activeTabPanel === 'specs' ? 'text-blue-600 border-blue-600' : 'text-slate-400 border-transparent hover:text-slate-600'"
            >
              Specifications
            </button>
          </div>

          <!-- Tab Display Panel contents -->
          <div class="pt-4 text-sm text-slate-600 leading-relaxed font-sans">
            <div v-if="activeTabPanel === 'details'" class="space-y-3">
              <p>Designed under strict e-commerce guidelines. Double-wall materials ensure the peak of physical durability and wear-resistance over long lifetimes.</p>
              <div class="flex items-center gap-2 text-xs text-blue-700 font-semibold bg-blue-50 p-3 rounded-xl border border-blue-100 shadow-2xs">
                <Award class="w-4 h-4 text-blue-600" />
                <span>Includes complimentary 12-month hardware warranty & lifetime repair pathways.</span>
              </div>
            </div>

            <table v-if="activeTabPanel === 'specs'" class="w-full text-left border-collapse">
              <tbody>
                <tr v-for="(spec, index) in product.specifications" :key="index" class="border-b border-slate-100 text-xs">
                  <td class="py-2.5 font-bold text-slate-405 w-36 uppercase tracking-wider">{{ spec.label }}</td>
                  <td class="py-2.5 text-slate-800 font-medium">{{ spec.value }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>

    <!-- Related Products Section -->
    <section v-if="relatedProducts.length > 0" class="pt-12 border-t border-slate-100/80">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-2">
        <div>
          <h2 class="text-xl font-extrabold text-slate-900 tracking-tight font-headline">
            Related Products For You
          </h2>
          <p class="text-xs text-slate-405 font-medium">Recommended alternatives based on category overlap and price proximity</p>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-[10px] bg-blue-50 text-blue-600 border border-blue-100/50 px-2.5 py-1 rounded-full font-bold tracking-wider uppercase">
            Smart Match Engine
          </span>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div
          v-for="{ product: relItem, reason } in relatedProducts"
          :key="relItem.id"
          @click="handleRelatedClick(relItem.id)"
          class="bg-white border border-slate-100 rounded-[2rem] p-4 hover:shadow-lg hover:border-blue-100 transition-all duration-300 cursor-pointer group flex flex-col justify-between relative"
        >
          <!-- Reason Explanation Tag badge -->
          <div class="absolute top-3 left-3 z-10">
            <span class="text-[9px] font-black tracking-widest uppercase px-2 py-0.5 rounded-lg shadow-2xs border"
              :class="reason === 'Same Category' 
                ? 'bg-violet-50 text-violet-600 border-violet-100/60'
                : reason === 'Similar Price' || reason === 'Comparable Price'
                ? 'bg-emerald-50 text-emerald-600 border-emerald-100/60'
                : 'bg-indigo-50 text-indigo-600 border-indigo-100/60'"
            >
              {{ reason }}
            </span>
          </div>

          <!-- Product Thumbnail container -->
          <div class="w-full aspect-square bg-slate-50/70 rounded-2xl overflow-hidden p-3.5 flex items-center justify-center border border-slate-100/50 mb-4 group-hover:bg-blue-50/10 transition-colors">
            <img 
              :src="relItem.image" 
              :alt="relItem.name" 
              referrerpolicy="no-referrer" 
              class="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-305" 
            />
          </div>

          <!-- Info and price stats -->
          <div class="space-y-2 flex-grow flex flex-col justify-between">
            <div class="space-y-1">
              <span class="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">{{ relItem.category }}</span>
              <h3 class="text-xs font-bold text-slate-800 line-clamp-2 group-hover:text-blue-600 transition-colors leading-snug">
                {{ relItem.name }}
              </h3>
            </div>

            <div class="flex items-center justify-between pt-2 border-t border-slate-50 mt-1">
              <span class="text-sm font-extrabold font-mono text-slate-950">
                ${{ relItem.price.toFixed(2) }}
              </span>
              <div class="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-lg text-[10px] font-bold text-amber-700">
                <Star class="w-3 h-3 fill-amber-400 text-amber-400" />
                <span>{{ relItem.rating.toFixed(1) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>
