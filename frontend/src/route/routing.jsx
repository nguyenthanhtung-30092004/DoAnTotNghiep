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
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import Account from "../pages/Account";
import OrderDetail from "../pages/OrderDetail";
import AdminLayout from "../admin/AdminLayout";
import AdminDashboard from "../admin/pages/AdminDashboard";
import AdminProducts from "../admin/pages/AdminProducts";
import AdminCategories from "../admin/pages/AdminCategories";
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
    path: "/account",
    element: <Account />,
  },
  {
    path: "/order/:orderId", // Link động: Bắt mọi sản phẩm
    element: <OrderDetail />,
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
  {
    path: "/cart",
    element: <Cart />,
  },
  {
    path: "/checkout",
    element: <Checkout />,
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <AdminDashboard />,
      },
      {
        path: "products",
        element: <AdminProducts />,
      },
      {
        path: "categories",
        element: <AdminCategories />,
      },
    ],
  },
]);

export default router;
