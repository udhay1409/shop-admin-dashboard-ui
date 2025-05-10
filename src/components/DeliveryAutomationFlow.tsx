
import React, { useState } from 'react';
import { ArrowRight, Package, Truck, Check, X, Clock, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

interface DeliveryAutomationFlowProps {
  className?: string;
}

const DeliveryAutomationFlow: React.FC<DeliveryAutomationFlowProps> = ({ className }) => {
  const [isSimulating, setIsSimulating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isCancelled, setIsCancelled] = useState(false);

  const steps = [
    { name: "Order Confirmed", icon: Package, bgColor: "bg-pink-100", textColor: "text-pink-600" },
    { name: "Order Shipped", icon: Truck, bgColor: "bg-amber-100", textColor: "text-amber-600" },
    { name: "Out for Delivery", icon: Clock, bgColor: "bg-blue-100", textColor: "text-blue-600" },
    { name: "Delivered", icon: Check, bgColor: "bg-green-100", textColor: "text-green-600" }
  ];

  const simulateOrderProcess = () => {
    setIsSimulating(true);
    setCurrentStep(0);
    setIsCancelled(false);
    
    // Simulate each step with a delay
    let step = 0;
    const interval = setInterval(() => {
      if (step < steps.length - 1) {
        step++;
        setCurrentStep(step);
      } else {
        clearInterval(interval);
        setIsSimulating(false);
        
        toast({
          title: "Order Delivered",
          description: "Order has been successfully delivered",
        });
      }
    }, 2000);
    
    // Return cleanup function
    return () => clearInterval(interval);
  };
  
  const cancelOrder = () => {
    setIsCancelled(true);
    setIsSimulating(false);
    
    toast({
      title: "Order Cancelled",
      description: "Auto-refund has been triggered",
    });
  };
  
  const resetFlow = () => {
    setCurrentStep(0);
    setIsCancelled(false);
    setIsSimulating(false);
  };

  return (
    <div className={`p-4 bg-white rounded-lg shadow-sm ${className || ''}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Order Automation Flow</h3>
        <div className="flex gap-2">
          {!isSimulating && !isCancelled && (
            <Button 
              variant="default" 
              size="sm" 
              onClick={simulateOrderProcess}
              disabled={isSimulating}
            >
              Simulate
            </Button>
          )}
          {isSimulating && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={cancelOrder}
              className="text-red-500"
            >
              Cancel
            </Button>
          )}
          {(currentStep > 0 || isCancelled) && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={resetFlow}
            >
              Reset
            </Button>
          )}
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step.name}>
            <div className="flex-1 flex flex-col items-center p-3">
              <div className={`h-12 w-12 rounded-full ${currentStep >= index ? step.bgColor : 'bg-gray-100'} 
                flex items-center justify-center ${currentStep >= index ? step.textColor : 'text-gray-400'} mb-2
                ${isCancelled && index > currentStep ? 'opacity-50' : ''}
                transition-all duration-300`}
              >
                {isCancelled && index === currentStep ? (
                  <X className="h-6 w-6" />
                ) : (
                  <step.icon className="h-6 w-6" />
                )}
              </div>
              <span className={`text-sm font-medium ${currentStep >= index ? 'text-gray-800' : 'text-gray-400'}
                ${isCancelled && index > currentStep ? 'opacity-50' : ''}`}>
                {step.name}
              </span>
              <span className="text-xs text-gray-500">
                {index === 0 ? 'Pending → Packed' : 
                 index === 1 ? 'Packed → Shipped' : 
                 index === 2 ? 'Tracking updates' : 'Order complete'}
              </span>
            </div>
            
            {index < steps.length - 1 && (
              <>
                <ArrowRight className={`hidden sm:block ${currentStep > index ? 'text-[#EC008C]' : 'text-gray-300'} mx-1
                  ${isCancelled && index >= currentStep ? 'opacity-50' : ''}`} />
                <div className={`w-px h-8 bg-gray-200 my-2 sm:hidden
                  ${isCancelled && index >= currentStep ? 'opacity-50' : ''}`}></div>
              </>
            )}
          </React.Fragment>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className={`h-8 w-8 rounded-full ${isCancelled ? 'bg-red-100' : 'bg-gray-100'} 
              flex items-center justify-center ${isCancelled ? 'text-red-600' : 'text-gray-400'} mr-2`}>
              <X className="h-4 w-4" />
            </div>
            <div>
              <span className="text-sm font-medium">Cancellation</span>
              <p className="text-xs text-gray-500">Can occur at any stage before delivery</p>
            </div>
          </div>
          
          <div className={`text-xs ${isCancelled ? 'text-red-500 bg-red-50' : 'text-gray-500 bg-gray-100'} px-2 py-1 rounded`}>
            {isCancelled ? "Refund processed" : "Auto-refund triggered"}
          </div>
        </div>
      </div>
      
      {!isSimulating && !isCancelled && currentStep === 0 && (
        <div className="mt-4 flex items-center p-2 bg-blue-50 text-blue-700 text-sm rounded">
          <Info size={16} className="mr-2" />
          Click "Simulate" to see the order flow in action
        </div>
      )}
    </div>
  );
};

export default DeliveryAutomationFlow;
