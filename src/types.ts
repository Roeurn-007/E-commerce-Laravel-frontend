export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  images: string[];
  category: string;
  tags?: string[];
  colors?: { name: string; value: string }[];
  specifications?: { label: string; value: string }[];
}

export interface CartItem {
  id?: number;
  product: Product;
  quantity: number;
  selectedColor?: string;
}

export interface UserProfile {
  fullName: string;
  email: string;
  phone: string;
  avatar: string;
}

export interface OrderItem {
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  date: string;
  status: "Delivered" | "Processing" | "Shipped" | "Cancelled";
  total: number;
  items: OrderItem[];
}

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "info";
  message: string;
}

export type ActiveTab = "home" | "shop" | "product-detail" | "cart" | "checkout" | "profile" | "wishlist";
