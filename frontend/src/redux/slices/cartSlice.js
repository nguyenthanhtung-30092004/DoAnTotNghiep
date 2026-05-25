import { createSlice } from "@reduxjs/toolkit";

const getCartCount = (items = []) => {
  return items.reduce((total, item) => total + Number(item.quantity || 0), 0);
};

const clampQuantity = (quantity, maxQuantity) => {
  const value = Math.max(1, Number(quantity || 1));
  const max = Number(maxQuantity || 0);

  if (max > 0) {
    return Math.min(value, max);
  }

  return value;
};

const initialState = {
  items: [],
  totalQuantity: 0,
  isDrawerOpen: false,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart: (state, action) => {
      const cart = action.payload;
      const items = Array.isArray(cart?.items) ? cart.items : [];

      state.items = items;
      state.totalQuantity = getCartCount(items);
    },

    addGuestCart: (state, action) => {
      const payload = action.payload;

      const existingItem = state.items.find(
        (item) =>
          item.productId === payload.productId &&
          item.variantId === payload.variantId &&
          item.sizeId === payload.sizeId,
      );

      if (existingItem) {
        existingItem.quantity = clampQuantity(
          Number(existingItem.quantity || 0) + Number(payload.quantity || 1),
          existingItem.maxQuantity || payload.maxQuantity,
        );
      } else {
        state.items.push({
          ...payload,
          quantity: clampQuantity(payload.quantity, payload.maxQuantity),
        });
      }

      state.totalQuantity = getCartCount(state.items);
    },

    clearCartRedux: (state) => {
      state.items = [];
      state.totalQuantity = 0;
    },

    openCartDrawer: (state) => {
      state.isDrawerOpen = true;
    },

    closeCartDrawer: (state) => {
      state.isDrawerOpen = false;
    },

    increaseQuantity: (state, action) => {
      const item = state.items.find((item) => item.localId === action.payload);

      if (item) {
        item.quantity = clampQuantity(
          Number(item.quantity || 0) + 1,
          item.maxQuantity,
        );
      }

      state.totalQuantity = getCartCount(state.items);
    },

    decreaseQuantity: (state, action) => {
      const item = state.items.find((item) => item.localId === action.payload);

      if (item && item.quantity > 1) {
        item.quantity -= 1;
      }

      state.totalQuantity = getCartCount(state.items);
    },

    removeCartItem: (state, action) => {
      state.items = state.items.filter(
        (item) => item.localId !== action.payload,
      );

      state.totalQuantity = getCartCount(state.items);
    },
  },
});

export const {
  setCart,
  addGuestCart,
  clearCartRedux,
  openCartDrawer,
  closeCartDrawer,
  increaseQuantity,
  decreaseQuantity,
  removeCartItem,
} = cartSlice.actions;

export default cartSlice.reducer;
