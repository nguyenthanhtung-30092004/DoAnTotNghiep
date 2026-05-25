import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice"; // Đảm bảo đường dẫn đúng
import cartReducer from "./slices/cartSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer, // Key này phải là 'auth' để dùng useSelector(state => state.auth)
    cart: cartReducer,
  },
});

export default store;
