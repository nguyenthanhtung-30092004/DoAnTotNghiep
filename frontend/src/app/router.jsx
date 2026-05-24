import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/common/Layout";

import ForgotPassword from "../features/auth/pages/ForgotPassword";
import Home from "../features/home/pages/Home";
import Login from "../features/auth/pages/Login";
import Signup from "../features/auth/pages/Signup";
import ResetPassword from "../features/auth/pages/ResetPassword";
import Shop from "../features/products/pages/Shop";
import ProductDetail from "../features/products/pages/ProductDetail";
import Cart from "../features/cart/pages/Cart";
import Checkout from "../features/checkout/pages/Checkout";
import Account from "../pages/Account";
import OrderDetail from "../pages/OrderDetail";
import AdminLayout from "../features/admin/AdminLayout";
import AdminDashboard from "../features/admin/pages/AdminDashboard";
import AdminProducts from "../features/admin/pages/AdminProducts";
import AdminCategories from "../features/admin/pages/AdminCategories";
import AdminBrands from "../features/admin/pages/AdminBrands";
import AdminOrders from "../features/admin/pages/AdminOrders";
import AdminOrderDetail from "../features/admin/pages/AdminOrderDetail";
import AdminUsers from "../features/admin/pages/AdminUsers";
import AdminCoupons from "../features/admin/pages/AdminCoupons";
import AdminReviews from "../features/admin/pages/AdminReviews";
import AdminRoute from "./AdminRoute";
import PrivateRoute from "./PrivateRoute";
import PaymentResult from "../pages/PaymentResult";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "shop",
        element: <Shop />,
      },
      {
        path: "shop/:categorySlug",
        element: <Shop />,
      },
      {
        path: "product/:productSlug",
        element: <ProductDetail />,
      },
      {
        path: "cart",
        element: (
          <PrivateRoute>
            <Cart />
          </PrivateRoute>
        ),
      },
      {
        path: "checkout",
        element: (
          <PrivateRoute>
            <Checkout />
          </PrivateRoute>
        ),
      },
      {
        path: "payment-result",
        element: <PaymentResult />,
      },
      {
        path: "account",
        element: (
          <PrivateRoute>
            <Account />
          </PrivateRoute>
        ),
      },
      {
        path: "orders/:orderId",
        element: (
          <PrivateRoute>
            <OrderDetail />
          </PrivateRoute>
        ),
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
    path: "/admin",
    element: (
      <AdminRoute>
        <AdminLayout />
      </AdminRoute>
    ),
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
      {
        path: "brands",
        element: <AdminBrands />,
      },
      {
        path: "orders",
        element: <AdminOrders />,
      },
      {
        path: "orders/:orderId",
        element: <AdminOrderDetail />,
      },
      {
        path: "users",
        element: <AdminUsers />,
      },
      {
        path: "coupons",
        element: <AdminCoupons />,
      },
      {
        path: "reviews",
        element: <AdminReviews />,
      },
    ],
  },
]);

export default router;
