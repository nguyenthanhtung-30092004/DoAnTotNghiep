import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/Layout/Layout";

import ForgotPassword from "../pages/ForgotPassword";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import ResetPassword from "../pages/ResetPassword";
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
import AdminBrands from "../admin/pages/AdminBrands";
import AdminOrders from "../admin/pages/AdminOrders";
import AdminOrderDetail from "../admin/pages/AdminOrderDetail";
import AdminUsers from "../admin/pages/AdminUsers";
import AdminCoupons from "../admin/pages/AdminCoupons";
import AdminReviews from "../admin/pages/AdminReviews";
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
