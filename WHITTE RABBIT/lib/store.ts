import { create } from 'zustand';

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

interface AppState {
  // Auth
  user: { id: string; email: string; name: string; points: number; isAdmin: boolean } | null;
  isAdmin: boolean;

  // Cart
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: () => number;

  // UI
  showAdminModal: boolean;
  setShowAdminModal: (show: boolean) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  user: null,
  isAdmin: false,
  cart: [],

  setUser: (user) => set({ user }),
  setIsAdmin: (admin) => set({ isAdmin: admin }),
  logout: () => set({ user: null, isAdmin: false }),

  addToCart: (item) =>
    set((state) => {
      const existing = state.cart.find((i) => i.productId === item.productId);
      if (existing) {
        return {
          cart: state.cart.map((i) =>
            i.productId === item.productId
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          ),
        };
      }
      return { cart: [...state.cart, item] };
    }),
  removeFromCart: (productId) =>
    set((state) => ({
      cart: state.cart.filter((i) => i.productId !== productId),
    })),
  updateCartQuantity: (productId, quantity) =>
    set((state) => ({
      cart:
        quantity <= 0
          ? state.cart.filter((i) => i.productId !== productId)
          : state.cart.map((i) =>
              i.productId === productId ? { ...i, quantity } : i
            ),
    })),
  clearCart: () => set({ cart: [] }),
  cartTotal: () => {
    const state = get();
    return state.cart.reduce((total, item) => total + item.price * item.quantity, 0);
  },

  showAdminModal: false,
  setShowAdminModal: (show) => set({ showAdminModal: show }),
}));
