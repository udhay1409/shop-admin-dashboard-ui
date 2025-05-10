import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./components/AdminLayout";
import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import Products from "./pages/Products";
import Categories from "./pages/Categories";
import Reports from "./pages/Reports";
import Delivery from "./pages/Delivery";
import Customers from "./pages/Customers";
import Vendors from "./pages/Vendors";
import Inventory from "./pages/Inventory";
import CouponCodes from "./pages/CouponCodes";
import Reviews from "./pages/Reviews";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import NotFound from "./pages/NotFound";
import Settings from "./pages/Settings";
import TransactionLogs from "./pages/TransactionLogs";
import POS from "./pages/POS";
import StoreFront from "./pages/StoreFront";
import Subcategories from "./pages/Subcategories";
import HomePage from "./pages/HomePage";

const queryClient = new QueryClient();

// Simple authentication state (in a real app, use proper auth management)
const isAuthenticated = () => {
  // Replace with actual auth logic
  return true; // Set to false to test authentication flow
};

// Check if the user is an admin (in a real app, check roles)
const isAdmin = () => {
  // Replace with actual role check
  return true;
};

// Protected route component
const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Admin route component
const AdminRoute = ({ children }) => {
  if (!isAuthenticated() || !isAdmin()) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          {/* Store Frontend */}
          <Route path="/store" element={<StoreFront />}>
            <Route index element={<HomePage />} />
          </Route>
          <Route path="/store/categories/:categorySlug" element={<StoreFront />} />
          <Route path="/store/categories/:categorySlug/:subcategorySlug" element={<StoreFront />} />
          <Route path="/store/product/:productId" element={<StoreFront />} />
          <Route path="/store/cart" element={<StoreFront />} />
          <Route path="/store/checkout" element={<StoreFront />} />
          <Route path="/store/order-confirmation" element={<StoreFront />} />

          {/* Authentication routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Protected admin routes */}
          <Route path="/" element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="orders" element={<Orders />} />
            <Route path="products" element={<Products />} />
            <Route path="categories" element={<Categories />} />
            <Route path="subcategories" element={<Subcategories />} />
            <Route path="reports" element={<Reports />} />
            <Route path="delivery" element={<Delivery />} />
            <Route path="customers" element={<Customers />} />
            <Route path="vendors" element={<Vendors />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="coupon-code" element={<CouponCodes />} />
            <Route path="reviews" element={<Reviews />} />
            <Route path="settings" element={<Settings />} />
            <Route path="transaction-logs" element={<TransactionLogs />} />
            <Route path="pos" element={<POS />} />
            <Route path="contact" element={<NotFound />} /> {/* Placeholder for Contact */}
            {/* Other routes will be added as they're needed */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </TooltipProvider>
    </Router>
  );
}

export default App;
