import { create } from 'zustand';

export const useStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  cart: [],
  isLoading: false,
  error: null,

  setUser: (user) => set({ user }),
  setToken: (token) => {
    if (token) localStorage.setItem('token', token);
    else localStorage.removeItem('token');
    set({ token });
  },
  setCart: (cart) => set({ cart }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  login: (user, token) => {
    set({ user, token });
    localStorage.setItem('token', token);
  },

  logout: () => {
    set({ user: null, token: null, cart: [] });
    localStorage.removeItem('token');
  },

  addToCart: (item) => set((state) => {
    const existingItem = state.cart.find(i => i.product._id === item.product._id);
    if (existingItem) {
      return {
        cart: state.cart.map(i =>
          i.product._id === item.product._id
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        )
      };
    }
    return { cart: [...state.cart, item] };
  }),

  removeFromCart: (productId) => set((state) => ({
    cart: state.cart.filter(item => item.product._id !== productId)
  })),

  clearCart: () => set({ cart: [] })
}));
