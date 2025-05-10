
import React, { useEffect, useState } from 'react';
import { Outlet, useLocation, Link, useNavigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import { Button } from './ui/button';
import { Store, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

const AdminLayout: React.FC = () => {
  const location = useLocation();
  const [pageTitle, setPageTitle] = useState('Dashboard');
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Update the page title based on the current route
    const path = location.pathname.split('/').pop() || '';
    if (path === 'dashboard' || path === '') {
      setPageTitle('Dashboard');
    } else {
      setPageTitle(path.charAt(0).toUpperCase() + path.slice(1));
    }
  }, [location]);

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of the admin dashboard",
      });
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Logout failed",
        description: "An error occurred while logging out",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <div className="pb-5 mb-2">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <h2 className="text-2xl font-semibold text-gray-800">
                {pageTitle}
              </h2>
              <div className="mt-3 md:mt-0 flex items-center space-x-3">
                <Link to="/store" className="flex items-center">
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Store size={16} />
                    View Store
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-red-500 hover:bg-red-50 hover:border-red-200"
                >
                  <LogOut size={16} />
                  Logout
                </Button>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="Search..."
                  />
                </div>
              </div>
            </div>
          </div>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
