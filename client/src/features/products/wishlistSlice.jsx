import { createSlice } from '@reduxjs/toolkit';

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: [],
  reducers: {
    addToWishlist: (state, action) => {
      const product = action.payload;
      const exists = state.find(item => item.id === product.id);
      if (!exists) {
        state.push(product);
      }
    },
    removeFromWishlist: (state, action) => {
      return state.filter(item => item.id !== action.payload);
    }
  }
});

export const { addToWishlist, removeFromWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
