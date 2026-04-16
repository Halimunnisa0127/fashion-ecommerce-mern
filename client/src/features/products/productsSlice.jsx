import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../services/api/axios";

// ✅ HELPER
const mapProduct = (product) => {
  const price = product.price;

  let discountPercent;
  if (price < 1000) discountPercent = 5;
  else if (price < 3000) discountPercent = 10;
  else if (price < 5000) discountPercent = 15;
  else discountPercent = 20;

  const originalPrice = Math.round(price / (1 - discountPercent / 100));

  return {
    id: product._id || product.id,
    name: product.title,
    brand: "Nykaa",
    price,
    originalPrice,
    discountPercent,
    rating: product.rating?.rate || product.rating || 0,
    image: product.image,
    category: product.category,
    inStock: true,
    description: product.description,
  };
};

// ✅ FETCH PRODUCTS
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async ({ page, limit }, { rejectWithValue }) => {
    try {
      const response = await API.get(`/products?page=${page}&limit=${limit}`);
      const products = response.data || [];

      return {
        data: products.map(mapProduct),
        page,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

// ✅ FETCH SINGLE PRODUCT
export const fetchProductById = createAsyncThunk(
  "products/fetchProductById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await API.get(`/products/${id}`);
      return mapProduct(response.data);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

const initialState = {
  products: [],
  filteredProducts: [],
  status: "idle",
  error: null,
  activeFilter: "all",
  searchTerm: "",
  sortBy: null,
  page: 1,
  hasMore: true,
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    filterProducts: (state, action) => {
      state.activeFilter = action.payload;
      state.filteredProducts = filterAndSearch(
        state.products,
        action.payload,
        state.searchTerm,
        state.sortBy
      );
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
      state.filteredProducts = filterAndSearch(
        state.products,
        state.activeFilter,
        state.searchTerm,
        action.payload
      );
    },
    searchProducts: (state, action) => {
      state.searchTerm = action.payload;
      state.filteredProducts = filterAndSearch(
        state.products,
        state.activeFilter,
        action.payload,
        state.sortBy
      );
    },
    resetProducts: (state) => {
      state.products = [];
      state.page = 1;
      state.hasMore = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";

        if (action.payload.data.length === 0) {
          state.hasMore = false;
        } else {
          if (action.payload.page === 1) {
            state.products = action.payload.data;
          } else {
            // Filter out any products that already exist in the state to prevent duplicates
            const newProducts = action.payload.data.filter(
              (newProd) => !state.products.find((p) => p.id === newProd.id)
            );
            state.products = [...state.products, ...newProducts];
          }

          state.filteredProducts = filterAndSearch(
            state.products,
            state.activeFilter,
            state.searchTerm,
            state.sortBy
          );

          state.page = action.payload.page;
        }
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.payload || "Failed to load products";
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        const exists = state.products.find(
          (p) => p.id === action.payload.id
        );
        if (!exists) {
          state.products.push(action.payload);
        }
      });
  },
});

// ✅ HELPER
function filterAndSearch(products, category, searchTerm, sortBy) {
  let result = [...products];

  if (category !== "all") {
    result = result.filter(
      (product) => product.category === category
    );
  }

  if (sortBy === "lowprice-highprice") {
    result.sort((a, b) => a.price - b.price);
  } else if (sortBy === "highprice-lowprice") {
    result.sort((a, b) => b.price - a.price);
  } else if (sortBy === "rating") {
    result.sort((a, b) => b.rating - a.rating);
  } else if (sortBy === "discountPercent") {
    result.sort((a, b) => b.discountPercent - a.discountPercent);
  }

  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    result = result.filter(
      (product) =>
        (product.name?.toLowerCase() || "").includes(term) ||
        (product.description?.toLowerCase() || "").includes(term) ||
        (product.brand?.toLowerCase() || "").includes(term)
    );
  }

  return result;
}

export const {
  filterProducts,
  searchProducts,
  setSortBy,
  resetProducts,
} = productsSlice.actions;

export const selectAllProducts = (state) => state.products.filteredProducts;
export const getProductsStatus = (state) => state.products.status;
export const getProductsError = (state) => state.products.error;

export default productsSlice.reducer;