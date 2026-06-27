<script setup lang="ts">
import { computed } from "vue";
import { Trash2, ShoppingBag, ArrowRight, ShieldCheck, Heart, ArrowLeft, ImageOff } from "lucide-vue-next";
import { CartItem, ActiveTab, Product } from "../types";

const props = defineProps<{
  cart: CartItem[];
  updateCartQuantity: (index: number, q: number) => void;
  removeFromCart: (index: number) => void;
  triggerRouteAnimation: (targetTab: ActiveTab) => void;
  toggleWishlist: (product: Product) => void;
  isLoggedIn?: boolean;
  setProfileActiveSubTab?: (tab: "account" | "orders" | "wishlist") => void;
  addToast?: (message: string, type: "success" | "error" | "info") => void;
}>();

// Calculate aggregate numbers Dynamically
const subtotal = computed(() => {
  return props.cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
});

const estimatedTax = computed(() => {
  return subtotal.value * 0.0825; // 8.25% standard tax
});

const shippingCost = computed(() => {
  return subtotal.value > 150 ? 0 : subtotal.value > 0 ? 15.00 : 0; // free above $150
});

const grandTotal = computed(() => {
  return subtotal.value + estimatedTax.value + shippingCost.value;
});

const handleCheckoutAction = () => {
  if (!props.isLoggedIn) {
    if (props.addToast) {
      props.addToast("Please login first to proceed to checkout.", "info");
    }
    if (props.setProfileActiveSubTab) {
      props.setProfileActiveSubTab("account");
    }
    props.triggerRouteAnimation("profile");
  } else {
    props.triggerRouteAnimation("checkout");
  }
};
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
    <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-8 font-headline">
      Your Shopping Cart
    </h1>

    <div v-if="cart.length === 0" class="flex flex-col items-center justify-center py-20 px-4 text-center bg-white border border-slate-100/70 rounded-3xl shadow-xs">
      <div class="p-4 bg-blue-50 rounded-full text-blue-600 mb-4 animate-bounce">
        <ShoppingBag class="w-10 h-10 animate-pulse" />
      </div>
      <h2 class="font-extrabold text-lg text-slate-900 font-headline">Your cart is empty</h2>
      <p class="text-sm text-slate-505 mt-2 max-w-sm leading-relaxed font-sans">
        You haven't added any premium products to your cart yet. Explore our catalog to find your standard of audio or gear.
      </p>
      <button
        @click="triggerRouteAnimation('shop')"
        class="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-all cursor-pointer shadow-xs hover:shadow-md"
      >
        Start Exploring Store
      </button>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      <!-- Left Block: List items -->
      <div class="lg:col-span-8 space-y-4">
        <div
          v-for="(item, index) in cart"
          :key="`${item.product.id}-${item.selectedColor}-${index}`"
          class="bg-white border border-slate-100/70 rounded-3xl p-5 flex flex-col sm:flex-row gap-5 items-center justify-between shadow-xs hover:border-slate-200/50 hover:shadow-sm transition-all duration-300"
        >
          <!-- Thumb and Details -->
          <div class="flex gap-4 items-center w-full sm:w-auto">
            <div class="w-20 h-20 bg-slate-50/70 rounded-2xl p-2.5 flex items-center justify-center flex-shrink-0 border border-slate-100">
              <img
                v-if="item.product.image"
                :src="item.product.image"
                :alt="item.product.name"
                referrerpolicy="no-referrer"
                class="w-full h-full object-contain mix-blend-multiply"
              />
              <ImageOff v-else class="w-6 h-6 text-slate-300 stroke-[1.5]" />
            </div>
            <div class="space-y-1 text-left">
              <span class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                {{ item.product.category }}
              </span>
              <h3 class="font-bold text-sm text-slate-900 leading-snug">
                {{ item.product.name }}
              </h3>
              <span v-if="item.selectedColor" class="inline-flex items-center gap-1.5 text-xs text-slate-505 font-medium">
                Option: <span class="text-slate-800 font-bold">{{ item.selectedColor }}</span>
              </span>
            </div>
          </div>

          <!-- Subtotals & click counters adjustment -->
          <div class="flex flex-wrap items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-0 border-slate-100">
            
            <!-- +/- buttons -->
            <div class="flex items-center border border-slate-200 bg-slate-50 rounded-xl overflow-hidden h-9 shadow-2xs">
              <button
                @click="updateCartQuantity(index, item.quantity - 1)"
                class="px-3 text-slate-505 hover:text-slate-905 font-bold h-full hover:bg-slate-100 transition-all cursor-pointer"
              >
                -
              </button>
              <span class="px-2 text-xs font-bold font-mono text-slate-900 w-8 text-center">
                {{ item.quantity }}
              </span>
              <button
                @click="updateCartQuantity(index, item.quantity + 1)"
                class="px-3 text-slate-505 hover:text-slate-905 font-bold h-full hover:bg-slate-100 transition-all cursor-pointer"
              >
                +
              </button>
            </div>

            <!-- Pricing segment -->
            <div class="text-right">
              <span class="text-sm font-bold font-mono text-slate-900 block">
                ${{ (item.product.price * item.quantity).toFixed(2) }}
              </span>
              <span class="text-[10px] text-slate-450 font-mono block">
                ${{ item.product.price.toFixed(2) }} each
              </span>
            </div>

            <!-- Actions Trash -->
            <div class="flex gap-2">
              <button
                @click="toggleWishlist(item.product)"
                class="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                title="Move to favorites"
              >
                <Heart class="w-4.5 h-4.5" />
              </button>
              <button
                @click="removeFromCart(index)"
                class="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                title="Delete item"
              >
                <Trash2 class="w-4.5 h-4.5" />
              </button>
            </div>

          </div>

        </div>

        <!-- Back shopping button -->
        <div class="text-left">
          <button
            @click="triggerRouteAnimation('shop')"
            class="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-950 cursor-pointer pt-2 transition-all"
          >
            <ArrowLeft class="w-4 h-4 text-blue-600" />
            <span>Return to Catalog Store</span>
          </button>
        </div>
      </div>

      <!-- Right Block: Summary card section -->
      <div class="lg:col-span-4 bg-white border border-slate-100/70 rounded-3xl p-6 space-y-6 shadow-xs sticky top-24">
        <h3 class="font-bold text-base text-slate-900 font-headline pb-2 border-b border-slate-100 text-left">
          Order Estimator Summary
        </h3>
        
        <div class="space-y-3 font-medium text-sm text-slate-650 border-b border-slate-100 pb-4 text-left">
          <div class="flex justify-between">
            <span>Items Subtotal</span>
            <span class="font-mono text-slate-900 font-bold">${{ subtotal.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between">
            <span>Estimated Taxes (8.25%)</span>
            <span class="font-mono text-slate-900 font-bold">${{ estimatedTax.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between">
            <span>Direct Post Shipping</span>
            <span class="font-mono text-slate-900 font-bold text-slate-800">
              {{ shippingCost === 0 ? "FREE" : `$${shippingCost.toFixed(2)}` }}
            </span>
          </div>
          
          <!-- Free delivery prompt banner -->
          <div v-if="shippingCost > 0" class="bg-blue-50/50 border border-blue-50/80 rounded-xl p-3 text-xs text-blue-700 font-semibold leading-relaxed mt-2 text-left">
            Add just <span class="font-bold font-mono">${{ (150 - subtotal).toFixed(2) }}</span> more to unlock complimentary premium shipping!
          </div>
        </div>

        <!-- Total -->
        <div class="flex justify-between items-baseline pt-2">
          <span class="text-base font-bold text-slate-900">Grand Total</span>
          <span class="text-xl sm:text-2xl font-extrabold font-mono text-blue-600">
            ${{ grandTotal.toFixed(2) }}
          </span>
        </div>

        <button
          @click="handleCheckoutAction"
          class="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-all shadow-xs hover:shadow-md flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Proceed to Checkout</span>
          <ArrowRight class="w-4 h-4" />
        </button>

        <!-- Security banner -->
        <div class="flex items-center gap-2.5 text-xs text-slate-400 pt-2 justify-center">
          <ShieldCheck class="w-4 h-4 text-emerald-500" />
          <span>Checkout matches SSL structural compliance.</span>
        </div>

      </div>

    </div>
  </div>
</template>
