
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { StoreFrontProvider } from '@/components/store/StoreFrontContext';
import FrontStoreCMS from '@/pages/FrontStoreCMS';
import { Toaster } from '@/components/ui/toaster';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminLayout from '@/components/layouts/AdminLayout';
import Protected from '@/components/auth/Protected';
import Dashboard from '@/pages/Dashboard';
import StoreFront from '@/pages/StoreFront';
import { AuthProvider } from '@/contexts/AuthContext';
import Settings from '@/pages/Settings';

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <StoreFrontProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<div>Home Page</div>} />
              <Route path="/login" element={<div>Login Page</div>} />
              <Route path="/register" element={<div>Register Page</div>} />
              <Route path="/dashboard" element={
                <Protected>
                  <AdminLayout>
                    <Dashboard />
                  </AdminLayout>
                </Protected>
              } />
              <Route path="/products" element={
                <Protected>
                  <AdminLayout>
                    <div>Products Page</div>
                  </AdminLayout>
                </Protected>
              } />
              <Route path="/categories" element={
                <Protected>
                  <AdminLayout>
                    <div>Categories Page</div>
                  </AdminLayout>
                </Protected>
              } />
              <Route path="/orders" element={
                <Protected>
                  <AdminLayout>
                    <div>Orders Page</div>
                  </AdminLayout>
                </Protected>
              } />
              <Route path="/settings" element={
                <Protected>
                  <AdminLayout>
                    <Settings />
                  </AdminLayout>
                </Protected>
              } />
              <Route path="/front-store-cms" element={
                <Protected>
                  <AdminLayout>
                    <FrontStoreCMS />
                  </AdminLayout>
                </Protected>
              } />
              <Route path="/store/*" element={<StoreFront />} />
            </Routes>
          </BrowserRouter>
          <Toaster />
        </StoreFrontProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
