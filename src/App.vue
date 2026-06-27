<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, computed } from "vue";
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";
import HomeView from "./components/HomeView.vue";
import CatalogView from "./components/CatalogView.vue";
import ProductDetailView from "./components/ProductDetailView.vue";
import CartView from "./components/CartView.vue";
import CheckoutView from "./components/CheckoutView.vue";
import ProfileView from "./components/ProfileView.vue";
import WishlistView from "./components/WishlistView.vue";
import Toasts from "./components/Toasts.vue";
import PromoModal from "./components/PromoModal.vue";
import ApiSettingsModal from "./components/ApiSettingsModal.vue";
import { PRODUCTS } from "./data";
import { Product, CartItem, UserProfile, Order, ToastMessage, ActiveTab } from "./types";

const DEFAULT_PROFILE: UserProfile = {
  fullName: "Jane Smith",
  email: "jane.smith@design.com",
  phone: "+1 (555) 019-2834",
  avatar: "",
};

const DEFAULT_ORDERS: Order[] = [
  {
    id: "ORD-849204",
    date: "May 14, 2026",
    status: "Delivered",
    total: 89.99,
    items: [
      {
        name: "Insulated Stainless Steel Bottle 30oz",
        price: 35.00,
        quantity: 2,
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCdLJAI_tCKdSEc66zLwqZv4B22q_wm5KJKM8kqp_HccraNK8YQeHKnDQbd2ODMT3r5Lc2nvt76j9hfSezs-OFhQVAGlRF6ObEyP8blPSkRWY9t4nhrCUVL1QaJ9FiJysPtD2xeWhAKZBTuKcAJoO5Rz1c7PMByJI1_hifbrEczn0ijAHA2cjUbfm5jDEUHwqfW5vqh0Z21rofhX8Off46m7_xif35qQ8fTw8WasBAXCy06ZMb44tL0ZkwCMAgVR_vxNzLTNvYb9g"
      },
      {
        name: "Premium Braided USB-C Cable (2m)",
        price: 19.99,
        quantity: 1,
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAx0083QWL39MvHrh13YpWNoOEsa8SCiq1NC4bucjNlIrj19Teo-8AlRCLSWDa4bxyND6aY0r5_PjD0iy_8GSivZbW5-4q6fB6jU4rllpFKzAOqS_IX2CfWS1QWD21FQo1tjmNrbBHpyuR-btXq0ov3Dq9ZLtipwQKxLOFYk0epfAOk0WKBH3Mg6K_w7-K2wfbG-htFiEt0bCFUo199fbk4vDOSZd_Hp416U0VHXJhRQD3LTyn7M8wQT7GJrmuVRMheh3NKkJxxyA"
      }
    ]
  }
];

// Navigation & Routing configuration states
const activeTab = ref<ActiveTab>("home");
const selectedProductId = ref<string>("sonicpro-headphones");
const searchQuery = ref<string>("");
const isNProgressActive = ref<boolean>(false);

// Local API Integration Configuration
const getInitialApiUrl = (): string => {
  try {
    const stored = localStorage.getItem("marketplace_api_url");
    console.log('Initial API URL from localStorage:', stored);
    return stored || "http://localhost:8000/api";
  } catch {
    console.log('Error getting API URL, defaulting to http://localhost:8000/api');
    return "http://localhost:8000/api";
  }
};

const getInitialAutoSync = (): boolean => {
  try {
    const stored = localStorage.getItem("marketplace_api_autosync");
    console.log('Initial autoSync from localStorage:', stored);
    return stored !== "false";
  } catch {
    console.log('Error getting autoSync, defaulting to true');
    return true;
  }
};

const apiUrl = ref<string>(getInitialApiUrl());
const apiStatus = ref<"connected" | "offline" | "loading" | "untested">("untested");
const apiError = ref<string | null>(null);
const apiLastSync = ref<string | null>(null);
const isApiSettingsOpen = ref<boolean>(false);
const autoSync = ref<boolean>(getInitialAutoSync());

watch(apiUrl, (newUrl) => {
  localStorage.setItem("marketplace_api_url", newUrl);
});

watch(autoSync, (newVal) => {
  localStorage.setItem("marketplace_api_autosync", String(newVal));
});

// Storage Persistence states with lazy resolutions
const initialCart = (() => {
  try {
    const saved = localStorage.getItem("marketplace_cart_v2");
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
})();
const cart = ref<CartItem[]>(initialCart);

const initialWishlist = (() => {
  try {
    const saved = localStorage.getItem("marketplace_wishlist_v2");
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
})();
const wishlist = ref<Product[]>(initialWishlist);

const initialOrders = (() => {
  try {
    const saved = localStorage.getItem("marketplace_orders_v2");
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
})();
const orders = ref<Order[]>(initialOrders);

const initialProfile = (() => {
  try {
    const saved = localStorage.getItem("marketplace_profile_v2");
    return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
  } catch {
    return DEFAULT_PROFILE;
  }
})();
const userProfile = ref<UserProfile>(initialProfile);

const profileActiveSubTab = ref<"account" | "orders" | "wishlist">("account");

const initialIsLoggedIn = (() => {
  try {
    const saved = localStorage.getItem("marketplace_logged_in_v2");
    return saved === "true";
  } catch {
    return false;
  }
})();
const isLoggedIn = ref<boolean>(initialIsLoggedIn);

const toasts = ref<ToastMessage[]>([]);

// Dark mode state
// Dark mode removed - app always uses light mode

// Stateful dynamic products catalog with custom upload support
const initialProducts = (() => {
  try {
    const saved = localStorage.getItem("marketplace_products_v2");
    console.log('Loading products from localStorage:', saved ? 'Found saved data' : 'No saved data');
    return saved ? JSON.parse(saved) : [];
  } catch {
    console.log('Error loading from localStorage, using empty array');
    return [];
  }
})();
const products = ref<Product[]>(initialProducts);

// Compute cart total quantities
const cartCount = computed(() => {
  return cart.value.reduce((sum, item) => sum + item.quantity, 0);
});

// Synchronize reactive updates with browser localStorage
watch(products, (newProducts) => {
  console.log('Products updated, saving to localStorage:', newProducts.length, 'products');
  localStorage.setItem("marketplace_products_v2", JSON.stringify(newProducts));
}, { deep: true });

watch(cart, (newCart) => {
  localStorage.setItem("marketplace_cart_v2", JSON.stringify(newCart));
}, { deep: true });

watch(wishlist, (newWishlist) => {
  localStorage.setItem("marketplace_wishlist_v2", JSON.stringify(newWishlist));
}, { deep: true });

watch(orders, (newOrders) => {
  localStorage.setItem("marketplace_orders_v2", JSON.stringify(newOrders));
}, { deep: true });

watch(userProfile, (newProfile) => {
  localStorage.setItem("marketplace_profile_v2", JSON.stringify(newProfile));
}, { deep: true });

watch(isLoggedIn, (newVal) => {
  localStorage.setItem("marketplace_logged_in_v2", String(newVal));
});

// Authentication token storage
const getAuthToken = (): string | null => {
  try {
    return localStorage.getItem("marketplace_auth_token");
  } catch {
    return null;
  }
};

const setAuthToken = (token: string | null) => {
  try {
    if (token) {
      localStorage.setItem("marketplace_auth_token", token);
    } else {
      localStorage.removeItem("marketplace_auth_token");
    }
  } catch {}
};

const authToken = ref<string | null>(getAuthToken());

// Local API Sync Routines
const testConnection = async (): Promise<boolean> => {
  apiStatus.value = "loading";
  apiError.value = null;
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    const response = await fetch(`${apiUrl.value}/products`, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (response.ok) {
      apiStatus.value = "connected";
      return true;
    } else {
      apiStatus.value = "offline";
      apiError.value = `HTTP status ${response.status}: ${response.statusText}`;
      return false;
    }
  } catch (err: any) {
    apiStatus.value = "offline";
    apiError.value = err.message || "Network Error: Refused connection. Check CORS or server state.";
    return false;
  }
};

const syncProductsFromApi = async (silent = false): Promise<boolean> => {
  if (!silent) {
    apiStatus.value = "loading";
    apiError.value = null;
  }
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);
    const response = await fetch(`${apiUrl.value}/products`, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (response.ok) {
      const apiResponse = await response.json();
      const rawList = apiResponse.data || (Array.isArray(apiResponse) ? apiResponse : null);
      
      if (rawList) {
        const normalized: Product[] = rawList.map((p: any) => {
          const imageUrl = p.image_url || p.image || "";
          const fullImageUrl = imageUrl.startsWith('http') ? imageUrl : `http://localhost:8000${imageUrl}`;
          
          return {
            id: String(p.id),
            name: String(p.name),
            description: String(p.description || ""),
            price: Number(p.price || 0),
            originalPrice: undefined,
            rating: 4.5,
            reviewCount: 0,
            image: fullImageUrl,
            images: [fullImageUrl],
            category: p.category?.name || String(p.category_id || "Uncategorized"),
            tags: [],
            colors: [],
            specifications: []
          };
        });

        if (normalized.length > 0) {
          products.value = normalized;
          apiStatus.value = "connected";
          apiLastSync.value = new Date().toLocaleTimeString();
          if (!silent) {
            addToast(`Successfully synced ${normalized.length} products from API!`, "success");
          }
          return true;
        } else {
          if (!silent) {
            addToast("API returned empty array. Retained local offline products.", "info");
          }
        }
      } else {
        throw new Error("Expected array list of products from API.");
      }
    } else {
      throw new Error(`HTTP status ${response.status}: ${response.statusText}`);
    }
  } catch (err: any) {
    apiStatus.value = "offline";
    apiError.value = err.message || "Failed to fetch from API server.";
    if (!silent) {
      addToast("Failed to sync products from API. Using offline catalog.", "error");
    }
  }
  return false;
};

const syncOrderToApi = async (order: Order): Promise<boolean> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    const response = await fetch(`${apiUrl.value}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(order),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    if (response.ok) {
      addToast(`Order ${order.id} synced with local API backend!`, "success");
      return true;
    } else {
      console.warn("API order write failed:", response.status);
    }
  } catch (err: any) {
    console.warn("Local API offline. Order processed locally in offline mode.");
  }
  return false;
};

const resetToMockData = () => {
  products.value = PRODUCTS;
  apiStatus.value = "untested";
  apiError.value = null;
  apiLastSync.value = null;
  addToast("Reset to offline catalog data.", "success");
};

// Authentication & Synchronization functions
const syncUserData = async () => {
  if (!authToken.value) return;
  try {
    // 1. Fetch Profile
    const profileRes = await fetch(`${apiUrl.value}/profile`, {
      headers: { "Authorization": `Bearer ${authToken.value}` }
    });
    if (profileRes.ok) {
      const pData = await profileRes.json();
      const u = pData.data;
      if (u) {
        const imageUrl = u.image_url || (u.image ? `http://localhost:8000/storage/${u.image}` : "");
        userProfile.value = {
          fullName: u.name || "",
          email: u.email || "",
          phone: userProfile.value.phone || "",
          avatar: imageUrl,
        };
      }
    }

    // 2. Fetch Cart
    const cartRes = await fetch(`${apiUrl.value}/cart`, {
      headers: { "Authorization": `Bearer ${authToken.value}` }
    });
    if (cartRes.ok) {
      const cData = await cartRes.json();
      if (cData.data) {
        cart.value = cData.data.map((item: any) => {
          const p = item.product;
          const imageUrl = p?.image_url || p?.image || "";
          const fullImageUrl = imageUrl.startsWith('http') ? imageUrl : `http://localhost:8000${imageUrl}`;
          return {
            id: item.id,
            quantity: item.quantity,
            product: {
              id: String(p.id),
              name: String(p.name),
              description: String(p.description || ""),
              price: Number(p.price || 0),
              rating: 4.5,
              reviewCount: 0,
              image: fullImageUrl,
              images: [fullImageUrl],
              category: p.category?.name || "Uncategorized"
            }
          };
        });
      }
    }

    // 3. Fetch Wishlist
    const wishlistRes = await fetch(`${apiUrl.value}/wishlist`, {
      headers: { "Authorization": `Bearer ${authToken.value}` }
    });
    if (wishlistRes.ok) {
      const wData = await wishlistRes.json();
      if (wData.data) {
        wishlist.value = wData.data.map((item: any) => {
          const p = item.product;
          const imageUrl = p?.image_url || p?.image || "";
          const fullImageUrl = imageUrl.startsWith('http') ? imageUrl : `http://localhost:8000${imageUrl}`;
          return {
            id: String(p.id),
            name: String(p.name),
            description: String(p.description || ""),
            price: Number(p.price || 0),
            rating: 4.5,
            reviewCount: 0,
            image: fullImageUrl,
            images: [fullImageUrl],
            category: p.category?.name || "Uncategorized"
          };
        });
      }
    }

    // 4. Fetch Orders
    const ordersRes = await fetch(`${apiUrl.value}/orders`, {
      headers: { "Authorization": `Bearer ${authToken.value}` }
    });
    if (ordersRes.ok) {
      const oData = await ordersRes.json();
      if (oData.data) {
        orders.value = oData.data.map((o: any) => {
          return {
            id: `ORD-${o.id}`,
            date: new Date(o.created_at).toLocaleDateString("en-US", {
              year: "numeric", month: "long", day: "numeric"
            }),
            status: o.status === "pending" ? "Processing" : o.status === "completed" ? "Delivered" : "Processing",
            total: Number(o.total_price),
            items: (o.items || o.order_items || []).map((item: any) => {
              const p = item.product;
              const imageUrl = p?.image_url || p?.image || "";
              const fullImageUrl = imageUrl.startsWith('http') ? imageUrl : `http://localhost:8000${imageUrl}`;
              return {
                name: p?.name || "Product",
                price: Number(item.price),
                quantity: item.quantity,
                image: fullImageUrl
              };
            })
          };
        });
      }
    }
  } catch (err) {
    console.error("Failed to sync user data from API:", err);
  }
};

const updateUserProfile = (p: UserProfile) => {
  userProfile.value = p;
};

const login = async (email: string, password: string): Promise<boolean> => {
  try {
    const response = await fetch(`${apiUrl.value}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      setAuthToken(data.data.token);
      authToken.value = data.data.token;
      isLoggedIn.value = true;
      
      await syncUserData();
      
      addToast("Login successful!", "success");
      return true;
    } else {
      addToast(data.message || "Login failed", "error");
      return false;
    }
  } catch (err: any) {
    addToast("Login failed: " + (err.message || "Network error"), "error");
    return false;
  }
};

const register = async (name: string, email: string, password: string): Promise<boolean> => {
  try {
    const response = await fetch(`${apiUrl.value}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password, password_confirmation: password }),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      setAuthToken(data.data.token);
      authToken.value = data.data.token;
      isLoggedIn.value = true;
      
      await syncUserData();
      
      addToast("Registration successful!", "success");
      return true;
    } else {
      addToast(data.message || "Registration failed", "error");
      return false;
    }
  } catch (err: any) {
    addToast("Registration failed: " + (err.message || "Network error"), "error");
    return false;
  }
};

const logout = async (): Promise<void> => {
  try {
    if (authToken.value) {
      await fetch(`${apiUrl.value}/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken.value}`,
        },
      });
    }
  } catch (err) {
    console.error("Logout error:", err);
  } finally {
    setAuthToken(null);
    authToken.value = null;
    isLoggedIn.value = false;
    cart.value = [];
    wishlist.value = [];
    orders.value = [];
    addToast("Logged out successfully", "info");
  }
};

// Popstate tracking
const handlePopState = (e: PopStateEvent) => {
  if (e.state && e.state.tab) {
    activeTab.value = e.state.tab;
    if (e.state.prodId) {
      selectedProductId.value = e.state.prodId;
    }
  } else {
    const hash = window.location.hash.replace("#", "") as ActiveTab;
    if (hash && ["home", "shop", "product-detail", "cart", "checkout", "profile", "wishlist"].includes(hash)) {
      activeTab.value = hash;
    }
  }
};

onMounted(() => {
  window.addEventListener("popstate", handlePopState);
  
  // Initial hash deep alignment
  const initialHash = window.location.hash.replace("#", "") as ActiveTab;
  if (initialHash && ["home", "shop", "product-detail", "cart", "checkout", "profile", "wishlist"].includes(initialHash)) {
    activeTab.value = initialHash;
  } else {
    try {
      window.history.replaceState({ tab: "home" }, "", "#home");
    } catch {}
  }

  console.log('App mounted, autoSync:', autoSync.value, 'API URL:', apiUrl.value);
  
  // Trigger local backend API synchronization
  syncProductsFromApi(true);

  if (authToken.value) {
    syncUserData();
  }
});

onUnmounted(() => {
  window.removeEventListener("popstate", handlePopState);
});

// Toast dispatch utilities
const addToast = (message: string, type: "success" | "error" | "info") => {
  const newToastId = "toast-" + Math.random().toString(36).substring(2, 11);
  const newToast: ToastMessage = {
    id: newToastId,
    type,
    message,
  };
  toasts.value.push(newToast);
  setTimeout(() => {
    removeToast(newToastId);
  }, 4000);
};

const removeToast = (id: string) => {
  toasts.value = toasts.value.filter((t) => t.id !== id);
};

// Browser router animation orchestrator
const triggerRouteAnimation = (targetTab: ActiveTab, prodId?: string) => {
  console.log('triggerRouteAnimation called:', targetTab, prodId);
  isNProgressActive.value = true;
  setTimeout(() => {
    isNProgressActive.value = false;
  }, 450);

  activeTab.value = targetTab;
  console.log('activeTab set to:', activeTab.value);
  if (prodId) {
    selectedProductId.value = prodId;
  }

  try {
    const nextState = { tab: targetTab, prodId: prodId || selectedProductId.value };
    window.history.pushState(nextState, "", `#${targetTab}`);
  } catch {}

  window.scrollTo({ top: 0, behavior: "smooth" });
};

// Shopping Business Processes
const addToCart = async (product: Product, quantity: number, color?: string) => {
  // Optimistically update the UI state immediately!
  const existingIdx = cart.value.findIndex(
    (item) => item.product.id === product.id && (!color || item.selectedColor === color)
  );
  if (existingIdx > -1) {
    cart.value[existingIdx].quantity += quantity;
  } else {
    cart.value.push({ product, quantity, selectedColor: color });
  }
  addToast(`Added ${quantity}x ${product.name} to your cart!`, "success");

  if (isLoggedIn.value && authToken.value) {
    try {
      const response = await fetch(`${apiUrl.value}/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken.value}`,
        },
        body: JSON.stringify({ product_id: Number(product.id), quantity }),
      });
      if (response.ok) {
        // Sync behind the scenes to get database IDs, but don't block
        syncUserData();
      } else {
        const errorData = await response.json();
        console.error("Backend failed to add product to cart:", errorData.message);
      }
    } catch (err: any) {
      console.error("Network error when adding to cart:", err.message);
    }
  }
};

const updateCartQuantity = async (index: number, quantity: number) => {
  if (quantity < 1) return;
  const item = cart.value[index];
  if (!item) return;

  // Optimistically update UI immediately
  const oldQuantity = item.quantity;
  item.quantity = quantity;

  if (isLoggedIn.value && authToken.value && item.id) {
    try {
      const response = await fetch(`${apiUrl.value}/cart/${item.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken.value}`,
        },
        body: JSON.stringify({ quantity }),
      });
      if (!response.ok) {
        // Revert on failure
        item.quantity = oldQuantity;
        const errorData = await response.json();
        addToast(errorData.message || "Failed to update quantity on server", "error");
      }
    } catch (err: any) {
      console.error("Failed to update cart quantity on backend", err);
      item.quantity = oldQuantity;
    }
  }
};

const removeFromCart = async (index: number) => {
  const item = cart.value[index];
  if (!item) return;

  // Optimistically remove from UI immediately
  cart.value.splice(index, 1);
  addToast(`${item.product.name} removed from your cart.`, "info");

  if (isLoggedIn.value && authToken.value && item.id) {
    try {
      const response = await fetch(`${apiUrl.value}/cart/${item.id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${authToken.value}`,
        },
      });
      if (!response.ok) {
        console.error("Failed to remove item from cart on server");
        syncUserData();
      }
    } catch (err: any) {
      console.error("Failed to remove cart item from backend", err);
      syncUserData();
    }
  }
};

const toggleWishlist = async (product: Product) => {
  if (!isLoggedIn.value) {
    addToast("Please login first to save items to your wishlist.", "info");
    profileActiveSubTab.value = "account";
    triggerRouteAnimation("profile");
    return;
  }

  const alreadySaved = wishlist.value.some((item) => item.id === product.id);
  
  // Optimistically update UI immediately
  if (alreadySaved) {
    wishlist.value = wishlist.value.filter((item) => item.id !== product.id);
    addToast(`${product.name} removed from saved Wishlist.`, "info");
  } else {
    wishlist.value.push(product);
    addToast(`${product.name} saved to your favorites Wishlist!`, "success");
  }

  if (authToken.value) {
    try {
      if (alreadySaved) {
        const response = await fetch(`${apiUrl.value}/wishlist/${product.id}`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${authToken.value}`,
          },
        });
        if (!response.ok) {
          console.error("Failed to remove from wishlist on server");
          syncUserData();
        }
      } else {
        const response = await fetch(`${apiUrl.value}/wishlist`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authToken.value}`,
          },
          body: JSON.stringify({ product_id: Number(product.id) }),
        });
        if (response.ok) {
          syncUserData();
        } else {
          console.error("Failed to add to wishlist on server");
          syncUserData();
        }
      }
    } catch (err: any) {
      console.error("Wishlist operation error:", err.message);
      syncUserData();
    }
  }
};

const submitOrder = async (shippingAddress: string, couponCode?: string): Promise<boolean> => {
  if (isLoggedIn.value && authToken.value) {
    try {
      const response = await fetch(`${apiUrl.value}/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken.value}`,
        },
        body: JSON.stringify({ shipping_address: shippingAddress, coupon_code: couponCode }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        cart.value = [];
        await syncUserData();
        return true;
      } else {
        addToast(data.message || "Failed to place order", "error");
        return false;
      }
    } catch (err: any) {
      addToast("Checkout failed: " + (err.message || "Network error"), "error");
      return false;
    }
  } else {
    addToast("Please login to proceed with checkout", "info");
    return false;
  }
};

// Dynamic helper capabilities to change catalog image URLs
const updateProductImage = (productId: string, newUrl: string) => {
  products.value = products.value.map((p) => {
    if (p.id === productId) {
      const updated = {
        ...p,
        image: newUrl,
        images: p.images ? (p.images.includes(newUrl) ? p.images : [newUrl, ...p.images]) : [newUrl]
      };
      // Carry changes into cart & wishlist
      cart.value = cart.value.map((item) =>
        item.product.id === productId ? { ...item, product: updated } : item
      );
      wishlist.value = wishlist.value.map((item) => (item.id === productId ? updated : item));
      return updated;
    }
    return p;
  });
};

const removeProductImage = (productId: string) => {
  products.value = products.value.map((p) => {
    if (p.id === productId) {
      const updated = {
        ...p,
        image: "",
        images: []
      };
      // Carry changes into cart & wishlist
      cart.value = cart.value.map((item) =>
        item.product.id === productId ? { ...item, product: updated } : item
      );
      wishlist.value = wishlist.value.map((item) => (item.id === productId ? updated : item));
      return updated;
    }
    return p;
  });
};
</script>

<template>
  <div class="min-h-screen flex flex-col bg-[#F8FAFC] text-[#0F172A] font-sans antialiased selection:bg-blue-500 selection:text-white">
    
    <!-- Simulated Custom NProgress Top Loading Bar -->
    <div v-if="isNProgressActive" class="fixed top-0 left-0 right-0 h-1 bg-blue-600 z-[1000] origin-left animate-loading-bar" />

    <!-- Dynamic Toast system -->
    <Toasts :toasts="toasts" :removeToast="removeToast" />

    <!-- Popular Products Promotion Modal -->
    <PromoModal
      :products="products"
      :triggerRouteAnimation="triggerRouteAnimation"
      :addToCart="addToCart"
      :addToast="addToast"
    />

    <!-- Header Section -->
    <Header
      :activeTab="activeTab"
      :setActiveTab="(val: any) => activeTab = val"
      :cartCount="cartCount"
      :wishlistCount="wishlist.length"
      :searchQuery="searchQuery"
      :setSearchQuery="(val: any) => searchQuery = val"
      :triggerRouteAnimation="triggerRouteAnimation"
      :setProfileActiveSubTab="(val: any) => profileActiveSubTab = val"
      :profileActiveSubTab="profileActiveSubTab"
      :isLoggedIn="isLoggedIn"
      :userProfile="userProfile"
    />

    <!-- Main Client Single View Controller Canvas -->
    <main class="flex-grow pt-4">
      <transition
        enter-active-class="transition duration-150 ease-out"
        enter-from-class="transform translate-y-3 opacity-0"
        enter-to-class="transform translate-y-0 opacity-100"
        leave-active-class="transition duration-100 ease-in"
        leave-from-class="transform translate-y-0 opacity-100"
        leave-to-class="transform -translate-y-3 opacity-0"
        mode="out-in"
      >
        <div :key="activeTab + (activeTab === 'product-detail' ? `-${selectedProductId}` : '')">
          
          <HomeView
            v-if="activeTab === 'home'"
            :products="products"
            :setActiveTab="(val: any) => activeTab = val"
            :setSelectedProductId="(val: any) => selectedProductId = val"
            :addToCart="addToCart"
            :toggleWishlist="toggleWishlist"
            :wishlist="wishlist"
            :triggerRouteAnimation="triggerRouteAnimation"
            :addToast="addToast"
          />

          <CatalogView
            v-else-if="activeTab === 'shop'"
            :products="products"
            :setActiveTab="(val: any) => activeTab = val"
            :setSelectedProductId="(val: any) => selectedProductId = val"
            :addToCart="addToCart"
            :toggleWishlist="toggleWishlist"
            :wishlist="wishlist"
            :searchQuery="searchQuery"
            :setSearchQuery="(val: any) => searchQuery = val"
            :triggerRouteAnimation="triggerRouteAnimation"
          />

          <ProductDetailView
            v-else-if="activeTab === 'product-detail'"
            :productId="selectedProductId"
            :products="products"
            :activeTab="activeTab"
            :setActiveTab="(val: any) => activeTab = val"
            :setSelectedProductId="(val: any) => selectedProductId = val"
            :addToCart="addToCart"
            :toggleWishlist="toggleWishlist"
            :wishlist="wishlist"
            :triggerRouteAnimation="triggerRouteAnimation"
            :updateProductImage="updateProductImage"
            :removeProductImage="removeProductImage"
            :addToast="addToast"
          />

          <CartView
            v-else-if="activeTab === 'cart'"
            :cart="cart"
            :updateCartQuantity="updateCartQuantity"
            :removeFromCart="removeFromCart"
            :triggerRouteAnimation="triggerRouteAnimation"
            :toggleWishlist="toggleWishlist"
            :isLoggedIn="isLoggedIn"
            :setProfileActiveSubTab="(val: any) => profileActiveSubTab = val"
            :addToast="addToast"
          />

          <div v-else-if="activeTab === 'checkout'">
            <CheckoutView
              v-if="isLoggedIn"
              :cart="cart"
              :submitOrder="submitOrder"
              :triggerRouteAnimation="triggerRouteAnimation"
              :addToast="addToast"
            />
            <ProfileView
              v-else
              :userProfile="userProfile"
              :setUserProfile="updateUserProfile"
              :orders="orders"
              :wishlist="wishlist"
              :toggleWishlist="toggleWishlist"
              :addToCart="addToCart"
              :triggerRouteAnimation="triggerRouteAnimation"
              :setSelectedProductId="(val: any) => selectedProductId = val"
              :addToast="addToast"
              :profileActiveSubTab="profileActiveSubTab"
              :setProfileActiveSubTab="(val: any) => profileActiveSubTab = val"
              :isLoggedIn="isLoggedIn"
              :setIsLoggedIn="(val: any) => isLoggedIn = val"
              :login="login"
              :register="register"
              :logout="logout"
              :apiUrl="apiUrl"
            />
          </div>

          <ProfileView
            v-else-if="activeTab === 'profile'"
            :userProfile="userProfile"
            :setUserProfile="updateUserProfile"
            :orders="orders"
            :wishlist="wishlist"
            :toggleWishlist="toggleWishlist"
            :addToCart="addToCart"
            :triggerRouteAnimation="triggerRouteAnimation"
            :setSelectedProductId="(val: any) => selectedProductId = val"
            :addToast="addToast"
            :profileActiveSubTab="profileActiveSubTab"
            :setProfileActiveSubTab="(val: any) => profileActiveSubTab = val"
            :isLoggedIn="isLoggedIn"
            :setIsLoggedIn="(val: any) => isLoggedIn = val"
            :login="login"
            :register="register"
            :logout="logout"
            :apiUrl="apiUrl"
          />

          <WishlistView
            v-else-if="activeTab === 'wishlist'"
            :wishlist="wishlist"
            :toggleWishlist="toggleWishlist"
            :addToCart="addToCart"
            :triggerRouteAnimation="triggerRouteAnimation"
            :setSelectedProductId="(val: any) => selectedProductId = val"
            :addToast="addToast"
            :isLoggedIn="isLoggedIn"
            :setProfileActiveSubTab="(val: any) => profileActiveSubTab = val"
          />

        </div>
      </transition>
    </main>

    <!-- Footer Segment -->
    <Footer />

    <!-- Developer API Settings & Logs Drawer -->
    <ApiSettingsModal
      :isOpen="isApiSettingsOpen"
      :onClose="() => isApiSettingsOpen = false"
      :apiUrl="apiUrl"
      :setApiUrl="(url: string) => apiUrl = url"
      :apiStatus="apiStatus"
      :apiError="apiError"
      :apiLastSync="apiLastSync"
      :autoSync="autoSync"
      :setAutoSync="(val: boolean) => autoSync = val"
      :testConnection="testConnection"
      :syncProductsFromApi="syncProductsFromApi"
      :resetToMockData="resetToMockData"
    />

  </div>
</template>

<style>
@keyframes loadingBar {
  0% { transform: scaleX(0); }
  100% { transform: scaleX(1); }
}
.animate-loading-bar {
  animation: loadingBar 450ms ease-out forwards;
}
</style>
