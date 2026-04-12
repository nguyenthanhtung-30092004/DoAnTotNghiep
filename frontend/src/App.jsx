import "./App.css";
import { RouterProvider } from "react-router";
import router from "./route/routing";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { ToastContainer, Slide } from "react-toastify";

function App() {
  return (
    <>
      <Provider store={store}>
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
