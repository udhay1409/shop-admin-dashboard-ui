
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
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
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { useEffect } from "react";
import { supabase } from "./integrations/supabase/client";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30000, // 30 seconds
    },
  },
});

// Root route component for conditional redirection
const RootRedirect = () => {
  const { isAuthenticated, isLoading, userRole } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#EC008C]"></div>
    </div>;
  }

  if (isAuthenticated) {
    // If user is admin, redirect to admin dashboard
    if (userRole === 'admin') {
      return <Navigate to="/dashboard" replace />;
    }
    // Otherwise, redirect to store front
    return <Navigate to="/store" replace />;
  }

  // If not authenticated, redirect to login
  return <Navigate to="/login" replace />;
};

// Protected route component
const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, isLoading, userRole } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#EC008C]"></div>
    </div>;
  }

  if (!isAuthenticated) {
    // Save the current location the user was trying to access
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && userRole !== requiredRole) {
    // If role is specified but user doesn't have it
    if (userRole === 'admin') {
      return <Navigate to="/dashboard" replace />;
    }
    return <Navigate to="/store" replace />;
  }

  return children;
};

// Router wrapper with auth provider
const AppWithAuth = () => {
  return (
    <AuthProvider>
      <Routes>
        {/* Root route with smart redirect */}
        <Route path="/" element={<RootRedirect />} />
        
        {/* Store Frontend */}
        <Route path="/store/*" element={<StoreFront />} />

        {/* Authentication routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Admin routes - require admin role */}
        <Route path="/*" element={
          <ProtectedRoute requiredRole="admin">
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route path="dashboard" element={<Dashboard />} />
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
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
};

function App() {
  // Function to create admin users on app startup
  useEffect(() => {
    const createAdminUsers = async () => {
      try {
        // Create the first admin user (kansha@mntfuture.com)
        const response1 = await fetch('https://uhahxzsenmhdtgmltrjs.supabase.co/functions/v1/create-admin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: 'kansha@mntfuture.com',
            password: '123456'
          })
        }).catch(err => {
          console.log('Network error when creating admin 1:', err);
          return { json: () => ({ success: false, error: err.message }) };
        });
        
        const result1 = await response1.json();
        console.log('Admin 1 creation result:', result1);
        
        // Create the second admin user (mkansha2312@gmail.com)
        const response2 = await fetch('https://uhahxzsenmhdtgmltrjs.supabase.co/functions/v1/create-admin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: 'mkansha2312@gmail.com',
            password: '123456'
          })
        }).catch(err => {
          console.log('Network error when creating admin 2:', err);
          return { json: () => ({ success: false, error: err.message }) };
        });
        
        const result2 = await response2.json();
        console.log('Admin 2 creation result:', result2);
        
      } catch (error) {
        console.error('Error in admin user setup:', error);
      }
    };
    
    // Run admin user setup with a small delay
    setTimeout(createAdminUsers, 1000);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AppWithAuth />
        </TooltipProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
