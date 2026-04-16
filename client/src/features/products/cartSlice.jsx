// src/features/products/cartSlice.jsx
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api/axios";

// Note: Auth headers are automatically attached by the axios interceptor in api/axios.js

// ✅ TRANSFORM DATA (SAFE)
const transform = (data = []) =>
  (Array.isArray(data) ? data : [])
    .filter((item) => item?.productId)
    .map((item) => ({
      id: item.productId._id || item.productId.id || item.productId,
      name: item.productId.title || item.productId.name || "Product",
      price: item.productId.price || 0,
      image: item.productId.image || "",
      brand: item.productId.brand || "FashionHub",
      quantity: item.quantity || 1,
    }));

// ✅ FETCH CART
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/cart");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ✅ ADD
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const res = await api.post(
        "/cart",
        { productId, quantity }
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ✅ UPDATE
export const updateCartItem = createAsyncThunk(
  "cart/updateCartItem",
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const res = await api.put(
        `/cart/${productId}`,
        { quantity }
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ✅ DELETE
export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (productId, { rejectWithValue }) => {
    try {
      const res = await api.delete(
        `/cart/${productId}`
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ✅ CLEAR CART
export const clearCartAPI = createAsyncThunk(
  "cart/clearCart",
  async (_, { rejectWithValue }) => {
    try {
      await api.delete("/cart", getAuthHeader());
      return [];
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.items = transform(action.payload);
        state.status = "succeeded";
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.items = transform(action.payload);
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.items = transform(action.payload);
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = transform(action.payload);
      })
      .addCase(clearCartAPI.fulfilled, (state) => {
        state.items = [];
      })
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, action) => {
          state.error = action.payload || "Something went wrong";
        }
      );
  },
});

export default cartSlice.reducer;