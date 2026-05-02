import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import authService from "../../services/auth.service";
import { toast } from "react-toastify";

// 1. Lấy user từ local
const getUserFromStorage = () => {
  try {
    const data = localStorage.getItem("user");
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

// 2. Chức năng đăng nhập
export const loginUser = createAsyncThunk(
  "auth/login",
  async (data, { rejectWithValue }) => {
    try {
      const res = await authService.login(data);
      return res.data.metadata;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Đăng nhập thất bại",
      );
    }
  },
);
// // ===== SIGNUP =====
// export const signupUser = createAsyncThunk(
//   "auth/signup",
//   async (data, { rejectWithValue }) => {
//     try {
//       const res = await authService.signUp(data);
//       return res.metadata;
//     } catch (err) {
//       return rejectWithValue(err.response?.data?.message || "Signup failed");
//     }
//   },
// );

// ===== LOGOUT =====
export const logoutUser = createAsyncThunk("auth/logout", async () => {
  await authService.logout();
  return true;
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: getUserFromStorage(),
    isLoading: false,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })

      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;

        state.user = action.payload;
        localStorage.setItem("user", JSON.stringify(action.payload));
        toast.success("Đăng nhập thành công");
      })

      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        toast.error(action.payload);
      })

      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        localStorage.removeItem("user");
        toast.info("Đã đăng xuất");
      });
  },
});

export default authSlice.reducer;
