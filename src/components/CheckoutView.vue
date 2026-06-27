<script setup lang="ts">
import { ref, computed } from "vue";
import { CreditCard, ShieldCheck, ShoppingBag, Loader2, ArrowLeft, Heart, ImageOff } from "lucide-vue-next";
import { CartItem, ActiveTab, Order } from "../types";

const props = defineProps<{
  cart: CartItem[];
  submitOrder: (shippingAddress: string, couponCode?: string) => Promise<boolean>;
  triggerRouteAnimation: (targetTab: ActiveTab) => void;
  addToast: (message: string, type: "success" | "error" | "info") => void;
}>();

// Form and Submission states
const isSubmitting = ref(false);
const orderSuccess = ref(false);
const orderNumber = ref<string>("");
const email = ref("");
const fullName = ref("");
const address = ref("");
const city = ref("");
const state = ref("");
const zipCode = ref("");
const cardNumber = ref("");
const cardExpiry = ref("");
const cardCvv = ref("");

// Coupon/Promo Code states
const couponInput = ref("");
const appliedCoupon = ref("");

const handleApplyCoupon = () => {
  if (couponInput.value.trim().toUpperCase() === "OFFER25") {
    appliedCoupon.value = "OFFER25";
    props.addToast("25% OFF Promo Coupon applied successfully!", "success");
    couponInput.value = "";
  } else {
    props.addToast("Invalid Promo Coupon code", "error");
  }
};

const handleRemoveCoupon = () => {
  appliedCoupon.value = "";
  props.addToast("Promo Coupon removed", "info");
};

// Subtotals calculated dynamically
const subtotal = computed(() => {
  return props.cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
});

const discountAmount = computed(() => {
  return appliedCoupon.value === "OFFER25" ? subtotal.value * 0.25 : 0;
});

const discountedSubtotal = computed(() => {
  return subtotal.value - discountAmount.value;
});

const estimatedTax = computed(() => {
  return discountedSubtotal.value * 0.0825;
});

const shippingCost = computed(() => {
  return discountedSubtotal.value > 150 ? 0 : discountedSubtotal.value > 0 ? 15.00 : 0;
});

const grandTotal = computed(() => {
  return discountedSubtotal.value + estimatedTax.value + shippingCost.value;
});

const formatCardNumber = (value: string) => {
  const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
  const matches = v.match(/\d{4,16}/g);
  const match = (matches && matches[0]) || "";
  const parts = [];

  for (let i = 0, len = match.length; i < len; i += 4) {
    parts.push(match.substring(i, i + 4));
  }

  if (parts.length > 0) {
    return parts.join(" ");
  } else {
    return v;
  }
};

const handleCardNumberInput = (e: Event) => {
  const target = e.target as HTMLInputElement;
  cardNumber.value = formatCardNumber(target.value);
};

const handleCvvInput = (e: Event) => {
  const target = e.target as HTMLInputElement;
  cardCvv.value = target.value.replace(/[^0-9]/g, "");
};

const handleCheckoutSubmit = async (e: Event) => {
  e.preventDefault();

  if (!email.value || !fullName.value || !address.value || !city.value || !state.value || !zipCode.value) {
    props.addToast("Please fill in all shipping details.", "error");
    return;
  }

  // Simple custom card validations
  if (cardNumber.value.replace(/\s/g, "").length < 16) {
    props.addToast("Please enter a valid 16-digit credit card number.", "error");
    return;
  }

  isSubmitting.value = true;

  const fullAddress = `${address.value}, ${city.value}, ${state.value} ${zipCode.value}`;
  const success = await props.submitOrder(fullAddress, appliedCoupon.value);
  
  isSubmitting.value = false;

  if (success) {
    orderNumber.value = `ORD-${Date.now().toString(36).toUpperCase()}`;
    
    // Show success overlay immediately
    orderSuccess.value = true;
    
    // Clear form after successful order
    email.value = "";
    fullName.value = "";
    address.value = "";
    city.value = "";
    state.value = "";
    zipCode.value = "";
    cardNumber.value = "";
    cardExpiry.value = "";
    cardCvv.value = "";
    appliedCoupon.value = "";
    
    // Navigate to profile after user sees the success overlay
    setTimeout(() => {
      props.triggerRouteAnimation("profile");
    }, 5000);
  }
};
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
    
    <!-- Navigation Return -->
    <div class="text-left">
      <button
        @click="triggerRouteAnimation('cart')"
        class="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-900 cursor-pointer transition-colors"
      >
        <ArrowLeft class="w-4 h-4 text-blue-600" />
        <span>Adjust items in cart</span>
      </button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
      
      <!-- Left Hand: Shipping options form -->
      <form @submit="handleCheckoutSubmit" class="lg:col-span-7 space-y-6 bg-white border border-slate-100/70 p-6 rounded-3xl shadow-xs text-left">
        
        <h2 class="text-xl font-bold text-slate-900 border-b border-slate-100 pb-3 font-headline">
          Secure Delivery Address
        </h2>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans">
          <div class="sm:col-span-2 space-y-1.5">
            <label class="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
            <input
              type="email"
              required
              v-model="email"
              placeholder="you@domain.com"
              class="w-full h-11 px-4 border border-slate-200 bg-slate-50 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-505 text-sm focus:border-transparent transition-all"
            />
          </div>

          <div class="sm:col-span-2 space-y-1.5">
            <label class="text-xs font-bold text-slate-400 uppercase tracking-wider">Full Identification Name</label>
            <input
              type="text"
              required
              v-model="fullName"
              placeholder="Jane Smith"
              class="w-full h-11 px-4 border border-slate-200 bg-slate-50 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-505 text-sm focus:border-transparent transition-all"
            />
          </div>

          <div class="sm:col-span-2 space-y-1.5">
            <label class="text-xs font-bold text-slate-400 uppercase tracking-wider">Street Delivery Address</label>
            <input
              type="text"
              required
              v-model="address"
              placeholder="128 Blue Spruce Drive"
              class="w-full h-11 px-4 border border-slate-200 bg-slate-50 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-505 text-sm focus:border-transparent transition-all"
            />
          </div>

          <div class="space-y-1.5">
            <label class="text-xs font-bold text-slate-400 uppercase tracking-wider">City</label>
            <input
              type="text"
              required
              v-model="city"
              placeholder="San Francisco"
              class="w-full h-11 px-4 border border-slate-200 bg-slate-50 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-505 text-sm focus:border-transparent transition-all"
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div class="space-y-1.5">
              <label class="text-xs font-bold text-slate-400 uppercase tracking-wider">State</label>
              <input
                type="text"
                required
                v-model="state"
                placeholder="CA"
                class="w-full h-11 px-4 border border-slate-200 bg-slate-50 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-505 text-sm focus:border-transparent transition-all"
              />
            </div>
            <div class="space-y-1.5">
              <label class="text-xs font-bold text-slate-400 uppercase tracking-wider">ZIP Code</label>
              <input
                type="text"
                required
                v-model="zipCode"
                placeholder="94103"
                class="w-full h-11 px-4 border border-slate-200 bg-slate-50 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-505 text-sm focus:border-transparent transition-all"
              />
            </div>
          </div>
        </div>

        <!-- Secure Credit Card inputs -->
        <div class="pt-6 border-t border-slate-100 space-y-4">
          <h3 class="text-base font-bold text-slate-900 flex items-center gap-2 font-headline">
            <CreditCard class="w-5 h-5 text-blue-600 animate-pulse" />
            <span>Credit Card Credentials</span>
          </h3>

          <div class="grid grid-cols-1 sm:grid-cols-4 gap-4 font-mono">
            <div class="sm:col-span-2 space-y-1.5">
              <label class="text-xs font-bold text-slate-400 uppercase tracking-wider font-sans">Card Number</label>
              <input
                type="text"
                required
                maxLength="19"
                :value="cardNumber"
                @input="handleCardNumberInput"
                placeholder="4111 2222 3333 4444"
                class="w-full h-11 px-4 border border-slate-200 bg-slate-50 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-505 text-sm focus:border-transparent transition-all font-mono"
              />
            </div>

            <div class="space-y-1.5">
              <label class="text-xs font-bold text-slate-400 uppercase tracking-wider font-sans">Expiration Date</label>
              <input
                type="text"
                required
                maxLength="5"
                v-model="cardExpiry"
                placeholder="12/28"
                class="w-full h-11 px-4 border border-slate-200 bg-slate-50 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-505 text-sm focus:border-transparent transition-all font-mono"
              />
            </div>

            <div class="space-y-1.5">
              <label class="text-xs font-bold text-slate-400 uppercase tracking-wider font-sans">CVV Code</label>
              <input
                type="password"
                required
                maxLength="3"
                :value="cardCvv"
                @input="handleCvvInput"
                placeholder="***"
                class="w-full h-11 px-4 border border-slate-200 bg-slate-50 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-505 text-sm focus:border-transparent transition-all font-mono"
              />
            </div>
          </div>
        </div>

        <div class="pt-4 border-t border-slate-100">
          <button
            type="submit"
            :disabled="isSubmitting"
            class="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-all shadow-xs hover:shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-80"
          >
            <template v-if="isSubmitting">
              <Loader2 class="w-5 h-5 animate-spin" />
              <span>Processing secure transaction...</span>
            </template>
            <template v-else>
              <ShieldCheck class="w-4.5 h-4.5" />
              <span>Authorize Secure Charge (${{ grandTotal.toFixed(2) }})</span>
            </template>
          </button>
        </div>

      </form>

      <!-- Success Confirmation Overlay -->
      <transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
      >
        <div
          v-if="orderSuccess"
          class="fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div class="bg-white rounded-[2rem] p-8 max-w-md w-full shadow-2xl border border-emerald-100 text-center space-y-6">
            <div class="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto border-4 border-emerald-100">
              <svg class="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <div class="space-y-2">
              <h2 class="text-2xl font-black text-slate-900 font-headline">Order Confirmed!</h2>
              <p class="text-sm text-slate-500 font-medium">Thank you for your purchase. Your order has been placed successfully.</p>
              <p class="text-xs font-mono font-bold text-blue-600 bg-blue-50 inline-block px-3 py-1 rounded-lg">
                {{ orderNumber }}
              </p>
            </div>
            <p class="text-[10px] text-slate-400 uppercase tracking-wider">Redirecting to your profile...</p>
          </div>
        </div>
      </transition>

      <!-- Right Hand: Order contents breakdown -->
      <div class="lg:col-span-5 bg-white border border-slate-100/70 p-6 rounded-3xl space-y-6 shadow-xs h-fit text-left">
        <h2 class="text-base font-bold text-slate-900 border-b border-slate-100 pb-2 font-headline">
          Order Review Summary ({{ cart.length }})
        </h2>

        <!-- Item scroll list -->
        <div class="space-y-4 max-h-[280px] overflow-y-auto pr-1">
          <div v-for="(item, index) in cart" :key="index" class="flex gap-4 items-center justify-between">
            <div class="flex gap-3 items-center">
              <div class="w-12 h-12 bg-slate-50 rounded-xl p-1.5 flex items-center justify-center border border-slate-100 flex-shrink-0">
                <img v-if="item.product.image" :src="item.product.image" :alt="item.product.name" referrerpolicy="no-referrer" class="w-full h-full object-contain mix-blend-multiply" />
                <ImageOff v-else class="w-5 h-5 text-slate-350 stroke-[1.5]" />
              </div>
              <div>
                <h4 class="text-xs font-bold text-slate-800 line-clamp-1 max-w-[200px]">
                  {{ item.product.name }}
                </h4>
                <span class="text-[10px] text-slate-400 font-bold font-mono">
                  Qty {{ item.quantity }} {{ item.selectedColor ? `(${item.selectedColor})` : "" }}
                </span>
              </div>
            </div>

            <span class="text-xs font-bold font-mono text-slate-700">
              ${{ (item.product.price * item.quantity).toFixed(2) }}
            </span>
          </div>
        </div>

        <!-- Coupon / Promo Code Input -->
        <div class="border-t border-slate-100 pt-4 space-y-2">
          <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider">Promo Code</label>
          <div v-if="!appliedCoupon" class="flex gap-2">
            <input
              type="text"
              v-model="couponInput"
              placeholder="e.g. OFFER25"
              class="flex-grow h-9 px-3 border border-slate-200 bg-slate-50 text-slate-900 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs transition-all uppercase"
            />
            <button
              type="button"
              @click="handleApplyCoupon"
              class="px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
            >
              Apply
            </button>
          </div>
          <div v-else class="flex items-center justify-between bg-blue-50/50 border border-blue-100 p-2.5 rounded-xl text-xs text-blue-700 font-bold">
            <div class="flex items-center gap-1.5">
              <span class="bg-blue-600 text-white px-1.5 py-0.5 rounded text-[10px] tracking-wide uppercase">Active</span>
              <span>{{ appliedCoupon }} (25% OFF)</span>
            </div>
            <button
              type="button"
              @click="handleRemoveCoupon"
              class="text-rose-600 hover:text-rose-800 hover:underline"
            >
              Remove
            </button>
          </div>
        </div>

        <!-- Money summary lines -->
        <div class="border-t border-slate-100 pt-4 space-y-3 font-medium text-xs text-slate-550 font-sans">
          <div class="flex justify-between">
            <span>Subtotal Cost</span>
            <span class="font-mono text-slate-900 font-bold">${{ subtotal.toFixed(2) }}</span>
          </div>
          <div v-if="appliedCoupon === 'OFFER25'" class="flex justify-between text-emerald-600 font-bold">
            <span>Promo Discount (25%)</span>
            <span class="font-mono">-${{ discountAmount.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between">
            <span>Estimated Tax (8.25%)</span>
            <span class="font-mono text-slate-900 font-bold">${{ estimatedTax.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between">
            <span>Shipping Fee</span>
            <span class="font-mono text-slate-900 font-bold">
              {{ shippingCost === 0 ? "FREE" : `$${shippingCost.toFixed(2)}` }}
            </span>
          </div>
          <div class="flex justify-between items-baseline pt-2 border-t border-slate-100 text-sm font-bold text-slate-900">
            <span>Grand Charged Sum</span>
            <span class="font-mono text-lg font-extrabold text-blue-600">
              ${{ grandTotal.toFixed(2) }}
            </span>
          </div>
        </div>

        <div class="flex items-start gap-2.5 bg-emerald-50 p-4.5 rounded-2xl border border-emerald-100 text-xs text-emerald-700 font-medium">
          <ShieldCheck class="w-5 h-5 flex-shrink-0 text-emerald-600" />
          <span>Secure 256-bit encrypted protocol. Your sensitive payment details are strictly processed locally and are never stored.</span>
        </div>

      </div>

    </div>

  </div>
</template>
