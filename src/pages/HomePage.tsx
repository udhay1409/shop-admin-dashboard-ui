
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useStoreFrontProducts } from '@/hooks/useStoreFrontProducts';
import ProductGrid from '@/components/store/ProductGrid';

const HomePage = () => {
  const { 
    featuredProducts, 
    newArrivals, 
    trendingProducts, 
    hotSellingProducts,
    saleProducts,
    loading,
    refreshProducts 
  } = useStoreFrontProducts();

  // Reload products when component mounts
  useEffect(() => {
    console.log('HomePage mounted, refreshing products');
    refreshProducts();
  }, [refreshProducts]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Discover Your Perfect Style
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-md">
                Explore our new collection of trendy fashion items that will elevate your style to new heights.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/store/categories/all">
                  <button className="bg-[#EC008C] hover:bg-[#D1007D] text-white px-8 py-3 rounded-md font-medium transition-colors">
                    Shop Now
                  </button>
                </Link>
                <Link to="/store/categories/new-arrivals">
                  <button className="bg-white border border-[#EC008C] text-[#EC008C] hover:bg-pink-50 px-8 py-3 rounded-md font-medium transition-colors">
                    New Arrivals
                  </button>
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center md:justify-end">
              <img 
                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                alt="Fashion Collection" 
                className="rounded-lg shadow-lg w-full max-w-md object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <div className="container mx-auto px-4 py-12">
        <ProductGrid 
          products={featuredProducts} 
          title="Featured Products" 
          loading={loading}
        />
      </div>
      
      {/* Categories Banner - Get real categories from database */}
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-medium text-gray-800 mb-8">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Kurthi', 'Salwar Suits', 'Lehenga Cholis', 'Dupattas'].map((category, i) => (
              <Link 
                key={i} 
                to={`/store/categories/${category.toLowerCase().replace(' ', '-')}`}
                className="group relative h-40 md:h-64 overflow-hidden rounded-lg bg-gray-200"
              >
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center group-hover:bg-opacity-30 transition-all">
                  <h3 className="text-white text-xl font-medium">{category}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      
      {/* New Arrivals */}
      <div className="container mx-auto px-4 py-12">
        <ProductGrid 
          products={newArrivals} 
          title="New Arrivals" 
          loading={loading}
        />
      </div>
      
      {/* Sale Banner */}
      <div className="bg-gradient-to-r from-pink-500 to-[#EC008C] py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Summer Sale</h2>
          <p className="text-white text-lg mb-6">Get up to 50% off on selected items</p>
          <Link to="/store/categories/sale">
            <button className="bg-white text-[#EC008C] hover:bg-gray-100 px-8 py-3 rounded-md font-medium transition-colors">
              Shop Now
            </button>
          </Link>
        </div>
      </div>
      
      {/* Hot Selling Products */}
      <div className="container mx-auto px-4 py-12">
        <ProductGrid 
          products={hotSellingProducts} 
          title="Hot Selling" 
          loading={loading}
        />
      </div>
      
      {/* Trending Products */}
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <ProductGrid 
            products={trendingProducts} 
            title="Trending Now" 
            loading={loading}
          />
        </div>
      </div>
      
      {/* Sale Products */}
      <div className="container mx-auto px-4 py-12">
        <ProductGrid 
          products={saleProducts} 
          title="On Sale" 
          loading={loading}
        />
      </div>
      
      {/* Newsletter */}
      <div className="bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto text-center">
            <h3 className="text-2xl font-medium text-gray-800 mb-3">Subscribe to our Newsletter</h3>
            <p className="text-gray-600 mb-6">Get the latest updates on new products and upcoming sales</p>
            <div className="flex flex-col sm:flex-row gap-2">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="flex-1 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EC008C] focus:border-transparent"
              />
              <button className="bg-[#EC008C] hover:bg-[#D1007D] text-white px-6 py-3 rounded-md font-medium transition-colors whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
