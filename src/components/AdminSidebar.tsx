
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  FolderKanban, 
  Users, 
  Store, 
  Tag, 
  Star, 
  Receipt, 
  BarChart2, 
  PocketKnife, 
  Settings,
  CreditCard,
  Truck
} from 'lucide-react';
import { cn } from '@/lib/utils';

const SidebarLogo = () => (
  <div className="flex items-center justify-center p-4">
    <div className="w-14 h-14 rounded-full border-2 border-pink-200 overflow-hidden flex items-center justify-center">
      <span className="text-ecommerce-primary font-script text-xl">Fashiona</span>
    </div>
  </div>
);

interface SidebarItemProps {
  to: string;
  icon: React.ElementType;
  text: string;
  badge?: number;
}

const SidebarItem = ({ to, icon: Icon, text, badge }: SidebarItemProps) => {
  return (
    <li>
      <NavLink 
        to={to} 
        className={({ isActive }) => 
          cn("sidebar-item", isActive && "active")
        }
      >
        <Icon size={20} />
        <span className="flex-1">{text}</span>
        {badge && (
          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            {badge}
          </span>
        )}
      </NavLink>
    </li>
  );
};

const AdminSidebar = () => {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
      <SidebarLogo />
      
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          <SidebarItem to="/" icon={LayoutDashboard} text="Dashboard" />
          <SidebarItem to="/orders" icon={ShoppingCart} text="Orders" badge={10} />
          <SidebarItem to="/products" icon={Package} text="Products" />
          <SidebarItem to="/categories" icon={FolderKanban} text="Categories" />
          <SidebarItem to="/delivery" icon={Truck} text="Delivery" badge={5} />
          <SidebarItem to="/contact" icon={Users} text="Contact" />
        </ul>
        
        <div className="mt-4 border-t border-gray-200 pt-4">
          <ul className="space-y-1">
            <SidebarItem to="/customers" icon={Users} text="Customers" />
            <SidebarItem to="/vendors" icon={Store} text="Vendors" />
            <SidebarItem to="/coupon-code" icon={Tag} text="Coupon code" />
            <SidebarItem to="/reviews" icon={Star} text="Reviews Management" />
            <SidebarItem to="/transaction-logs" icon={Receipt} text="Transaction Logs" />
            <SidebarItem to="/reports" icon={BarChart2} text="Reports" />
            <SidebarItem to="/pos" icon={PocketKnife} text="Pos" />
            <SidebarItem to="/payments" icon={CreditCard} text="Payments" />
            <SidebarItem to="/settings" icon={Settings} text="Settings" />
          </ul>
        </div>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
