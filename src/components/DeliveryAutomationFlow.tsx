
import React from 'react';
import { ArrowRight, Package, Truck, Check, X, Clock } from 'lucide-react';

interface DeliveryAutomationFlowProps {
  className?: string;
}

const DeliveryAutomationFlow: React.FC<DeliveryAutomationFlowProps> = ({ className }) => {
  return (
    <div className={`p-4 bg-white rounded-lg shadow-sm ${className || ''}`}>
      <h3 className="text-lg font-medium mb-4">Order Automation Flow</h3>
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
        <div className="flex-1 flex flex-col items-center p-3">
          <div className="h-12 w-12 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 mb-2">
            <Package className="h-6 w-6" />
          </div>
          <span className="text-sm font-medium">Order Confirmed</span>
          <span className="text-xs text-gray-500">Pending → Packed</span>
        </div>
        
        <ArrowRight className="hidden sm:block text-gray-300 mx-1" />
        <div className="w-px h-8 bg-gray-200 my-2 sm:hidden"></div>
        
        <div className="flex-1 flex flex-col items-center p-3">
          <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mb-2">
            <Truck className="h-6 w-6" />
          </div>
          <span className="text-sm font-medium">Order Shipped</span>
          <span className="text-xs text-gray-500">Packed → Shipped</span>
        </div>
        
        <ArrowRight className="hidden sm:block text-gray-300 mx-1" />
        <div className="w-px h-8 bg-gray-200 my-2 sm:hidden"></div>
        
        <div className="flex-1 flex flex-col items-center p-3">
          <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-2">
            <Clock className="h-6 w-6" />
          </div>
          <span className="text-sm font-medium">Out for Delivery</span>
          <span className="text-xs text-gray-500">Tracking updates</span>
        </div>
        
        <ArrowRight className="hidden sm:block text-gray-300 mx-1" />
        <div className="w-px h-8 bg-gray-200 my-2 sm:hidden"></div>
        
        <div className="flex-1 flex flex-col items-center p-3">
          <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 mb-2">
            <Check className="h-6 w-6" />
          </div>
          <span className="text-sm font-medium">Delivered</span>
          <span className="text-xs text-gray-500">Order complete</span>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 mr-2">
              <X className="h-4 w-4" />
            </div>
            <div>
              <span className="text-sm font-medium">Cancellation</span>
              <p className="text-xs text-gray-500">Can occur at any stage before delivery</p>
            </div>
          </div>
          
          <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
            Auto-refund triggered
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryAutomationFlow;
