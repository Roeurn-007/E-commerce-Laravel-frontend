<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { Sparkles, Gift, Copy, Check, X, ArrowRight, ShoppingCart, Percent, TrendingUp } from "lucide-vue-next";
import { Product, ActiveTab } from "../types";

const props = defineProps<{
  products: Product[];
  triggerRouteAnimation: (targetTab: ActiveTab, prodId?: string) => void;
  addToCart: (product: Product, quantity: number, color?: string) => void;
  addToast: (message: string, type: "success" | "error" | "info") => void;
}>();

const isOpen = ref(false);
const hasCopied = ref(false);
const dontShowAgain = ref(false);

const popularProducts = computed(() => {
  return [...props.products]
    .sort((a, b) => b.rating * b.reviewCount - a.rating * a.reviewCount)
    .slice(0, 3);
});

const promoCode = "OFFER25";

onMounted(() => {
  const isDismissed = localStorage.getItem("promo_dismissed_v1");
  if (!isDismissed) {
    setTimeout(() => {
      isOpen.value = true;
    }, 3000);
  }
});

const handleCopyCode = () => {
  navigator.clipboard.writeText(promoCode);
  hasCopied.value = true;
  props.addToast("Promo discount code successfully copied to clipboard!", "success");
  setTimeout(() => {
    hasCopied.value = false;
  }, 3000);
};

const handleClose = () => {
  isOpen.value = false;
  if (dontShowAgain.value) {
    localStorage.setItem("promo_dismissed_v1", "true");
  }
};

const handleProductClick = (id: string) => {
  isOpen.value = false;
  props.triggerRouteAnimation("product-detail", id);
};
</script>

<template>
  <div>
    <!-- 🏷️ Floating Smart Widget to Re-open Promo Modal anywhere at anytime -->
    <div class="fixed bottom-6 right-6 z-40">
      <button
        type="button"
        @click="isOpen = true"
        class="group flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 hover:from-pink-600 hover:to-amber-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer font-sans"
      >
        <Gift class="w-5 h-5 animate-bounce group-hover:rotate-12" />
        <span class="text-xs font-extrabold tracking-wider uppercase">Hot Offers (25% OFF)</span>
        <span class="flex h-2 w-2 relative">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span class="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
        </span>
      </button>
    </div>

    <!-- Modal Transition -->
    <Transition name="fade">
      <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
        <!-- Dark Blur Overlay -->
        <div @click="handleClose" class="fixed inset-0 bg-slate-950/70 backdrop-blur-xs" />

        <!-- Immersive Advert Card Container -->
        <div class="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden z-50 font-sans modal-content">
          <!-- Top Colorful Header Banner -->
          <div class="relative bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 text-white py-10 px-8 text-center overflow-hidden">
            <!-- Visual noise/abstract ornaments -->
            <div class="absolute top-[-20%] left-[-20%] w-60 h-60 bg-white/10 blur-3xl rounded-full" />
            <div class="absolute bottom-[-30%] right-[-10%] w-52 h-52 bg-pink-400/20 blur-2xl rounded-full" />
            
            <!-- Close Button -->
            <button
              type="button"
              @click="handleClose"
              class="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white/90 hover:text-white transition-all cursor-pointer border border-white/10"
            >
              <X class="w-4 h-4" />
            </button>

            <!-- Sparkling Icon -->
            <div class="inline-flex items-center justify-center p-3 bg-white/10 rounded-3xl border border-white/20 mb-3.5 backdrop-blur-xs">
              <Sparkles class="w-6 h-6 text-yellow-300 animate-pulse" />
            </div>

            <h2 class="text-2xl sm:text-3xl font-black tracking-tight font-headline leading-tight">
              EXCLUSIVE MEMBER DEAL!
            </h2>
            <p class="text-white/80 text-xs font-semibold mt-1 tracking-wider uppercase">
              Take an extra 25% Off Popular Trending Gear
            </p>
          </div>

          <!-- Main Content Area -->
          <div class="p-6 sm:p-8 space-y-6">
            
            <!-- Coupon Copy Box -->
            <div class="bg-slate-50 border border-slate-150 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
              <div>
                <span class="block text-[10px] text-slate-400 font-bold uppercase tracking-widest">Your Private Coupon Code</span>
                <span class="text-base font-black text-indigo-950 tracking-wider font-mono">{{ promoCode }}</span>
              </div>
              <button
                type="button"
                @click="handleCopyCode"
                class="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white hover:text-yellow-300 font-bold text-xs rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer flex-shrink-0"
              >
                <template v-if="hasCopied">
                  <Check class="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copied!</span>
                </template>
                <template v-else>
                  <Copy class="w-3.5 h-3.5" />
                  <span>Copy Discount Code</span>
                </template>
              </button>
            </div>

            <!-- Popular Products Segment header -->
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="flex items-center gap-1.5 text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                  <TrendingUp class="w-4 h-4 text-pink-500" />
                  <span>Today's Top Popular Items</span>
                </span>
                <button
                  type="button"
                  @click="isOpen = false; triggerRouteAnimation('shop')"
                  class="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-0.5 hover:underline"
                >
                  <span>Explore all</span>
                  <ArrowRight class="w-3 h-3" />
                </button>
              </div>

              <!-- Horizontal visual product lists -->
              <div class="grid grid-cols-1 gap-2.5">
                <div
                  v-for="prod in popularProducts"
                  :key="prod.id"
                  @click="handleProductClick(prod.id)"
                  class="group flex gap-3 items-center p-2.5 rounded-2xl border border-slate-100/70 hover:border-indigo-200 bg-white hover:bg-indigo-50/20 transition-all shadow-[0_2px_8px_-3px_rgba(0,0,0,0.03)] hover:shadow-md cursor-pointer text-left relative"
                >
                  <!-- Discount Badge -->
                  <div class="absolute top-1.5 left-1.5 bg-rose-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-wider shadow-sm z-10 flex items-center gap-0.5">
                    <Percent class="w-2 h-2" />
                    <span>Save</span>
                  </div>

                  <!-- Image Thumbnail -->
                  <div class="w-14 h-14 bg-slate-50 group-hover:bg-white rounded-xl p-1.5 flex items-center justify-center border border-slate-100 flex-shrink-0">
                    <img
                      :src="prod.image"
                      :alt="prod.name"
                      referrerpolicy="no-referrer"
                      class="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform"
                    />
                  </div>

                  <!-- Name and Price tag -->
                  <div class="flex-grow space-y-0.5 min-w-0">
                    <h4 class="text-xs font-bold text-slate-800 group-hover:text-indigo-950 transition-colors line-clamp-1">
                      {{ prod.name }}
                    </h4>
                    <div class="flex items-center gap-2">
                      <span class="text-xs font-extrabold text-slate-900">
                        ${{ (prod.price * 0.75).toFixed(2) }}
                      </span>
                      <span class="text-[10px] text-slate-400 line-through">
                        ${{ prod.price.toFixed(2) }}
                      </span>
                      <span class="text-[9px] font-bold text-emerald-600 font-mono bg-emerald-50 px-1 rounded">
                        25% OFF
                      </span>
                    </div>
                  </div>

                  <!-- Fast Add Action -->
                  <button
                    type="button"
                    @click.stop="addToCart(prod, 1)"
                    class="p-2 border border-slate-100 hover:border-indigo-600 hover:bg-indigo-600 hover:text-white text-slate-500 rounded-xl transition-all shadow-2xs hover:shadow-sm"
                    title="Quick add to basket"
                  >
                    <ShoppingCart class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <!-- Dialog Footer Actions -->
            <div class="pt-2 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
              
              <!-- Remember Selection -->
              <label class="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-500 hover:text-slate-700 select-none">
                <input
                  type="checkbox"
                  v-model="dontShowAgain"
                  class="w-4 h-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500/30 cursor-pointer"
                />
                <span>Don't show this again in this session</span>
              </label>

              <!-- Dismiss -->
              <button
                type="button"
                @click="handleClose"
                class="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-150 text-slate-600 rounded-xl text-xs font-bold transition-all cursor-pointer text-center"
              >
                Dismiss Offer
              </button>
              
            </div>

          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-active .modal-content,
.fade-leave-active .modal-content {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.fade-enter-from .modal-content {
  opacity: 0;
  transform: translateY(30px) scale(0.9);
}

.fade-leave-to .modal-content {
  opacity: 0;
  transform: translateY(30px) scale(0.9);
}
</style>
