// src/features/products/footerSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  links: [
    { name: "Home", href: "/" },
    { name: "About", href: "/aboutpage" },
    { name: "Wishlist", href: "/wishlist" },
    { name: "Cart", href: "/cart" },
  ],
  social: [
    { name: "Facebook", href: "https://facebook.com", icon: "facebook" },
    { name: "Instagram", href: "https://instagram.com", icon: "instagram" },
    { name: "LinkedIn", href: "https://linkedin.com", icon: "linkedin" },
    { name: "Twitter", href: "https://twitter.com", icon: "twitter" },
  ],
};

export const footerSlice = createSlice({
  name: "footer",
  initialState,
  reducers: {},
});

export default footerSlice.reducer;
