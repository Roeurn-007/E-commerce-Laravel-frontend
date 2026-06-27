<script setup lang="ts">
import { ref } from "vue";
import { X, Server, RefreshCw, CheckCircle, AlertTriangle, HelpCircle, FileText, Code, Database, Trash2 } from "lucide-vue-next";
import { Product } from "../types";

const props = defineProps<{
  isOpen: boolean;
  onClose: () => void;
  apiUrl: string;
  setApiUrl: (url: string) => void;
  apiStatus: "connected" | "offline" | "loading" | "untested";
  apiError: string | null;
  apiLastSync: string | null;
  autoSync: boolean;
  setAutoSync: (val: boolean) => void;
  testConnection: () => Promise<boolean>;
  syncProductsFromApi: () => Promise<boolean>;
  resetToMockData: () => void;
}>();

const urlInput = ref(props.apiUrl);
const isTesting = ref(false);
const isSyncing = ref(false);
const showSpecs = ref(false);

const handleSaveUrl = async () => {
  props.setApiUrl(urlInput.value);
  isTesting.value = true;
  await props.testConnection();
  isTesting.value = false;
};

const handleSync = async () => {
  isSyncing.value = true;
  await props.syncProductsFromApi();
  isSyncing.value = false;
};

const handleReset = () => {
  if (confirm("Are you sure you want to reset products to the default static catalog? This will overwrite items fetched from the API.")) {
    props.resetToMockData();
  }
};
</script>

<template>
  <transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="opacity-0 scale-95"
    enter-to-class="opacity-100 scale-100"
    leave-active-class="transition duration-150 ease-in"
    leave-from-class="opacity-100 scale-100"
    leave-to-class="opacity-0 scale-95"
  >
    <div
      v-if="isOpen"
      class="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      @click="onClose"
    >
      <div
        class="bg-white rounded-[2rem] w-full max-w-lg shadow-2xl border border-slate-100 text-left p-6 sm:p-8 space-y-6 relative"
        @click.stop
      >
        <!-- Modal Header -->
        <div class="flex justify-between items-center pb-4 border-b border-slate-100">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center border border-blue-100">
              <Server class="w-5 h-5" />
            </div>
            <div>
              <h3 class="text-lg font-extrabold text-slate-900 font-headline">API Connector</h3>
              <p class="text-xs text-slate-450">Synchronize products with your local server</p>
            </div>
          </div>
          <button
            type="button"
            @click="onClose"
            class="w-8 h-8 rounded-full hover:bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <X class="w-4 h-4" />
          </button>
        </div>

        <!-- Connection Status Display Card -->
        <div class="rounded-2xl border p-4.5 space-y-3.5 transition-all"
             :class="{
               'bg-emerald-50/40 border-emerald-100': apiStatus === 'connected',
               'bg-amber-50/40 border-amber-100': apiStatus === 'offline',
               'bg-blue-50/40 border-blue-100': apiStatus === 'loading',
               'bg-slate-50 border-slate-200': apiStatus === 'untested',
             }">
          <div class="flex justify-between items-center">
            <span class="text-xs font-bold text-slate-500 uppercase tracking-wider block">Connection State</span>
            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5"
                  :class="{
                    'bg-emerald-100 text-emerald-800': apiStatus === 'connected',
                    'bg-amber-100 text-amber-800': apiStatus === 'offline',
                    'bg-blue-100 text-blue-800': apiStatus === 'loading',
                    'bg-slate-200 text-slate-700': apiStatus === 'untested',
                  }">
              <span class="w-1.5 h-1.5 rounded-full"
                    :class="{
                      'bg-emerald-500 animate-pulse': apiStatus === 'connected',
                      'bg-amber-500 animate-bounce': apiStatus === 'offline',
                      'bg-blue-500 animate-spin': apiStatus === 'loading',
                      'bg-slate-550': apiStatus === 'untested',
                    }" />
              <span>{{ apiStatus === 'connected' ? 'Connected' : (apiStatus === 'offline' ? 'Offline / Mock Mode' : (apiStatus === 'loading' ? 'Testing...' : 'Untested')) }}</span>
            </span>
          </div>

          <p class="text-xs text-slate-600 leading-relaxed font-sans">
            <template v-if="apiStatus === 'connected'">
              Successfully established communication with <strong class="font-mono text-emerald-700">{{ apiUrl }}</strong>. Real-time catalogue updates are active.
            </template>
            <template v-else-if="apiStatus === 'offline'">
              Unable to contact <strong class="font-mono text-amber-700">{{ apiUrl }}</strong>. The application is gracefully falling back to our <strong>high-fidelity offline catalog data</strong>.
            </template>
            <template v-else-if="apiStatus === 'loading'">
              Sending HTTP handshake packets to local backend endpoint...
            </template>
            <template v-else>
              Configure your local backend server parameters below to fetch products, send order receipts, and sync user accounts.
            </template>
          </p>

          <!-- Last Sync info -->
          <div v-if="apiLastSync" class="text-[10px] text-slate-400 font-mono flex items-center gap-1">
            <CheckCircle class="w-3.5 h-3.5 text-emerald-500" />
            <span>Last products synchronised: <strong>{{ apiLastSync }}</strong></span>
          </div>

          <!-- Error trace block -->
          <div v-if="apiError && apiStatus === 'offline'" class="mt-2 text-[11px] text-amber-800 bg-amber-100/50 rounded-lg p-2.5 font-mono space-y-1">
            <div class="font-bold flex items-center gap-1">
              <AlertTriangle class="w-3.5 h-3.5" />
              <span>Connection Refusal Details:</span>
            </div>
            <p class="break-all opacity-90 font-medium">{{ apiError }}</p>
            <div class="text-[10px] text-amber-700 font-sans mt-1.5 border-t border-amber-200/50 pt-1">
              💡 <strong>Troubleshooting:</strong> 1) Confirm your backend server is running on port 8000. 2) Ensure <strong>CORS</strong> header permissions are enabled on your backend to allow requests from the preview domain!
            </div>
          </div>
        </div>

        <!-- Connection Configurations Form -->
        <div class="space-y-4">
          <div class="space-y-1.5">
            <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">API Root Base URL</label>
            <div class="flex gap-2">
              <input
                type="text"
                v-model="urlInput"
                placeholder="http://127.0.0.1:8000/api"
                class="flex-1 h-11 px-3 border border-slate-200 bg-slate-50 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs font-mono"
              />
              <button
                @click="handleSaveUrl"
                :disabled="isTesting"
                class="px-4 bg-slate-900 hover:bg-slate-850 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <RefreshCw v-if="isTesting" class="w-3.5 h-3.5 animate-spin" />
                <span>Save & Test</span>
              </button>
            </div>
          </div>

          <!-- Startup Sync Toggle -->
          <label class="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-xl p-3 cursor-pointer select-none">
            <input
              type="checkbox"
              :checked="autoSync"
              @change="setAutoSync(($event.target as HTMLInputElement).checked)"
              class="w-4.5 h-4.5 accent-blue-600 rounded border-slate-300"
            />
            <div class="text-left">
              <span class="block text-xs font-bold text-slate-800">Auto-sync on Startup</span>
              <span class="block text-[10px] text-slate-400">Instantly query API catalog products upon opening the page</span>
            </div>
          </label>
        </div>

        <!-- Sync Actions Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            @click="handleSync"
            :disabled="isSyncing || isTesting"
            class="h-11 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <RefreshCw class="w-4 h-4" :class="{ 'animate-spin': isSyncing }" />
            <span>Sync Products List Now</span>
          </button>

          <button
            @click="handleReset"
            class="h-11 border border-slate-200 hover:border-slate-300 bg-white text-slate-600 hover:text-slate-800 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Trash2 class="w-4 h-4 text-slate-400" />
            <span>Reset to Offline Catalog</span>
          </button>
        </div>

        <!-- Technical Integration Blueprint helper -->
        <div class="border-t border-slate-100 pt-4 text-left">
          <button
            @click="showSpecs = !showSpecs"
            class="text-[11px] font-bold text-slate-450 hover:text-slate-800 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Code class="w-3.5 h-3.5 text-blue-500" />
            <span>{{ showSpecs ? 'Hide Backend API Endpoints Blueprint' : 'Show Backend API Endpoints Blueprint' }}</span>
          </button>

          <transition
            enter-active-class="transition duration-150 ease-out"
            enter-from-class="opacity-0 -translate-y-2"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition duration-100 ease-in"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 -translate-y-2"
          >
            <div v-if="showSpecs" class="mt-3 bg-slate-950 text-slate-200 p-4 rounded-2xl font-mono text-[10px] space-y-3 leading-relaxed max-h-60 overflow-y-auto border border-slate-800">
              <div class="text-slate-400 font-bold border-b border-slate-800 pb-1 flex items-center gap-1">
                <Database class="w-3.5 h-3.5 text-blue-400" />
                <span>EXPECTED SCHEMA PROTOCOL</span>
              </div>
              
              <div class="space-y-1">
                <span class="text-amber-400 block font-bold">1. GET /products</span>
                <span class="text-slate-400 block">Returns an array of product structures:</span>
                <pre class="bg-slate-900 p-2 rounded text-slate-300 text-[9px] overflow-x-auto">
[
  {
    "id": "sonicpro-headphones",
    "name": "Pro Wireless Headphones",
    "description": "Details here...",
    "price": 299.00,
    "image": "https://...",
    "category": "Electronics"
  }
]</pre>
              </div>

              <div class="space-y-1 pt-2">
                <span class="text-emerald-400 block font-bold">2. POST /orders</span>
                <span class="text-slate-400 block">Fires upon client order checkout completion:</span>
                <pre class="bg-slate-900 p-2 rounded text-slate-300 text-[9px] overflow-x-auto">
{
  "id": "ORD-12345",
  "date": "June 24, 2026",
  "total": 353.99,
  "status": "Processing",
  "items": [
    { "name": "...", "price": 29.9, "quantity": 1 }
  ]
}</pre>
              </div>

              <div class="text-[9px] text-slate-500 border-t border-slate-800 pt-2 leading-relaxed font-sans">
                Make sure your server at <code class="bg-slate-900 px-1 py-0.5 rounded text-amber-400">http://localhost:8000</code> responds to these structures and outputs <code class="text-white">Access-Control-Allow-Origin: *</code>.
              </div>
            </div>
          </transition>
        </div>

      </div>
    </div>
  </transition>
</template>
