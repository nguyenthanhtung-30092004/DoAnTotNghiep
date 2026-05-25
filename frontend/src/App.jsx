import "./App.css";
import { RouterProvider } from "react-router";
import router from "./app/router";
import { Provider } from "react-redux";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { store } from "./redux/store";
import { ToastContainer, Slide } from "react-toastify";
import authService from "./services/auth.service";
import { clearUser, setUser } from "./redux/slices/authSlice";

const getResponseData = (res) => {
  return res.data?.metadata || res.data?.data || res.data;
};

function AuthBootstrap() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const syncAuth = async () => {
      if (!user) return;

      try {
        const res = await authService.me();
        const currentUser = getResponseData(res);

        if (currentUser) {
          dispatch(setUser(currentUser));
        }
      } catch {
        dispatch(clearUser());

        const privatePrefixes = ["/account", "/cart", "/checkout", "/orders", "/admin"];
        const isPrivatePath = privatePrefixes.some((path) =>
          window.location.pathname.startsWith(path),
        );

        if (isPrivatePath && window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }
    };

    syncAuth();
  }, []);

  return null;
}

function App() {
  return (
    <>
      <Provider store={store}>
        <AuthBootstrap />
        <ToastContainer
          position="top-right"
          autoClose={1500} // GIẢM XUỐNG 1.5 GIÂY (nhanh hơn)
          transition={Slide} // Hiệu ứng trượt ngang hiện đại (thay vì Bounce giật giật)
          hideProgressBar={true} // Ẩn thanh chạy ngang đi cho thanh lịch
          newestOnTop={true} // Thông báo mới nhất trồi lên trên
          closeOnClick
          pauseOnHover
          theme="colored" // Dùng theme có màu nền đậm (success: xanh, error: đỏ)
          toastClassName="rounded-xl shadow-xl font-medium text-sm border-0" // Bo góc giống giao diện RunVault
          bodyClassName="p-2"
        />
        <RouterProvider router={router} />
      </Provider>
    </>
  );
}

export default App;
