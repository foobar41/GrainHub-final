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

      console.log(state.products.length)
    },
    delCart: (state) => {
      state.quantity = 0;
      while(state.products.length > 0) {
        state.products.pop();
      }
      // state.products = []; 
      state.total = 0;
    },
  },
});

export const { addProduct, delCart } = cartSlice.actions;
export default cartSlice.reducer;
