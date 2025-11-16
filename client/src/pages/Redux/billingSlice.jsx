import { createSlice } from "@reduxjs/toolkit";

const billingSlice = createSlice({
  name: "billing",
  initialState: {
    items: [],
    orders: [],
    customerName: ""
  },
  reducers: {
    setItems(state, action) {
      // Initialize all qty = 0 like BillingUseState
      state.items = action.payload.map((i) => ({ ...i, qty: 0 }));
    },
    setOrders(state, action) {
      state.orders = action.payload;
    },
    setCustomerName(state, action) {
      state.customerName = action.payload;
    },
    updateQty(state, action) {
      const { id, qty } = action.payload;
      state.items = state.items.map((item) =>
        item._id === id ? { ...item, qty: Math.max(qty, 0) } : item
      );
    },
    clearOrder(state) {
      state.customerName = "";
      state.items = state.items.map((i) => ({ ...i, qty: 0 }));
    }
  }
});

export const {
  setItems,
  setOrders,
  updateQty,
  clearOrder,
  setCustomerName
} = billingSlice.actions;

export default billingSlice.reducer;
