import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import authService from "../../services/auth.service";
import { toast } from "react-toastify";

// ===== LOGIN =====
export const loginUser = createAsyncThunk(
  "auth/login",
  async (data, { rejectWithValue }) => {
    try {
      const res = await authService.login(data);
      return res.metadata;
    } catch (err) {
      console.error("Lỗi từ Backend khi Login:", err.response?.data);
      return rejectWithValue(
        err.response?.data?.message || "Đăng nhập thất bại, vui lòng thử lại.",
      );
    }
  },
);

// ===== SIGNUP =====
export const signupUser = createAsyncThunk(
  "auth/signup",
  async (data, { rejectWithValue }) => {
    try {
      const res = await authService.signUp(data);
      return res.metadata;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Signup failed");
    }
  },
);

// ===== LOGOUT =====
export const logoutUser = createAsyncThunk("auth/logout", async () => {
  await authService.logout();
  return true;
});

// ===== SLICE =====
const getUserFromStorage = () => {
  try {
    const data = localStorage.getItem("user");
    return data && data !== "undefined" ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: getUserFromStorage(),
    isLoading: false,
  },
  reducers: {},

  extraReducers: (builder) => {
    builder
      // ===== LOGIN =====
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.user = action.payload;
          localStorage.setItem("user", JSON.stringify(action.payload));
          localStorage.setItem("userId", action.payload?._id);
        }

        localStorage.setItem("user", JSON.stringify(action.payload));
        localStorage.setItem("userId", action.payload?._id);

        toast.success("Login thành công");
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
      })

      // ===== SIGNUP =====
      .addCase(signupUser.fulfilled, (state, action) => {
        state.user = action.payload;

        localStorage.setItem("user", JSON.stringify(action.payload));
        localStorage.setItem("userId", action.payload?._id);

        toast.success("Đăng ký thành công");
      })

      // ===== LOGOUT =====
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;

        localStorage.removeItem("user");
        localStorage.removeItem("userId");

        toast.info("Đã đăng xuất");
      });
  },
});

export default authSlice.reducer;
