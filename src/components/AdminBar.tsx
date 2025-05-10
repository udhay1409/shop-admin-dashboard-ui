
import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, Settings, Package, ShoppingCart, Users } from 'lucide-react';
import { Button } from './ui/button';

interface AdminBarProps {
  isAdmin: boolean;
}

const AdminBar: React.FC<AdminBarProps> = ({ isAdmin }) => {
  if (!isAdmin) return null;
  
  return (
    <div className="bg-gray-900 text-white py-2 px-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <span className="font-medium mr-4">Admin Mode</span>
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="flex items-center text-sm hover:text-pink-300">
              <LayoutDashboard size={14} className="mr-1" />
              Dashboard
            </Link>
            <Link to="/products" className="flex items-center text-sm hover:text-pink-300">
              <Package size={14} className="mr-1" />
              Products
            </Link>
            <Link to="/orders" className="flex items-center text-sm hover:text-pink-300">
              <ShoppingCart size={14} className="mr-1" />
              Orders
            </Link>
            <Link to="/customers" className="flex items-center text-sm hover:text-pink-300">
              <Users size={14} className="mr-1" />
              Customers
            </Link>
          </div>
        </div>
        <Button variant="outline" size="sm" className="bg-transparent border-white hover:bg-white hover:text-gray-900">
          <Link to="/settings" className="flex items-center gap-1">
            <Settings size={14} />
            <span>Settings</span>
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default AdminBar;
