<script setup lang="ts">
import { Store, CreditCard, ShieldCheck } from "lucide-vue-next";

const currentYear = new Date().getFullYear();
</script>

<template>
  <footer class="bg-white text-slate-600 pt-16 pb-12 border-t border-slate-100">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Main Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 border-b border-slate-100 pb-12 mb-12">
        
        <!-- Brand Col -->
        <div class="lg:col-span-2">
          <span class="flex items-center gap-2 text-slate-900 font-bold text-xl mb-4 tracking-tight">
            <Store class="w-6 h-6 text-blue-600" />
            <span>MarketPlace</span>
          </span>
          <p class="text-sm text-slate-500 mb-6 max-w-sm leading-relaxed font-sans">
            Experience the standard of curated e-commerce structures. Crafting highly interactive shopping pathways for modern consumer items.
          </p>
          
          <!-- Trust Badges -->
          <div class="flex gap-4 items-center mt-4">
            <div class="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-150">
              <ShieldCheck class="w-4 h-4 text-emerald-500" />
              <span>100% Secured Payments</span>
            </div>
            <div class="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-150">
              <CreditCard class="w-4 h-4 text-blue-600" />
              <span>Dynamic Checkout v2</span>
            </div>
          </div>
        </div>

        <!-- Shop Column -->
        <div>
          <h3 class="text-slate-900 font-semibold text-xs uppercase tracking-wider mb-4">Shop</h3>
          <ul class="space-y-2.5 text-sm font-medium text-slate-500">
            <li><span class="hover:text-blue-600 transition-colors cursor-pointer">Electronics</span></li>
            <li><span class="hover:text-blue-600 transition-colors cursor-pointer">Audio Equipment</span></li>
            <li><span class="hover:text-blue-600 transition-colors cursor-pointer">Stoneware & Mugs</span></li>
            <li><span class="hover:text-blue-600 transition-colors cursor-pointer">Office Ergonomics</span></li>
          </ul>
        </div>

        <!-- Support Column -->
        <div>
          <h3 class="text-slate-900 font-semibold text-xs uppercase tracking-wider mb-4">Support</h3>
          <ul class="space-y-2.5 text-sm font-medium text-slate-500">
            <li><span class="hover:text-blue-600 transition-colors cursor-pointer">Track Your Order</span></li>
            <li><span class="hover:text-blue-600 transition-colors cursor-pointer">Returns & Exchanges</span></li>
            <li><span class="hover:text-blue-600 transition-colors cursor-pointer">Help Center FAQs</span></li>
            <li><span class="hover:text-blue-600 transition-colors cursor-pointer">Live Live Support</span></li>
          </ul>
        </div>

        <!-- Company Column -->
        <div>
          <h3 class="text-slate-900 font-semibold text-xs uppercase tracking-wider mb-4">Company</h3>
          <ul class="space-y-2.5 text-sm font-medium text-slate-500">
            <li><span class="hover:text-blue-600 transition-colors cursor-pointer">Our Story</span></li>
            <li><span class="hover:text-blue-600 transition-colors cursor-pointer">Path to Sustainability</span></li>
            <li><span class="hover:text-blue-600 transition-colors cursor-pointer">Affiliates & Partners</span></li>
            <li><span class="hover:text-blue-600 transition-colors cursor-pointer">Press Desk</span></li>
          </ul>
        </div>

      </div>

      <!-- Bottom Bar -->
      <div class="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-400 font-medium font-sans">
        <div>
          <p>© {{ currentYear }} MarketPlace Inc. Built for supreme speed and responsive layout fluidity.</p>
        </div>
        <div class="flex gap-6">
          <span class="hover:text-slate-600 transition-colors cursor-pointer">Privacy Charter</span>
          <span class="hover:text-slate-600 transition-colors cursor-pointer">Terms of Service</span>
          <span class="hover:text-slate-600 transition-colors cursor-pointer">Cookie Logs</span>
        </div>
      </div>

    </div>
  </footer>
</template>
