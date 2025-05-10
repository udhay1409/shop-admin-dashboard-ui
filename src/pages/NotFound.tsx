
import React from "react";
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  const isStorePath = location.pathname.startsWith('/store');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-4">Oops! Page not found</p>
        {isStorePath ? (
          <Button asChild className="bg-[#EC008C] hover:bg-[#D1007D]">
            <Link to="/store">Return to Store</Link>
          </Button>
        ) : (
          <Button asChild>
            <Link to="/">Return to Dashboard</Link>
          </Button>
        )}
      </div>
    </div>
  );
};

export default NotFound;
