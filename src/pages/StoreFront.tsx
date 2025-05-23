import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Menu,
  X,
  ChevronRight,
  Phone,
  Mail,
  MapPin,
  Search,
  ShoppingCart,
  User,
  Heart,
  LogOut,
} from 'lucide-react';
import AdminBar from '@/components/AdminBar';
import { Link, Routes, Route, useLocation, Navigate, useNavigate } from 'react-router-dom';
import HomePage from './HomePage';
import CategoryPage from './store/CategoryPage';
import SubcategoryPage from './store/SubcategoryPage';
import ProductDetailPage from './store/ProductDetailPage';
import CartPage from './store/CartPage';
import CheckoutPage from './store/CheckoutPage';
import OrderConfirmationPage from './store/OrderConfirmationPage';
import AccountDashboard from './store/AccountDashboard';
import WishlistPage from './store/WishlistPage';
import NotFound from './NotFound';
import DynamicNavigation from '@/components/store/DynamicNavigation';
import { useAuth } from '@/contexts/AuthContext';

// Protected route component for store account section only
const AccountProtectedRoute = ({ children }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  
  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#EC008C]"></div>
    </div>;
  }
  
  if (!user) {
    // Redirect to the login page with the current location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return children;
};

const StoreFront: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, userRole, isLoading } = useAuth();
  
  // Helper to get user display name
  const getUserDisplayName = () => {
    if (!user) return "";
    // Use metadata if available, fall back to email
    const metadata = user.user_metadata as Record<string, any>;
    return metadata?.full_name || metadata?.first_name || user.email?.split('@')[0] || "User";
  };
  
  // Only redirect admin users when they access the root /store path and not subpaths
  useEffect(() => {
    // Fix: Only redirect if user has loaded, is admin, and path is exactly /store
    if (!isLoading && user && userRole === 'admin' && location.pathname === '/store') {
      // Fix: Use navigate instead of directly changing location
      navigate('/dashboard', { replace: true });
    }
  }, [user, userRole, location.pathname, isLoading, navigate]);
  
  // Simple admin check
  const isAdmin = userRole === 'admin';
  
  // Fix: Function to handle logout properly
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Admin Bar */}
      <AdminBar isAdmin={isAdmin} />
      
      {/* Top notification bar */}
      <div className="bg-[#EC008C] text-white py-2 px-4 text-center text-sm flex justify-between">
        <div className="hidden md:flex space-x-4">
          <span className="flex items-center">
            <Phone className="h-3 w-3 mr-1" /> (223) 555-0118
          </span>
          <span className="flex items-center">
            <Mail className="h-3 w-3 mr-1" /> michelle.rivera@example.com
          </span>
        </div>
        <div className="flex-1 md:flex-none text-center">
          Free shipping on orders over $50
        </div>
        <div className="hidden md:flex space-x-4">
          <span>Follow Us:</span>
          <div className="flex space-x-2">
            <a href="#" className="hover:text-gray-200">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-2-9h4v-2h-4v2z" clipRule="evenodd" /></svg>
            </a>
            <a href="#" className="hover:text-gray-200">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-2-9h4v-2h-4v2z" clipRule="evenodd" /></svg>
            </a>
            <a href="#" className="hover:text-gray-200">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-2-9h4v-2h-4v2z" clipRule="evenodd" /></svg>
            </a>
          </div>
        </div>
      </div>
      
      {/* Header */}
      <header className="sticky top-0 bg-white border-b z-30 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="h-16 flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="icon"
                className="md:hidden mr-2"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu className="h-6 w-6" />
              </Button>
              <Link to="/store">
                <h1 className="text-2xl font-script font-bold text-[#EC008C]">Fashiona</h1>
              </Link>
            </div>
            
            {/* Desktop Navigation - Using Dynamic Categories */}
            <nav className="hidden md:flex items-center space-x-8">
              <DynamicNavigation />
            </nav>
            
            {/* Icons */}
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Search..." 
                  className="pl-9 w-[200px] h-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Link to="/store/wishlist">
                <Button variant="ghost" size="icon" className="relative">
                  <Heart className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 bg-[#EC008C] text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">
                    0
                  </span>
                </Button>
              </Link>
              
              <Link to="/store/cart">
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 bg-[#EC008C] text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">
                    0
                  </span>
                </Button>
              </Link>
              
              {user ? (
                <div className="flex items-center space-x-2">
                  <Link to="/store/account">
                    <Button variant="ghost" size="sm" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span className="hidden md:inline">{getUserDisplayName()}</span>
                    </Button>
                  </Link>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={handleLogout} 
                    className="text-red-500"
                    title="Logout"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Link to="/login">
                  <Button
                    className="ml-2 bg-[#EC008C] hover:bg-[#D1007D]"
                    size="sm"
                  >
                    Login
                  </Button>
                </Link>
              )}
              
              {isAdmin && (
                <Link to="/dashboard">
                  <Button variant="outline" size="sm" className="ml-2 border-[#EC008C] text-[#EC008C]" title="Admin Dashboard">
                    Admin
                  </Button>
                </Link>
              )}
            </div>
          </div>
          
          {/* Mobile Search */}
          <div className="md:hidden pb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search..." 
                className="pl-9 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </header>
      
      {/* Mobile Menu - Dynamic Categories */}
      <div className={`fixed inset-0 bg-white z-40 transition-transform ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex justify-between items-center h-16 px-4 border-b">
          <h1 className="text-xl font-script font-bold text-[#EC008C]">Fashiona</h1>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setMobileMenuOpen(false)}
          >
            <X className="h-6 w-6" />
          </Button>
        </div>
        
        <div className="p-4">
          <nav className="space-y-4">
            <Link 
              to="/store"
              className="flex items-center justify-between py-2 border-b"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span>Home</span>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </Link>
            
            {/* These categories would be dynamically generated in a real app */}
            <Link 
              to="/store/categories/kurthi"
              className="flex items-center justify-between py-2 border-b"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span>Kurthi</span>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </Link>
            
            <Link 
              to="/store/categories/salwar-suits"
              className="flex items-center justify-between py-2 border-b"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span>Salwar Suits</span>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </Link>
            
            <Link 
              to="/store/categories/lehenga-cholis"
              className="flex items-center justify-between py-2 border-b"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span>Lehenga Cholis</span>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </Link>
            
            <Link 
              to="/store/categories/dupattas"
              className="flex items-center justify-between py-2 border-b"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span>Dupattas</span>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </Link>
          </nav>
          
          <div className="mt-8 space-y-4">
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link to="/store/account" onClick={() => setMobileMenuOpen(false)}>
                <User className="h-4 w-4 mr-2" />
                My Account
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link to="/store/wishlist" onClick={() => setMobileMenuOpen(false)}>
                <Heart className="h-4 w-4 mr-2" />
                Wishlist
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link to="/store/cart" onClick={() => setMobileMenuOpen(false)}>
                <ShoppingCart className="h-4 w-4 mr-2" />
                Cart
              </Link>
            </Button>
            
            {user ? (
              <Button 
                variant="outline" 
                className="w-full justify-start text-red-500 border-red-200" 
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            ) : (
              <Button 
                className="w-full bg-[#EC008C] hover:bg-[#D1007D]"
                asChild
              >
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  Login
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
      
      {/* Main Content - Routes */}
      <main className="flex-grow">
        <Routes>
          <Route index element={<HomePage />} />
          <Route path="categories/:categorySlug" element={<CategoryPage />} />
          <Route path="categories/:categorySlug/:subcategorySlug" element={<SubcategoryPage />} />
          <Route path="product/:productId" element={<ProductDetailPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="order-confirmation" element={<OrderConfirmationPage />} />
          <Route path="wishlist" element={<WishlistPage />} />
          
          {/* Account routes - protected */}
          <Route path="account/*" element={
            <AccountProtectedRoute>
              <AccountDashboard />
            </AccountProtectedRoute>
          } />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4 font-script">Fashiona</h3>
              <p className="text-gray-400 mb-4">
                We believe style is personal, not timeless.<br />
                Every design you see is a reflection of love for craftsmanship, detail, and individuality.
              </p>
              <p className="text-gray-400">
                Thank you for walking this journey with us - one stylish step at a time.
              </p>
              
              {isAdmin && (
                <Link to="/" className="mt-4 inline-block">
                  <Button variant="outline" size="sm" className="bg-transparent border-white hover:bg-white hover:text-gray-900 mt-4">
                    Admin Dashboard
                  </Button>
                </Link>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-bold mb-4">Useful links</h3>
                <ul className="space-y-2 text-gray-400">
                  <li><Link to="/store" className="hover:text-white transition-colors flex items-center"><ChevronRight className="h-3 w-3 mr-1" /> Home</Link></li>
                  <li><Link to="/store/about" className="hover:text-white transition-colors flex items-center"><ChevronRight className="h-3 w-3 mr-1" /> About us</Link></li>
                  <li><Link to="/store/categories/all" className="hover:text-white transition-colors flex items-center"><ChevronRight className="h-3 w-3 mr-1" /> Catalog</Link></li>
                  <li><Link to="/store/contact" className="hover:text-white transition-colors flex items-center"><ChevronRight className="h-3 w-3 mr-1" /> Contact</Link></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-bold mb-4">Terms And Policy's</h3>
                <ul className="space-y-2 text-gray-400">
                  <li><Link to="/store/policies/shipping" className="hover:text-white transition-colors flex items-center"><ChevronRight className="h-3 w-3 mr-1" /> Shipping policy</Link></li>
                  <li><Link to="/store/policies/refund" className="hover:text-white transition-colors flex items-center"><ChevronRight className="h-3 w-3 mr-1" /> Refund Policy</Link></li>
                  <li><Link to="/store/policies/terms" className="hover:text-white transition-colors flex items-center"><ChevronRight className="h-3 w-3 mr-1" /> Terms of Service</Link></li>
                </ul>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">Contact Info</h3>
              <ul className="space-y-4 text-gray-400">
                <li className="flex items-start">
                  <Phone className="h-5 w-5 mr-3 text-[#EC008C] flex-shrink-0" />
                  <span>TEL: +91 93844 09680</span>
                </li>
                <li className="flex items-start">
                  <Mail className="h-5 w-5 mr-3 text-[#EC008C] flex-shrink-0" />
                  <span>EMAIL: contact@fashiona.com</span>
                </li>
                <li className="flex items-start">
                  <MapPin className="h-5 w-5 mr-3 text-[#EC008C] flex-shrink-0" />
                  <span>LOCATION: Pondicherry</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>
              &copy; 2025 Fashiona. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default StoreFront;
