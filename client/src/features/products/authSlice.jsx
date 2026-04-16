// src/features/auth/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../services/api/axios";

export const verifyToken = createAsyncThunk(
  "auth/verifyToken",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const response = await API.get(
        "/verify-token",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data.user;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isAuthenticated: false,
    status: "idle",
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(verifyToken.pending, (state) => {
        state.status = "loading";
      })
      .addCase(verifyToken.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(verifyToken.rejected, (state, action) => {
        state.status = "failed";
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload;

        localStorage.removeItem("token"); // 🔥 important
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;