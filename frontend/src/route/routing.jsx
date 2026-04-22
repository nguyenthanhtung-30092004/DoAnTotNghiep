import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/Layout/Layout";

import ForgotPassword from "../pages/ForgotPassword";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import ResetPassword from "../pages/ResetPassword";
import Products from "../pages/Shop";
import Shop from "../pages/Shop";
import ProductDetail from "../pages/ProductDetail";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "",
        element: <Home />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
  {
    path: "/shop",
    element: <Shop />,
  },
  {
    path: "/shop/:categorySlug", // Link động: Bắt mọi danh mục con
    element: <Shop />,
  },
  {
    path: "/product/:productId", // Link động: Bắt mọi sản phẩm
    element: <ProductDetail />,
  },
]);

export default router;
