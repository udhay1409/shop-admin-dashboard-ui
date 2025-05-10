
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Folder, 
  Users, 
  Store, 
  Tag, 
  Star, 
  Receipt, 
  BarChart2, 
  Settings,
  CreditCard,
  Truck,
  User,
  ChevronDown,
  ChevronRight,
  Warehouse,
  Boxes,
  TicketPercent
} from 'lucide-react';
import { cn } from '@/lib/utils';

const SidebarLogo = () => (
  <div className="flex items-center justify-center p-4 border-b border-gray-100">
    <div className="w-14 h-14 rounded-full border-2 border-pink-200 overflow-hidden flex items-center justify-center bg-gradient-to-br from-[#EC008C] to-pink-400">
      <span className="text-white font-script text-xl">Fashiona</span>
    </div>
  </div>
);

interface SidebarItemProps {
  to: string;
  icon: React.ElementType;
  text: string;
  badge?: number;
  subItems?: {
    to: string;
    text: string;
    icon?: React.ElementType;
  }[];
}

const SidebarItem = ({ to, icon: Icon, text, badge, subItems }: SidebarItemProps) => {
  const [expanded, setExpanded] = useState(false);
  
  if (subItems && subItems.length > 0) {
    return (
      <li className="space-y-1">
        <button 
          onClick={() => setExpanded(!expanded)} 
          className="sidebar-item flex w-full items-center gap-3"
        >
          <Icon size={18} className="text-gray-500" />
          <span className="flex-1">{text}</span>
          {badge && (
            <span className="bg-[#EC008C] text-white text-xs px-2 py-0.5 rounded-full">
              {badge}
            </span>
          )}
          {expanded ? <ChevronDown size={16} className="text-gray-400" /> : <ChevronRight size={16} className="text-gray-400" />}
        </button>
        
        {expanded && (
          <ul className="pl-8 space-y-1 mt-1">
            {subItems.map(item => (
              <li key={item.to}>
                <NavLink 
                  to={item.to} 
                  className={({ isActive }) => 
                    cn("sidebar-subitem", isActive && "active")
                  }
                >
                  {item.icon && <item.icon size={16} className="mr-2" />}
                  <span className="flex-1 text-sm">{item.text}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        )}
      </li>
    );
  }
  
  return (
    <li>
      <NavLink 
        to={to} 
        className={({ isActive }) => 
          cn("sidebar-item gap-3", isActive && "active")
        }
      >
        <Icon size={18} className="text-gray-500" />
        <span className="flex-1">{text}</span>
        {badge && (
          <span className="bg-[#EC008C] text-white text-xs px-2 py-0.5 rounded-full">
            {badge}
          </span>
        )}
      </NavLink>
    </li>
  );
};

const AdminSidebar = () => {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col shadow-sm">
      <SidebarLogo />
      
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          <SidebarItem to="/" icon={LayoutDashboard} text="Dashboard" />
          <SidebarItem to="/orders" icon={ShoppingCart} text="Orders" badge={10} />
          <SidebarItem to="/products" icon={Package} text="Products" />
          <SidebarItem to="/categories" icon={Folder} text="Categories" />
          <SidebarItem to="/delivery" icon={Truck} text="Delivery" badge={5} />
          <SidebarItem to="/inventory" icon={Boxes} text="Inventory" />
          <SidebarItem to="/vendors" icon={Store} text="Vendors" />
          <SidebarItem 
            to="/contact" 
            icon={Users} 
            text="Contact" 
            subItems={[
              { to: "/customers", text: "Customers", icon: User },
              { to: "/vendors", text: "Vendors", icon: Store }
            ]}
          />
        </ul>
        
        <div className="mt-4 border-t border-gray-200 pt-4">
          <ul className="space-y-1">
            <SidebarItem to="/coupon-code" icon={TicketPercent} text="Coupon code" />
            <SidebarItem to="/reviews" icon={Star} text="Reviews" />
            <SidebarItem to="/transaction-logs" icon={Receipt} text="Transactions" />
            <SidebarItem to="/reports" icon={BarChart2} text="Reports" />
            <SidebarItem to="/payments" icon={CreditCard} text="Payments" />
            <SidebarItem to="/settings" icon={Settings} text="Settings" />
          </ul>
        </div>
      </nav>
      
      <div className="p-3 border-t border-gray-200">
        <div className="bg-pink-50 rounded-lg p-3 text-sm">
          <p className="font-medium text-[#EC008C]">Need help?</p>
          <p className="text-gray-600 text-xs mt-1">Check our documentation or contact support</p>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
