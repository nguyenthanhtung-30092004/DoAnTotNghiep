import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import authService from "../../services/auth.service";
import { toast } from "react-toastify";
import { AtomIcon } from "lucide-react";

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
// 3. Chức năng đăng ký
export const register = createAsyncThunk(
  "auth/register",
  async (data, { rejectWithValue }) => {
    try {
      const res = await authService.register(data);
      console.log(res.data);
      return res.data.metadata;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Đăng ký thất bại");
    }
  },
);

// 4. Chức năng đăng xuất
export const logoutUser = createAsyncThunk("auth/logout", async () => {
  await authService.logout();
  return true;
});

// 5. Quên mật khẩu
export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email, { rejectWithValue }) => {
    try {
      const res = await authService.forgotPassword({ email });
      return res.data.message || "Đã gửi email";
    } catch (error) {
      return rejectWithValue(
        err.response?.data?.message || "Gửi email thất bại",
      );
    }
  },
);

// 6. verify OTP
export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async (data, { rejectWithValue }) => {
    try {
      const res = await authService.verifyOtp(data);
      return res.data.message;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "OTP không hợp lệ",
      );
    }
  },
);

// 7. reset password
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (data, { rejectWithValue }) => {
    try {
      const res = await authService.resetPassword(data);
      return res.data.message;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Đổi mật khẩu thất bại",
      );
    }
  },
);

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
      })

      //register
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })

      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        localStorage.setItem("user", JSON.stringify(action.payload));
        toast.success("Đăng ký thành công");
      })

      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        toast.error(action.payload);
      })

      // Forgot password
      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true;
      })

      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        toast.success(action.payload);
      })

      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        toast.error(action.payload);
      })

      // VERIFY OTP
      .addCase(verifyOtp.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.isLoading = false;
        toast.success(action.payload);
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.isLoading = false;
        toast.error(action.payload);
      })

      // RESET PASSWORD
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        toast.success(action.payload);
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        toast.error(action.payload);
      });
  },
});

export default authSlice.reducer;
