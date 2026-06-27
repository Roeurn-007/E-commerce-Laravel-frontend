<script setup lang="ts">
import { ToastMessage } from "../types";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-vue-next";

defineProps<{
  toasts: ToastMessage[];
  removeToast: (id: string) => void;
}>();
</script>

<template>
  <div class="fixed bottom-6 right-6 z-100 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
    <TransitionGroup name="toast-list">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="pointer-events-auto bg-white border border-slate-150 rounded-xl p-4 shadow-xl flex items-start gap-3 overflow-hidden relative"
      >
        <!-- Ambient accent background depending on toast type -->
        <div
          class="absolute top-0 left-0 w-1 h-full"
          :class="{
            'bg-emerald-500': toast.type === 'success',
            'bg-rose-500': toast.type === 'error',
            'bg-blue-600': toast.type === 'info',
          }"
        />

        <div class="flex-shrink-0 mt-0.5">
          <CheckCircle2 v-if="toast.type === 'success'" class="w-5 h-5 text-emerald-500" />
          <AlertCircle v-else-if="toast.type === 'error'" class="w-5 h-5 text-rose-500" />
          <Info v-else-if="toast.type === 'info'" class="w-5 h-5 text-blue-600" />
        </div>

        <div class="flex-grow text-left">
          <p class="text-sm font-semibold text-slate-800 leading-snug">
            {{ toast.message }}
          </p>
        </div>

        <button
          @click="removeToast(toast.id)"
          class="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer p-0.5 rounded-full hover:bg-slate-50"
        >
          <X class="w-4 h-4" />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-list-enter-active,
.toast-list-leave-active {
  transition: all 0.3s ease;
}
.toast-list-enter-from {
  opacity: 0;
  transform: translateY(30px) scale(0.9);
}
.toast-list-leave-to {
  opacity: 0;
  transform: scale(0.85);
}
</style>
