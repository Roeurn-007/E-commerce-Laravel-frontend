<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { User, ShoppingBag, Heart, Check, Save, UserCheck, Star, Eye, Trash2, Upload, Camera, ImageOff, X, ZoomIn, ZoomOut, AlertCircle, RefreshCw, LogOut } from "lucide-vue-next";
import { UserProfile, Order, Product, ActiveTab } from "../types";

type ProfileTab = "account" | "orders" | "wishlist";

const props = defineProps<{
  userProfile: UserProfile;
  setUserProfile: (profile: UserProfile | any) => void;
  orders: Order[];
  wishlist: Product[];
  toggleWishlist: (product: Product) => void;
  addToCart: (product: Product, quantity: number, color?: string) => void;
  triggerRouteAnimation: (targetTab: ActiveTab) => void;
  setSelectedProductId: (id: string) => void;
  addToast: (message: string, type: "success" | "error" | "info") => void;
  profileActiveSubTab?: ProfileTab;
  setProfileActiveSubTab?: (tab: ProfileTab) => void;
  isLoggedIn?: boolean;
  setIsLoggedIn?: (val: boolean) => void;
  login?: (email: string, password: string) => Promise<boolean>;
  register?: (name: string, email: string, password: string) => Promise<boolean>;
  logout?: () => Promise<void>;
  apiUrl?: string;
}>();

const emit = defineEmits<{
  (e: "update:userProfile", val: UserProfile): void;
}>();

const localActiveSubTab = ref<ProfileTab>("account");
const activeSubTab = computed(() => props.profileActiveSubTab || localActiveSubTab.value);

const setActiveSubTab = (tab: ProfileTab) => {
  if (props.setProfileActiveSubTab) {
    props.setProfileActiveSubTab(tab);
  } else {
    localActiveSubTab.value = tab;
  }
};

// Form states synced with userProfile
const fullName = ref(props.userProfile.fullName);
const email = ref(props.userProfile.email);
const phone = ref(props.userProfile.phone);

watch(
  () => props.userProfile,
  (newProfile) => {
    if (newProfile) {
      fullName.value = newProfile.fullName;
      email.value = newProfile.email;
      phone.value = newProfile.phone;
    }
  },
  { deep: true }
);

// --- 👥 AVATAR DETAILED STATES ---
const isMenuOpen = ref(false);
const showConfirmDelete = ref(false);
const showLogoutConfirm = ref(false);
const showCropModal = ref(false);
const pendingImageSrc = ref<string | null>(null);

const zoom = ref(1.0);
const offsetX = ref(0);
const offsetY = ref(0);
const isDragging = ref(false);
const dragStart = ref({ x: 0, y: 0 });
const isCropping = ref(false);
const uploadProgress = ref(0);

const fileInputRef = ref<HTMLInputElement | null>(null);

const handlePointerDown = (e: PointerEvent) => {
  if (isCropping.value) return;
  isDragging.value = true;
  dragStart.value = { x: e.clientX - offsetX.value, y: e.clientY - offsetY.value };
  const target = e.currentTarget as HTMLDivElement;
  if (target && typeof target.setPointerCapture === "function") {
    target.setPointerCapture(e.pointerId);
  }
};

const handlePointerMove = (e: PointerEvent) => {
  if (!isDragging.value || isCropping.value) return;
  const newX = e.clientX - dragStart.value.x;
  const newY = e.clientY - dragStart.value.y;
  offsetX.value = Math.max(-250, Math.min(250, newX));
  offsetY.value = Math.max(-250, Math.min(250, newY));
};

const handlePointerUp = (e: PointerEvent) => {
  isDragging.value = false;
  const target = e.currentTarget as HTMLDivElement;
  if (target && typeof target.releasePointerCapture === "function") {
    target.releasePointerCapture(e.pointerId);
  }
};

const handleSaveProfile = async (e: Event) => {
  e.preventDefault();
  
  try {
    const formData = new FormData();
    formData.append('name', fullName.value);
    formData.append('email', email.value);
    
    // If avatar was updated (base64 data URL), include it
    if (props.userProfile.avatar && props.userProfile.avatar.startsWith('data:')) {
      const blob = await fetch(props.userProfile.avatar).then(r => r.blob());
      formData.append('avatar', blob, 'avatar.jpg');
    }
    
    // If avatar was removed (empty string after having one), signal backend to clear it
    if (!props.userProfile.avatar) {
      formData.append('remove_avatar', '1');
    }
    
    const response = await fetch(`${props.apiUrl}/profile`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('marketplace_auth_token') || ''}`,
        'Accept': 'application/json',
      },
      body: formData,
    });
    
    if (response.ok) {
      const result = await response.json();
      if (result.success && result.data) {
        props.setUserProfile({
          ...props.userProfile,
          fullName: fullName.value,
          email: email.value,
          phone: phone.value,
          avatar: result.data.image_url || "",
        });
        props.addToast("Profile updated successfully!", "success");
      }
    } else {
      props.addToast("Failed to update profile", "error");
    }
  } catch (error) {
    console.error("Profile update error:", error);
    props.addToast("Failed to update profile", "error");
  }
};

const onFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    if (file.size > 2 * 1024 * 1024) {
      props.addToast("Please choose an image file smaller than 2MB.", "error");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      pendingImageSrc.value = result;
      zoom.value = 1.0;
      offsetX.value = 0;
      offsetY.value = 0;
      showCropModal.value = true;
      isMenuOpen.value = false;
    };
    reader.onerror = () => {
      props.addToast("Failed to parse avatar image file.", "error");
    };
    reader.readAsDataURL(file);
  }
};

const triggerFileInput = () => {
  if (fileInputRef.value) {
    fileInputRef.value.click();
  }
};

const confirmRemoveAvatar = () => {
  showConfirmDelete.value = true;
  isMenuOpen.value = false;
};

const handleAvatarRemove = () => {
  props.setUserProfile({
    ...props.userProfile,
    avatar: ""
  });
  props.addToast("Profile photo removed successfully.", "success");
  showConfirmDelete.value = false;
};

const handleCommitCrop = () => {
  if (!pendingImageSrc.value) return;
  isCropping.value = true;
  uploadProgress.value = 0;

  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.floor(Math.random() * 12) + 8;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      executeCanvasCrop();
    }
    uploadProgress.value = Math.min(100, progress);
  }, 100);
};

const executeCanvasCrop = () => {
  if (!pendingImageSrc.value) return;
  const img = new Image();
  img.src = pendingImageSrc.value;
  img.onload = () => {
    const canvas = document.createElement("canvas");
    const size = 320;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    
    if (ctx) {
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, size, size);

      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
      ctx.clip();

      ctx.translate(size / 2, size / 2);
      ctx.scale(zoom.value, zoom.value);
      ctx.translate(offsetX.value / zoom.value, offsetY.value / zoom.value);

      const imgAspect = img.width / img.height;
      let drawW = size;
      let drawH = size;

      if (imgAspect > 1) {
        drawW = size * imgAspect;
        drawH = size;
      } else {
        drawW = size;
        drawH = size / imgAspect;
      }

      ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);

      const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
      props.setUserProfile({
        ...props.userProfile,
        avatar: dataUrl
      });

      props.addToast("Profile avatar photo updated successfully!", "success");
      
      isCropping.value = false;
      showCropModal.value = false;
      pendingImageSrc.value = null;
      if (fileInputRef.value) {
        fileInputRef.value.value = "";
      }
    }
  };
  img.onerror = () => {
    props.addToast("Failed to process cropped profile image.", "error");
    isCropping.value = false;
  };
};

const openProduct = (id: string) => {
  props.setSelectedProductId(id);
  props.triggerRouteAnimation("product-detail");
};

const isRegisterMode = ref(false);
const authEmail = ref("");
const authPassword = ref("");
const authName = ref("");
const authLoading = ref(false);

const handleAuthSubmit = async (e: Event) => {
  e.preventDefault();
  authLoading.value = true;
  
  try {
    let success = false;
    if (isRegisterMode.value) {
      if (props.register) {
        success = await props.register(authName.value, authEmail.value, authPassword.value);
      }
    } else {
      if (props.login) {
        success = await props.login(authEmail.value, authPassword.value);
      }
    }
    
    authLoading.value = false;
    
    if (success && props.setIsLoggedIn) {
      props.setIsLoggedIn(true);
      props.triggerRouteAnimation("home");
    }
  } catch (err) {
    authLoading.value = false;
    props.addToast("Authentication failed. Please try again.", "error");
  }
};

const getInitials = (nameString: string) => {
  if (!nameString) return "JS";
  return nameString.trim().split(/\s+/).map((n) => n[0]).join("").slice(0, 2);
};

const handleLogout = async () => {
  if (props.logout) {
    await props.logout();
  }
  if (props.setIsLoggedIn) {
    props.setIsLoggedIn(false);
  }
  showLogoutConfirm.value = false;
  props.triggerRouteAnimation('home');
};
</script>

<template>
  <div v-if="!isLoggedIn" class="max-w-md mx-auto px-4 py-16 animate-fade-in text-slate-900">
    <div class="bg-white border border-slate-100/80 rounded-[2rem] p-8 shadow-md relative overflow-hidden text-center space-y-6">
      <div class="absolute top-[-30%] right-[-20%] w-60 h-60 bg-blue-500/5 blur-[60px] rounded-full pointer-events-none" />
      <div class="absolute bottom-[-30%] left-[-20%] w-60 h-60 bg-indigo-500/5 blur-[60px] rounded-full pointer-events-none" />

      <!-- Icon Header -->
      <div class="w-16 h-16 bg-blue-50 text-blue-600 rounded-[1.2rem] flex items-center justify-center mx-auto border border-blue-100 shadow-2xs">
        <User class="w-8 h-8" />
      </div>

      <div class="space-y-1.5 relative z-10 text-center">
        <h2 class="text-2xl font-black text-slate-900 font-headline tracking-tight">
          {{ isRegisterMode ? 'Create Your Account' : 'Access Your Account' }}
        </h2>
        <p class="text-xs text-slate-400 font-medium max-w-sm mx-auto leading-relaxed">
          {{ isRegisterMode 
            ? 'Join us to save items, keep track of order logs, and sync your settings.'
            : 'Enter your registered credentials to synchronize your shopping preferences.' }}
        </p>
      </div>

      <!-- Tab selectors -->
      <div class="grid grid-cols-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-100 relative z-10">
        <button
          @click="isRegisterMode = false"
          class="py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
          :class="!isRegisterMode ? 'bg-white text-blue-600 shadow-2xs' : 'text-slate-550 hover:text-slate-800'"
        >
          Login
        </button>
        <button
          @click="isRegisterMode = true"
          class="py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
          :class="isRegisterMode ? 'bg-white text-blue-600 shadow-2xs' : 'text-slate-550 hover:text-slate-800'"
        >
          Register
        </button>
      </div>

      <form @submit="handleAuthSubmit" class="space-y-4 text-left relative z-10 font-sans">
        <div v-if="isRegisterMode" class="space-y-1.5">
          <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Full Name</label>
          <div class="relative">
            <User class="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              required
              placeholder="Jane Smith"
              v-model="authName"
              class="w-full h-11 pl-11 pr-4 border border-slate-200 bg-slate-50 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-505 text-xs focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div class="space-y-1.5">
          <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Email Address</label>
          <div class="relative">
            <span class="absolute left-4 top-3 text-slate-450 font-bold block text-sm font-sans">@</span>
            <input
              type="email"
              required
              placeholder="name@example.com"
              v-model="authEmail"
              class="w-full h-11 pl-11 pr-4 border border-slate-200 bg-slate-50 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-505 text-xs focus:border-transparent transition-all font-mono"
            />
          </div>
        </div>

        <div class="space-y-1.5">
          <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Secure Password</label>
          <div class="relative">
            <span class="absolute left-3.5 top-3 text-slate-455 font-bold block text-xs font-mono">***</span>
            <input
              type="password"
              required
              placeholder="••••••••"
              v-model="authPassword"
              class="w-full h-11 pl-11 pr-4 border border-slate-200 bg-slate-50 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-505 text-xs focus:border-transparent transition-all"
            />
          </div>
        </div>

        <button
          type="submit"
          :disabled="authLoading"
          class="w-full h-11 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
        >
          <template v-if="authLoading">
            <div class="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            <span>{{ isRegisterMode ? 'Registering account...' : 'Authenticating credentials...' }}</span>
          </template>
          <template v-else>
            <span>{{ isRegisterMode ? 'Register' : 'Login' }}</span>
          </template>
        </button>
      </form>
    </div>
  </div>

  <div v-else class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 animate-fade-in">
    
    <!-- Premium Light Theme User Identity Banner -->
    <div class="bg-slate-50 border border-slate-100/70 text-slate-900 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 relative overflow-hidden shadow-xs">
      <div class="absolute top-[-20%] left-[-10%] w-72 h-72 bg-blue-50/50 blur-[80px] rounded-full pointer-events-none" />
      
      <!-- Dynamic Avatar Container with actions -->
      <div class="flex flex-col items-center relative z-20 flex-shrink-0">
        <input
          type="file"
          ref="fileInputRef"
          accept="image/*"
          class="hidden"
          @change="onFileChange"
        />

        <!-- Wrapper to position the camera badge -->
        <div class="relative">
          <button
            type="button"
            @click="isMenuOpen = !isMenuOpen"
            class="group relative w-24 h-24 rounded-full border-4 border-white shadow-md focus:outline-none focus:ring-4 focus:ring-blue-500/30 overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg active:scale-95 flex items-center justify-center bg-slate-100"
            title="Manage profile photo"
          >
            <img
              v-if="userProfile.avatar"
              :src="userProfile.avatar"
              :alt="userProfile.fullName"
              referrerpolicy="no-referrer"
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div v-else class="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-extrabold text-3xl flex items-center justify-center uppercase transition-all">
              {{ getInitials(userProfile.fullName) }}
            </div>

            <!-- Premium Overlay displaying on hover -->
            <div class="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-all duration-200 flex flex-col items-center justify-center text-white gap-1 select-none pointer-events-none">
              <Camera class="w-6 h-6 text-white transform translate-y-1 group-hover:translate-y-0 transition-transform duration-300 drop-shadow-sm" />
              <span class="text-[9px] font-extrabold tracking-widest uppercase drop-shadow-sm">Modify</span>
            </div>
          </button>

          <!-- Always-Visible floating circular camera badge button -->
          <button
            type="button"
            @click="isMenuOpen = !isMenuOpen"
            class="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center border-2 border-white shadow-md transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer z-30 group"
            title="Change profile photo"
          >
            <Camera class="w-4 h-4 transition-transform group-hover:rotate-12" />
          </button>
        </div>

        <span class="mt-1.5 text-[10px] text-slate-500 font-bold tracking-wide select-none group-hover:text-slate-800 transition-colors">
          Tap to Edit
        </span>

        <!-- Premium Immersive Screen-Fixed Dialog Modal via standard Vue transitions -->
        <transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div 
            v-if="isMenuOpen"
            class="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
            @click="isMenuOpen = false" 
          >
            <div
              class="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl border border-slate-100 text-center space-y-6"
              @click.stop
            >
              <div class="flex justify-between items-center pb-2 border-b border-slate-100 text-left">
                <div>
                  <h3 class="text-base font-extrabold text-slate-900 font-headline">Profile Photo</h3>
                  <p class="text-[11px] text-slate-400">Manage and preview your public identity image</p>
                </div>
                <button
                  type="button"
                  @click="isMenuOpen = false"
                  class="w-8 h-8 rounded-full hover:bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors"
                >
                  <X class="w-4 h-4" />
                </button>
              </div>

              <!-- High Quality Centered Circular Avatar Preview -->
              <div class="flex justify-center py-2">
                <div class="w-40 h-40 rounded-full border-4 border-slate-100 flex items-center justify-center overflow-hidden bg-slate-50 shadow-md">
                  <img
                    v-if="userProfile.avatar"
                    :src="userProfile.avatar"
                    :alt="userProfile.fullName"
                    referrerpolicy="no-referrer"
                    class="w-full h-full object-cover"
                  />
                  <div v-else class="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-extrabold text-4xl flex items-center justify-center uppercase">
                    {{ getInitials(userProfile.fullName) }}
                  </div>
                </div>
              </div>

              <!-- Action Commands list -->
              <div class="space-y-3">
                <button
                  type="button"
                  @click="triggerFileInput"
                  class="w-full flex items-center justify-center gap-3 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-bold transition-all shadow-sm hover:shadow-md hover:shadow-blue-100 cursor-pointer"
                >
                  <Upload class="w-4 h-4" />
                  <span>Upload New Photo</span>
                </button>

                <button
                  v-if="userProfile.avatar"
                  type="button"
                  @click="confirmRemoveAvatar"
                  class="w-full flex items-center justify-center gap-3 py-3 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-2xl text-xs font-bold transition-all cursor-pointer"
                >
                  <Trash2 class="w-4 h-4 text-rose-600" />
                  <span>Remove Photo</span>
                </button>

                <button
                  type="button"
                  @click="isMenuOpen = false"
                  class="w-full py-3 bg-slate-100 hover:bg-slate-150 text-slate-505 rounded-2xl text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </transition>

        <!-- Confirmation Dialog Modal -->
        <transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div 
            v-if="showConfirmDelete"
            class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
            @click="showConfirmDelete = false"
          >
            <div
              class="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-100 text-center space-y-4"
              @click.stop
            >
              <div class="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
                <AlertCircle class="w-6 h-6" />
              </div>

              <div class="space-y-1">
                <h3 class="text-base font-bold text-slate-900 font-headline">Remove profile photo?</h3>
                <p class="text-xs text-slate-505">
                  Are you sure you want to remove your profile photo? This will restore your standard letter initials.
                </p>
              </div>

              <div class="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  @click="showConfirmDelete = false"
                  class="py-2.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-505 hover:bg-slate-50 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  @click="handleAvatarRemove"
                  class="py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all hover:shadow-md hover:shadow-rose-100 cursor-pointer"
                >
                  Yes, Remove
                </button>
              </div>
            </div>
          </div>
        </transition>

        <!-- Logout Confirmation Dialog Modal -->
        <transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div 
            v-if="showLogoutConfirm"
            class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
            @click="showLogoutConfirm = false"
          >
            <div
              class="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-100 text-center space-y-4"
              @click.stop
            >
              <div class="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
                <LogOut class="w-6 h-6" />
              </div>

              <div class="space-y-1">
                <h3 class="text-base font-bold text-slate-900 font-headline">Log out of your account?</h3>
                <p class="text-xs text-slate-505">
                  Are you sure you want to log out? You'll need to sign in again to access your account.
                </p>
              </div>

              <div class="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  @click="showLogoutConfirm = false"
                  class="py-2.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-505 hover:bg-slate-50 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  @click="handleLogout"
                  class="py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all hover:shadow-md hover:shadow-rose-100 cursor-pointer"
                >
                  Yes, Log Out
                </button>
              </div>
            </div>
          </div>
        </transition>

        <!-- Immersive Image Cropper & Zoom Modal -->
        <transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div 
            v-if="showCropModal"
            class="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          >
            <div
              class="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100 flex flex-col items-center space-y-6"
              @click.stop
            >
              <div class="flex justify-between items-center w-full pb-3 border-b border-slate-100 text-left">
                <div>
                  <h3 class="text-base font-extrabold text-slate-900 font-headline">Crop & Zoom Visuals</h3>
                  <p class="text-[11px] text-slate-405">Position and size your profile rendering</p>
                </div>
                <button
                  v-if="!isCropping"
                  type="button"
                  @click="showCropModal = false; pendingImageSrc = null"
                  class="w-8 h-8 rounded-full hover:bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors"
                >
                  <X class="w-4 h-4" />
                </button>
              </div>

              <!-- Draggable Viewport Canvas Block -->
              <div 
                class="relative w-full aspect-square max-w-[280px] bg-slate-950 rounded-2xl overflow-hidden flex items-center justify-center border border-slate-800 select-none cursor-grab active:cursor-grabbing touch-none"
                @pointerdown="handlePointerDown"
                @pointermove="handlePointerMove"
                @pointerup="handlePointerUp"
                @pointerleave="handlePointerUp"
              >
                <img
                  v-if="pendingImageSrc"
                  :src="pendingImageSrc"
                  alt="Cropping dynamic review"
                  draggable="false"
                  class="absolute origin-center select-none pointer-events-none"
                  :style="{
                    transform: `translate(${offsetX}px, ${offsetY}px) scale(${zoom})`,
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain'
                  }"
                />

                <div class="absolute w-[180px] h-[180px] rounded-full border-2 border-white/70 border-dashed pointer-events-none z-10 shadow-[0_0_0_9999px_rgba(15,23,42,0.73)]" />
                
                <div v-if="!isCropping" class="absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-slate-900/60 backdrop-blur-xs text-[9px] text-white/95 px-3 py-1 rounded-full pointer-events-none uppercase tracking-widest font-extrabold z-20">
                  Drag Photo to Align
                </div>
              </div>

              <!-- Interactive controls or loader state -->
              <div v-if="!isCropping" class="w-full space-y-5">
                <div class="space-y-1.5 w-full text-left">
                  <div class="flex justify-between text-[11px] font-bold text-slate-600">
                    <span class="flex items-center gap-1">
                      <ZoomIn class="w-3.5 h-3.5 text-blue-505" />
                      <span>Scale Factor (Zoom)</span>
                    </span>
                    <span class="font-mono text-blue-600">{{ Math.round(zoom * 100) }}%</span>
                  </div>
                  <input
                    type="range"
                    min="1.0"
                    max="3.5"
                    step="0.05"
                    v-model.number="zoom"
                    class="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>

                <!-- Fine precision alignment coordinate controllers -->
                <div class="grid grid-cols-2 gap-4 w-full bg-slate-50 p-3 rounded-2xl border border-slate-100 text-left">
                  <div class="space-y-1">
                    <span class="block text-[10px] font-bold text-slate-550 uppercase tracking-wider">Offset X (Horizontal)</span>
                    <input
                      type="range"
                      min="-200"
                      max="200"
                      step="1"
                      v-model.number="offsetX"
                      class="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-600"
                    />
                  </div>
                  <div class="space-y-1">
                    <span class="block text-[10px] font-bold text-slate-550 uppercase tracking-wider">Offset Y (Vertical)</span>
                    <input
                      type="range"
                      min="-200"
                      max="200"
                      step="1"
                      v-model.number="offsetY"
                      class="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-600"
                    />
                  </div>
                </div>

                <!-- Align reset button -->
                <div class="flex justify-between items-center text-xs">
                  <button
                    type="button"
                    @click="zoom = 1.0; offsetX = 0; offsetY = 0; addToast('Alignment coordinates reset.', 'info')"
                    class="text-[10px] font-bold text-slate-505 hover:text-slate-800 hover:underline flex items-center gap-1"
                  >
                    <RefreshCw class="w-3 h-3 animate-spin duration-3000" />
                    <span>Reset Alignment</span>
                  </button>
                </div>

                <!-- Crop submission actions buttons -->
                <div class="grid grid-cols-2 gap-3 pt-1">
                  <button
                    type="button"
                    @click="showCropModal = false; pendingImageSrc = null"
                    class="py-2.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-505 hover:bg-slate-50 transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    @click="handleCommitCrop"
                    class="py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all hover:shadow-md hover:shadow-blue-100 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Apply & Save</span>
                  </button>
                </div>
              </div>

              <!-- SIMULATED CLOUD UPLOAD PROGRESS -->
              <div v-else class="w-full space-y-4 py-4 text-center bg-slate-50 p-5 rounded-3xl border border-slate-100">
                <div class="w-10 h-10 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin mx-auto mb-2" />
                
                <div class="space-y-1">
                  <span class="text-xs font-bold text-slate-800 block">
                    {{ uploadProgress < 35 ? "Formatting and compressing photo pixels..." : (uploadProgress < 75 ? "Uploading optimized avatar file to backend..." : "Applying security tokens and updating view...") }}
                  </span>
                  <span class="text-[10px] tracking-widest uppercase font-black text-indigo-600 block">{{ uploadProgress }}% COMPLETE</span>
                </div>

                <div class="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    class="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 transition-all duration-100"
                    :style="{ width: `${uploadProgress}%` }"
                  />
                </div>
              </div>
            </div>
          </div>
        </transition>

      </div>

      <div class="space-y-1.5 text-center sm:text-left relative z-10 flex-grow">
        <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight font-headline text-slate-900">{{ userProfile.fullName }}</h1>
        <p class="text-sm text-slate-500 font-semibold">{{ userProfile.email }}</p>
        <div class="flex gap-4 pt-2 justify-center sm:justify-start text-xs text-slate-405 font-mono font-bold">
          <span>Orders Placed: <strong class="text-blue-600">{{ orders.length }}</strong></span>
          <span class="text-slate-300">|</span>
          <span>Saved items: <strong class="text-rose-500">{{ wishlist.length }}</strong></span>
        </div>
      </div>
    </div>

    <!-- Main split work canvas -->
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
      
      <!-- Left Side: Side Tab Buttons -->
      <nav class="flex lg:flex-col gap-2 border-b lg:border-b-0 pb-4 lg:pb-0 overflow-x-auto scrollbar-none">
        <button
          @click="setActiveSubTab('account')"
          class="flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer whitespace-nowrap min-w-fit"
          :class="activeSubTab === 'account' ? 'bg-blue-50 text-blue-605' : 'text-slate-550 hover:bg-slate-50 hover:text-slate-900'"
        >
          <User class="w-4.5 h-4.5" />
          <span>Profile Information</span>
        </button>

        <button
          @click="setActiveSubTab('orders')"
          class="flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer whitespace-nowrap min-w-fit"
          :class="activeSubTab === 'orders' ? 'bg-blue-50 text-blue-605' : 'text-slate-550 hover:bg-slate-50 hover:text-slate-900'"
        >
          <ShoppingBag class="w-4.5 h-4.5" />
          <span>Order History ({{ orders.length }})</span>
        </button>

        <button
          @click="setActiveSubTab('wishlist')"
          class="flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer whitespace-nowrap min-w-fit"
          :class="activeSubTab === 'wishlist' ? 'bg-blue-50 text-blue-605' : 'text-slate-550 hover:bg-slate-50 hover:text-slate-900'"
        >
          <Heart class="w-4.5 h-4.5" />
          <span>Saved Wishlist ({{ wishlist.length }})</span>
        </button>

        <button
          v-if="isLoggedIn && setIsLoggedIn"
          @click="showLogoutConfirm = true"
          class="flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-all cursor-pointer whitespace-nowrap min-w-fit lg:mt-6 border border-rose-100 lg:border-0"
        >
          <LogOut class="w-4.5 h-4.5" />
          <span>Log Out</span>
        </button>
      </nav>

      <!-- Right Side: Active Workspace panel -->
      <main class="lg:col-span-3">
        
        <!-- TAB 1: Account info Form -->
        <div v-if="activeSubTab === 'account'" class="bg-white border border-slate-100/70 rounded-3xl p-6 space-y-6 shadow-xs text-left">
          <div class="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h2 class="text-lg font-bold text-slate-900 font-headline">Personal Details</h2>
            <span class="flex items-center gap-1 text-[11px] text-slate-400 font-mono font-bold">
              <UserCheck class="w-3.5 h-3.5 text-emerald-500" />
              <span>Profile Sync Verified</span>
            </span>
          </div>

          <form @submit="handleSaveProfile" class="space-y-4 max-w-xl font-sans">
            <div class="space-y-1.5">
              <label class="text-xs font-bold text-slate-400 uppercase tracking-wider">Full Display Name</label>
              <input
                type="text"
                required
                v-model="fullName"
                class="w-full h-11 px-4 border border-slate-200 bg-slate-50 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-505 text-sm focus:border-transparent transition-all"
              />
            </div>

            <div class="space-y-1.5">
              <label class="text-xs font-bold text-slate-405 uppercase tracking-wider">Registered Email Address</label>
              <input
                type="email"
                required
                v-model="email"
                class="w-full h-11 px-4 border border-slate-200 bg-slate-50 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-505 text-sm focus:border-transparent transition-all"
              />
            </div>

            <div class="space-y-1.5">
              <label class="text-xs font-bold text-slate-405 uppercase tracking-wider">Contact Phone Line</label>
              <input
                type="tel"
                required
                v-model="phone"
                class="w-full h-11 px-4 border border-slate-200 bg-slate-50 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-505 text-sm focus:border-transparent transition-all font-mono"
              />
            </div>

            <div class="pt-2">
              <button
                type="submit"
                class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-all inline-flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <Save class="w-4 h-4" />
                <span>Save Account Settings</span>
              </button>
            </div>
          </form>
        </div>

        <!-- TAB 2: Orders tracking Table lists -->
        <div v-if="activeSubTab === 'orders'" class="bg-white border border-slate-100/70 rounded-3xl p-6 space-y-6 shadow-xs text-left">
          <h2 class="text-lg font-bold text-slate-905 border-b pb-3 font-headline">Your Order Log History</h2>
          
          <div v-if="orders.length === 0" class="flex flex-col items-center justify-center py-12 text-center text-slate-500 font-medium">
            <ShoppingBag class="w-8 h-8 text-slate-350 mb-3" />
            <p class="text-sm">No historical orders recorded yet.</p>
            <button
              @click="triggerRouteAnimation('shop')"
              class="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
            >
              Examine Catalog Store
            </button>
          </div>

          <div v-else class="space-y-6">
            <div
              v-for="ord in orders"
              :key="ord.id"
              class="border border-slate-100/70 bg-slate-50/55 rounded-2xl p-5 space-y-4 text-left"
            >
              <!-- Top Header metadata -->
              <div class="flex flex-wrap justify-between items-center gap-3 border-b border-slate-100 pb-3">
                <div class="space-y-0.5 text-left">
                  <span class="text-xs font-bold font-mono text-blue-600">{{ ord.id }}</span>
                  <p class="text-[11px] text-slate-400 font-semibold">{{ ord.date }}</p>
                </div>
                
                <!-- status chips -->
                <div class="flex gap-3 items-center">
                  <span class="text-xs font-bold font-mono text-slate-900">
                    Total: ${{ ord.total.toFixed(2) }}
                  </span>
                  <span
                    class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                    :class="ord.status === 'Delivered'
                      ? 'bg-emerald-50 text-emerald-600'
                      : (ord.status === 'Processing' ? 'bg-blue-50 text-blue-600' : 'bg-indigo-50 text-indigo-600')"
                  >
                    ● {{ ord.status }}
                  </span>
                </div>
              </div>

              <!-- Purchased items list specifications -->
              <div class="space-y-3">
                <div v-for="(subItem, idx) in ord.items" :key="idx" class="flex gap-3 justify-between items-center text-xs">
                  <div class="flex gap-2 items-center">
                    <div class="w-8 h-8 bg-white rounded-lg p-0.5 overflow-hidden flex items-center justify-center border border-slate-100">
                      <img v-if="subItem.image" :src="subItem.image" :alt="subItem.name" referrerpolicy="no-referrer" class="w-full h-full object-contain mix-blend-multiply" />
                      <ImageOff v-else class="w-4 h-4 text-slate-300 stroke-[1.5]" />
                    </div>
                    <span class="font-semibold text-slate-800 line-clamp-1 max-w-[200px] sm:max-w-md">
                      {{ subItem.name }}
                    </span>
                  </div>
                  <span class="font-mono text-slate-500 text-[11px]">
                    {{ subItem.quantity }}x @ ${{ subItem.price.toFixed(2) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- TAB 3: Saved Wishlists -->
        <div v-if="activeSubTab === 'wishlist'" class="bg-white border border-slate-100/70 rounded-3xl p-6 space-y-6 shadow-xs text-left">
          <h2 class="text-lg font-bold text-slate-905 border-b pb-3 font-headline">Saved Wishlist Items</h2>
          
          <div v-if="wishlist.length === 0" class="flex flex-col items-center justify-center py-12 text-center text-slate-505 font-medium">
            <Heart class="w-8 h-8 text-slate-350 mb-3" />
            <p class="text-sm">No items saved in favorites yet.</p>
            <button
              @click="triggerRouteAnimation('shop')"
              class="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
            >
              Examine Catalog Store
            </button>
          </div>

          <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
            <div
              v-for="prod in wishlist"
              :key="prod.id"
              class="border border-slate-100/50 rounded-2xl p-4 flex gap-4 items-center bg-white shadow-2xs relative hover:border-slate-200 transition-colors"
            >
              <div class="w-16 h-16 bg-slate-50 rounded-xl p-1 flex items-center justify-center flex-shrink-0 border border-slate-100">
                <img v-if="prod.image" :src="prod.image" :alt="prod.name" referrerpolicy="no-referrer" class="w-full h-full object-contain mix-blend-multiply" />
                <ImageOff v-else class="w-6 h-6 text-slate-300 stroke-[1.5]" />
              </div>
              
              <div class="space-y-1 overflow-hidden pr-6 text-left">
                <h3 class="text-xs font-bold text-slate-900 line-clamp-1">{{ prod.name }}</h3>
                <span class="text-sm font-bold font-mono text-blue-600 block">${{ prod.price.toFixed(2) }}</span>
                
                <div class="flex gap-2">
                  <button
                    @click="openProduct(prod.id)"
                    class="text-[10px] text-slate-505 hover:text-slate-800 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Eye class="w-3.5 h-3.5 text-blue-600" />
                    <span>Details</span>
                  </button>
                  <button
                    @click="addToCart(prod, 1)"
                    class="text-[10px] text-blue-605 hover:text-blue-700 font-bold cursor-pointer"
                  >
                    Buy Item
                  </button>
                </div>
              </div>

              <!-- delete cross -->
              <button
                @click="toggleWishlist(prod)"
                class="absolute top-3 right-3 text-slate-400 hover:text-rose-500 cursor-pointer p-1 rounded-full hover:bg-slate-50 transition-colors"
                title="Delete from favorites"
              >
                <Trash2 class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

      </main>
    </div>
  </div>
</template>
