import React, { Suspense, lazy } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { clearToken, getToken, isTokenExpired, getCustomerToken, clearCustomerToken } from '../lib/auth';

// Lazy-loaded page components for performance
const Website = lazy(() => import('../pages/website/Website'));
const ShopPage = lazy(() => import('../pages/website/Pages/Shop/Shop'));
const ProductPage = lazy(() => import('../pages/website/Pages/Product/Product'));
const WishlistPage = lazy(() => import('../pages/website/Pages/Wishlist/Wishlist'));
const CartPage = lazy(() => import('../pages/website/Pages/Cart/Cart'));
const CheckoutPage = lazy(() => import('../pages/website/Pages/Checkout/Checkout'));
const OrderSuccessPage = lazy(() => import('../pages/website/Pages/OrderSuccess/OrderSuccess'));
const OrderCancelledPage = lazy(() => import('../pages/website/Pages/OrderCancelled/OrderCancelled'));
const OrderFailedPage = lazy(() => import('../pages/website/Pages/OrderFailed/OrderFailed'));
const AccountPage = lazy(() => import('../pages/website/Account/index'));

// Admin Auth pages
const AdminLoginPage = lazy(() => import('../pages/admin/Auth/Login/index'));
const AdminForgotPasswordPage = lazy(() => import('../pages/admin/Auth/Forgot-password/index'));
const AdminResetPasswordPage = lazy(() => import('../pages/admin/Auth/Reset-password/index'));

// Admin App pages
const AdminLayout = lazy(() => import('../pages/admin/App/App'));
const AdminDashboard = lazy(() => import('../pages/admin/App/Dashboard/index'));
const AdminProducts = lazy(() => import('../pages/admin/App/Products/index'));
const AdminOrders = lazy(() => import('../pages/admin/App/Orders/index'));
const AdminCustomers = lazy(() => import('../pages/admin/App/Customers/index'));
const AdminCategories = lazy(() => import('../pages/admin/App/Categories/Category/index'));
const AdminSubCategories = lazy(() => import('../pages/admin/App/Categories/Sub-category/index'));
const AdminCollections = lazy(() => import('../pages/admin/App/Collections/index'));

// Customer Auth pages
const LoginPage = lazy(() => import('../pages/website/Auth/Login/index'));
const RegisterPage = lazy(() => import('../pages/website/Auth/Register/index'));
const ForgotPasswordPage = lazy(() => import('../pages/website/Auth/Forgot-password/index'));
const OtpVerificationPage = lazy(() => import('../pages/website/Auth/Otp-verification/index'));
const ResetPasswordPage = lazy(() => import('../pages/website/Auth/Reset-password/index'));

function RequireAdmin({ children }) {
  const token = getToken();
  if (!token || isTokenExpired(token)) {
    clearToken();
    return <Navigate to="/admin" replace />;
  }
  return children;
}

function RequireCustomer({ children }) {
  const location = useLocation();
  const token = getCustomerToken();
  if (!token || isTokenExpired(token)) {
    clearCustomerToken();
    return <Navigate to="/login" state={{ from: location.pathname + location.search }} replace />;
  }
  return children;
}

function PageLoader() {
  return (
    <div className="page-loader">
      <div className="page-loader-spinner" />
    </div>
  );
}

export default function AppRouter() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Website />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route
          path="/checkout"
          element={
            <RequireCustomer>
              <CheckoutPage />
            </RequireCustomer>
          }
        />
<Route path="/order-success" element={<OrderSuccessPage />} />
        <Route path="/order-cancelled" element={<OrderCancelledPage />} />
        <Route path="/order-failed" element={<OrderFailedPage />} />
        <Route
          path="/account"
          element={
            <RequireCustomer>
              <AccountPage />
            </RequireCustomer>
          }
        />

        {/* Customer Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/verify-otp" element={<OtpVerificationPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* Admin Auth Routes */}
        <Route
          path="/admin"
          element={getToken() ? <Navigate to="/admin/dashboard" replace /> : <AdminLoginPage />}
        />
        <Route path="/admin/forgot-password" element={<AdminForgotPasswordPage />} />
        <Route path="/admin/reset-password" element={<AdminResetPasswordPage />} />

        {/* Admin App Routes (Protected) */}
        <Route
          path="/admin/dashboard"
          element={
            <RequireAdmin>
              <AdminLayout pageTitle="Dashboard">
                <AdminDashboard />
              </AdminLayout>
            </RequireAdmin>
          }
        />
        <Route
          path="/admin/products"
          element={
            <RequireAdmin>
              <AdminLayout pageTitle="Products">
                <AdminProducts />
              </AdminLayout>
            </RequireAdmin>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <RequireAdmin>
              <AdminLayout pageTitle="Orders">
                <AdminOrders />
              </AdminLayout>
            </RequireAdmin>
          }
        />
        <Route
          path="/admin/customers"
          element={
            <RequireAdmin>
              <AdminLayout pageTitle="Customers">
                <AdminCustomers />
              </AdminLayout>
            </RequireAdmin>
          }
        />
        <Route
          path="/admin/Category"
          element={
            <RequireAdmin>
              <AdminLayout pageTitle="Category">
                <AdminCategories />
              </AdminLayout>
            </RequireAdmin>
          }
        />
        <Route
          path="/admin/sub-Category"
          element={
            <RequireAdmin>
              <AdminLayout pageTitle="Sub Category">
                <AdminSubCategories />
              </AdminLayout>
            </RequireAdmin>
          }
        />
        <Route
          path="/admin/collections"
          element={
            <RequireAdmin>
              <AdminLayout pageTitle="Collections">
                <AdminCollections />
              </AdminLayout>
            </RequireAdmin>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

