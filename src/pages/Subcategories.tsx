
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Subcategories: React.FC = () => {
  const navigate = useNavigate();
  
  // Automatically redirect to the Categories page with subcategories tab active
  useEffect(() => {
    navigate('/categories', { state: { activeTab: 'subcategories' } });
  }, [navigate]);
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Redirecting...</h1>
        <p className="text-gray-500">
          This page has been integrated into the Categories management page.
        </p>
      </div>
      <Button onClick={() => navigate('/categories', { state: { activeTab: 'subcategories' } })}>
        Go to Categories Management
      </Button>
    </div>
  );
};

export default Subcategories;
