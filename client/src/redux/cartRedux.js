import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({

  name: "cart",
  initialState: {
    products: [],
    quantity: 0,
    total: 0,
  },
  reducers: {
    addProduct: (state, action) => {
      const existingProduct = state.products.find((product) => product.name === action.payload.name);
      if (existingProduct) {
        existingProduct.quantity += action.payload.quantity
      } else {
        state.products.push(action.payload);
      }
      state.quantity = state.products.length;
      state.total += action.payload.price * action.payload.quantity;
    },

    updateQuantity: (state, action) => {
      const { name, quantity } = action.payload;
      const product = state.products.find((product) => product.name === name);

      if (product && quantity >= 0) {
        const diff = quantity - product.quantity;
        product.quantity = quantity;
        state.total += diff * product.price;
      }
    },

    removeProduct: (state, action) => {
      const index = state.products.findIndex((product) => product.name === action.payload.name);
      if (index !== -1) {
        state.total -= state.products[index].price * state.products[index].quantity;
        state.products.splice(index, 1);
        state.quantity = state.products.length;
      }
    },

    delCart: (state) => {
      state.quantity = 0;
      while (state.products.length > 0) {
        state.products.pop();
      }
      state.total = 0;
    },
  },
});

export const { addProduct, updateQuantity, removeProduct, delCart } = cartSlice.actions;
export default cartSlice.reducer;
