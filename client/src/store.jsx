import { configureStore } from '@reduxjs/toolkit';
import productsReducer from './features/products/productsSlice';
import aboutReducer from './features/products/aboutSlice';
import wishlistReducer from './features/products/wishlistSlice'
import cartReducer from './features/products/cartSlice';
import footerReducer from "./features/products/footerSlice";
import authReducer from "./features/products/authSlice";


export const store = configureStore({
  reducer: {
    products: productsReducer,
    wishlist: wishlistReducer,
    cart: cartReducer,
    footer: footerReducer,
    about: aboutReducer,
    auth: authReducer
  },
});
