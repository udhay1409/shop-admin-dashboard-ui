
import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '@/types/product';
import { formatCurrency } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

interface ProductGridProps {
  products: Product[];
  title?: string;
  emptyMessage?: string;
  loading?: boolean;
  columns?: number;
}

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  title,
  emptyMessage = "No products found",
  loading = false,
  columns = 4
}) => {
  const { toast } = useToast();
  const gridClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5',
  }[columns] || 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';

  if (loading) {
    return (
      <div className="py-8">
        {title && (
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-medium text-gray-800">{title}</h2>
          </div>
        )}
        <div className={`animate-pulse grid ${gridClass} gap-6`}>
          {[...Array(8)].map((_, index) => (
            <div key={index} className="bg-gray-100 rounded-lg overflow-hidden">
              <div className="h-64 bg-gray-200"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/4 mt-2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    target.src = 'https://placehold.co/400x500?text=No+Image';
    // Only show toast once to avoid spamming
    if (!target.dataset.errorHandled) {
      target.dataset.errorHandled = 'true';
      console.log("Image failed to load, using placeholder:", target.alt);
      toast({
        title: "Image not found",
        description: "Using placeholder image instead",
        variant: "default"
      });
    }
  };

  return (
    <div className={title ? "py-8" : ""}>
      {title && (
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-medium text-gray-800">{title}</h2>
          <Link to="/store/categories/all" className="text-[#EC008C] hover:underline text-sm font-medium">
            View All
          </Link>
        </div>
      )}
      
      <div className={`grid ${gridClass} gap-6`}>
        {products.map((product) => (
          <Link 
            key={product.id}
            to={`/store/product/${product.id}`}
            className="group bg-white rounded-lg overflow-hidden border border-gray-100 transition-shadow hover:shadow-md"
          >
            <div className="relative h-64 bg-gray-50 overflow-hidden">
              {product.image ? (
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform"
                  onError={handleImageError}
                  loading="lazy"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-gray-100">
                  <img 
                    src="https://placehold.co/400x500?text=No+Image"
                    alt={`No image for ${product.name}`}
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
              
              {/* Product badges */}
              <div className="absolute top-2 left-2 flex flex-col gap-1">
                {product.isNew && (
                  <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">New</span>
                )}
                {product.isSale && product.discountPercentage && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
                    -{product.discountPercentage}%
                  </span>
                )}
                {product.trending && (
                  <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded">Trending</span>
                )}
                {product.hotSelling && (
                  <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded">Hot</span>
                )}
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="font-medium text-gray-800 group-hover:text-[#EC008C] transition-colors">
                {product.name}
              </h3>
              <p className="text-sm text-gray-500 mb-2">{product.category}</p>
              
              <div className="flex items-center justify-between mt-1">
                <div className="flex items-center">
                  <span className="font-medium text-[#EC008C]">
                    {formatCurrency(product.price)}
                  </span>
                  
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-gray-400 line-through text-sm ml-2">
                      {formatCurrency(product.originalPrice)}
                    </span>
                  )}
                </div>
                
                <span className={`text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                  {product.stock > 0 ? 'In stock' : 'Out of stock'}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;
