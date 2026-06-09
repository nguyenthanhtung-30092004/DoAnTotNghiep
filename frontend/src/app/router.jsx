import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/common/Layout";

import ForgotPassword from "../pages/auth/ForgotPassword";
import Home from "../pages/home/Home";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import ResetPassword from "../pages/auth/ResetPassword";
import Shop from "../pages/products/Shop";
import ProductDetail from "../pages/products/ProductDetail";
import Cart from "../pages/cart/Cart";
import Checkout from "../pages/checkout/Checkout";
import Account from "../pages/account/Account";
import OrderDetail from "../pages/orders/OrderDetail";
import About from "../pages/about/About";
import Contact from "../pages/contact/Contact";
import AdminLayout from "../components/admin/layout/AdminLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminProducts from "../pages/admin/AdminProducts";
import AdminCategories from "../pages/admin/AdminCategories";
import AdminBrands from "../pages/admin/AdminBrands";
import AdminOrders from "../pages/admin/AdminOrders";
import AdminOrderDetail from "../pages/admin/AdminOrderDetail";
import AdminUsers from "../pages/admin/AdminUsers";
import AdminCustomers from "../pages/admin/AdminCustomers";
import AdminCoupons from "../pages/admin/AdminCoupons";
import AdminReviews from "../pages/admin/AdminReviews";
import AdminRoute from "./routes/AdminRoute";
import PrivateRoute from "./routes/PrivateRoute";
import PaymentResult from "../pages/payment/PaymentResult";
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
        path: "about",
        element: <About />,
      },
      {
        path: "contact",
        element: <Contact />,
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
        element: <Cart />,
      },
      {
        path: "checkout",
        element: <Checkout />,
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
        path: "customers",
        element: <AdminCustomers />,
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
