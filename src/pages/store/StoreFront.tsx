
import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, ShoppingCart } from 'lucide-react';
import { useStoreFront } from '@/components/store/StoreFrontContext';
import { Skeleton } from '@/components/ui/skeleton';

const StoreFront: React.FC = () => {
  const { storeSettings, featuredProducts, loading, error } = useStoreFront();

  const renderFeaturedProducts = () => {
    if (loading) {
      return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array(8).fill(0).map((_, index) => (
            <Card key={index} className="overflow-hidden border shadow-sm">
              <div className="relative">
                <AspectRatio ratio={3/4}>
                  <Skeleton className="h-full w-full" />
                </AspectRatio>
              </div>
              <CardContent className="p-4">
                <Skeleton className="h-4 w-2/3 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-4 w-1/3 mb-2" />
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }

    if (error || featuredProducts.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-lg text-gray-500 mb-4">
            {error ? 'Error loading products' : 'No featured products available'}
          </p>
          <Button asChild variant="outline">
            <Link to="/store/categories">Browse Categories</Link>
          </Button>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {featuredProducts.map(product => (
          <Card key={product.id} className="group overflow-hidden border shadow-sm hover:shadow-md transition-all duration-200">
            <div className="relative">
              <AspectRatio ratio={3/4}>
                <Link to={`/store/product/${product.id}`}>
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>
              </AspectRatio>
              {product.isNew && (
                <Badge className="absolute top-2 left-2 bg-black text-white">New</Badge>
              )}
              {product.isSale && (
                <Badge className="absolute top-2 left-2 bg-[#EC008C] text-white">Sale</Badge>
              )}
              <Button 
                variant="ghost" 
                size="icon"
                className="absolute top-2 right-2 bg-white bg-opacity-80 text-gray-800 rounded-full shadow-sm hover:text-[#EC008C]"
              >
                <Heart className="h-4 w-4" />
              </Button>
            </div>
            <CardContent className="p-4">
              <div className="text-gray-500 text-xs mb-1">{product.category}</div>
              <Link to={`/store/product/${product.id}`}>
                <h3 className="font-medium line-clamp-1 hover:text-[#EC008C]">{product.name}</h3>
              </Link>
              <div className="flex items-center gap-2 mt-1">
                <span className="font-semibold text-[#EC008C]">${product.price.toFixed(2)}</span>
                {product.originalPrice && (
                  <span className="text-gray-400 line-through text-sm">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
              <div className="mt-3 flex justify-end">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 rounded-full border-[#EC008C] text-[#EC008C] hover:bg-[#EC008C] hover:text-white"
                >
                  <ShoppingCart className="h-3 w-3 mr-1" /> Add
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-2">
          {loading ? <Skeleton className="h-10 w-48 mx-auto" /> : storeSettings?.storeName || "Fashiona"}
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          {loading ? 
            <Skeleton className="h-4 w-full max-w-md mx-auto" /> : 
            storeSettings?.description || "A premium fashion e-commerce store"}
        </p>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Featured Products</h2>
        {renderFeaturedProducts()}
      </div>
    </div>
  );
};

export default StoreFront;
