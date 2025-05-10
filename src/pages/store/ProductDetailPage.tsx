
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useStoreFrontProducts } from '@/hooks/useStoreFrontProducts';
import BreadcrumbNav from '@/components/store/BreadcrumbNav';
import { Product } from '@/types/product';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import ProductGrid from '@/components/store/ProductGrid';
import { Heart, ShoppingCart, Share2, Check, ChevronRight, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ProductDetailPage = () => {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const { fetchProductById, fetchProductsByCategory } = useStoreFrontProducts();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const loadProduct = async () => {
      if (!productId) return;
      
      setLoading(true);
      try {
        const fetchedProduct = await fetchProductById(productId);
        
        if (fetchedProduct) {
          setProduct(fetchedProduct);
          
          // Load related products from same category
          if (fetchedProduct.category) {
            const categoryProducts = await fetchProductsByCategory(
              fetchedProduct.category.toLowerCase().replace(' ', '-')
            );
            
            // Filter out the current product and limit to 4 products
            const related = categoryProducts
              .filter(p => p.id !== fetchedProduct.id)
              .slice(0, 4);
              
            setRelatedProducts(related);
          }
        } else {
          // Product not found
          toast({
            title: "Product not found",
            description: "The requested product could not be found.",
            variant: "destructive"
          });
          navigate('/store');
        }
      } catch (error) {
        console.error('Error loading product:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadProduct();
  }, [productId, fetchProductById, fetchProductsByCategory, navigate, toast]);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(e.target.value);
    if (!isNaN(newQuantity) && newQuantity > 0) {
      const maxQty = product?.stock ? Math.min(product.stock, 10) : 10;
      setQuantity(Math.min(newQuantity, maxQty));
    }
  };

  const incrementQuantity = () => {
    const maxQty = product?.stock ? Math.min(product.stock, 10) : 10;
    setQuantity(prev => Math.min(prev + 1, maxQty));
  };

  const decrementQuantity = () => {
    setQuantity(prev => Math.max(prev - 1, 1));
  };

  const addToCart = () => {
    if (!product) return;
    
    toast({
      title: "Added to Cart",
      description: `${product.name} added to your cart`,
      action: (
        <Link to="/store/cart">
          <Button variant="outline" size="sm">
            View Cart
          </Button>
        </Link>
      ),
    });
  };

  const addToWishlist = () => {
    if (!product) return;
    
    toast({
      title: "Added to Wishlist",
      description: `${product.name} added to your wishlist`,
      action: (
        <Link to="/store/wishlist">
          <Button variant="outline" size="sm">
            View Wishlist
          </Button>
        </Link>
      ),
    });
  };

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-8"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="h-96 bg-gray-200 rounded"></div>
            
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              <div className="h-24 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded w-full"></div>
              <div className="h-10 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <p className="mb-8">The product you're looking for does not exist or has been removed.</p>
        <Link to="/store">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <BreadcrumbNav 
        items={[
          { label: 'Home', href: '/store' },
          { label: product.category, href: `/store/categories/${product.category.toLowerCase().replace(' ', '-')}` },
          { label: product.name }
        ]} 
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {/* Product Image */}
        <div className="relative">
          <div className="bg-gray-50 rounded-lg overflow-hidden aspect-square">
            {product.image ? (
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-gray-100">
                <span className="text-gray-400">No image available</span>
              </div>
            )}
          </div>
          
          {/* Product badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-1">
            {product.isNew && (
              <span className="bg-blue-500 text-white px-3 py-1 rounded">New</span>
            )}
            {product.isSale && product.discountPercentage && (
              <span className="bg-red-500 text-white px-3 py-1 rounded">
                -{product.discountPercentage}% OFF
              </span>
            )}
          </div>
        </div>
        
        {/* Product Details */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-4 h-4 ${i < 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                />
              ))}
            </div>
            <span className="text-sm text-gray-500">(24 reviews)</span>
            <span className="text-sm text-gray-400">|</span>
            <span className={`text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
              {product.stock > 0 ? 'In stock' : 'Out of stock'}
            </span>
          </div>
          
          <div className="mb-6">
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold text-[#EC008C]">
                {formatCurrency(product.price)}
              </span>
              
              {product.originalPrice && product.originalPrice > product.price && (
                <>
                  <span className="text-gray-400 line-through">
                    {formatCurrency(product.originalPrice)}
                  </span>
                  <span className="bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded">
                    Save {formatCurrency(product.originalPrice - product.price)}
                  </span>
                </>
              )}
            </div>
            {product.discountPercentage && (
              <p className="text-green-600 text-sm mt-1">
                You save: {product.discountPercentage}% OFF
              </p>
            )}
          </div>
          
          {product.description && (
            <div className="mb-6">
              <p className="text-gray-600">{product.description}</p>
            </div>
          )}
          
          <div className="border-t border-b border-gray-200 py-6 mb-6">
            <div className="flex items-center mb-4">
              <label className="text-gray-700 mr-4">Quantity:</label>
              <div className="flex items-center">
                <button 
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                  className="px-3 py-1 border border-gray-300 rounded-l-md bg-gray-50 hover:bg-gray-100 disabled:opacity-50"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  max={product.stock > 0 ? Math.min(product.stock, 10) : 10}
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="w-12 text-center py-1 border-y border-gray-300"
                />
                <button 
                  onClick={incrementQuantity}
                  disabled={product.stock ? quantity >= Math.min(product.stock, 10) : false}
                  className="px-3 py-1 border border-gray-300 rounded-r-md bg-gray-50 hover:bg-gray-100 disabled:opacity-50"
                >
                  +
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button 
                onClick={addToCart} 
                className="bg-[#EC008C] hover:bg-[#D1007D]"
                disabled={product.stock <= 0}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add to Cart
              </Button>
              
              <Button 
                onClick={addToWishlist} 
                variant="outline" 
                className="border-[#EC008C] text-[#EC008C] hover:bg-pink-50"
              >
                <Heart className="w-4 h-4 mr-2" />
                Add to Wishlist
              </Button>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center text-sm text-gray-600">
              <Check className="w-4 h-4 text-green-500 mr-2" />
              <span>Free shipping on orders over $50</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Check className="w-4 h-4 text-green-500 mr-2" />
              <span>30-day return policy</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Share2 className="w-4 h-4 mr-2" />
              <span>Share this product</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">You may also like</h2>
          <ProductGrid products={relatedProducts} columns={4} />
          
          <div className="mt-8 text-center">
            <Link to={`/store/categories/${product.category.toLowerCase().replace(' ', '-')}`}>
              <Button variant="outline" className="inline-flex items-center">
                View more from {product.category}
                <ChevronRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;
