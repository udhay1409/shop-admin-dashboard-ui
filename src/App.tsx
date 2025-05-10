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

const queryClient = new QueryClient();

// Root route component for conditional redirection
const RootRedirect = () => {
  const { isAuthenticated, isLoading, userRole } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
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
  const { user, isAuthenticated, isLoading, userRole } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated) {
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
  // Function to create admin user on app startup if it doesn't exist
  useEffect(() => {
    const createAdminUser = async () => {
      try {
        // Check if admin user exists by trying to sign in
        const { data, error } = await supabase.auth.signInWithPassword({
          email: 'kansha@mntfuture.com',
          password: '123456'
        });
        
        if (error && error.message.includes('Invalid login credentials')) {
          // If login failed, create the admin user
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email: 'kansha@mntfuture.com',
            password: '123456',
            options: {
              data: {
                first_name: 'Admin',
                last_name: 'User'
              }
            }
          });
          
          if (signUpError) {
            console.error('Error creating admin user:', signUpError);
          } else {
            console.log('Admin user created successfully');
            
            // Add admin role
            const { error: roleError } = await supabase
              .from('user_roles')
              .insert({
                user_id: signUpData.user.id,
                role: 'admin'
              });
              
            if (roleError) {
              console.error('Error setting admin role:', roleError);
            }
          }
        }
        
        // Sign out after checking/creating admin
        await supabase.auth.signOut();
      } catch (error) {
        console.error('Error in admin user setup:', error);
      }
    };
    
    createAdminUser();
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
