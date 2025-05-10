import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent 
} from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Heart, ShoppingCart, Share, ArrowLeft, ArrowRight, Minus, Plus, Check } from 'lucide-react';
import BreadcrumbNav from '@/components/store/BreadcrumbNav';
import { useToast } from '@/hooks/use-toast';
import useProductInventory from '@/hooks/useProductInventory';
import { Product, ProductColor, ProductSize } from '@/types/product';

const ProductDetailPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const { products, getProductById } = useProductInventory();
  const { toast } = useToast();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(null);
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProduct() {
      if (productId) {
        setLoading(true);
        try {
          const fetchedProduct = await getProductById(productId);
          
          if (fetchedProduct) {
            // Enhance product with additional details if needed
            const enhancedProduct: Product = {
              ...fetchedProduct,
              rating: fetchedProduct.rating || 4,
              reviews: fetchedProduct.reviews || Math.floor(Math.random() * 100),
              availableColors: fetchedProduct.availableColors || 
                ['Red', 'Blue', 'Green', 'Black', 'White'].slice(0, Math.floor(Math.random() * 5) + 1) as ProductColor[],
              availableSizes: fetchedProduct.availableSizes || 
                ['XS', 'S', 'M', 'L', 'XL'] as ProductSize[],
            };
            
            setProduct(enhancedProduct);
            
            // Set default selected size and color
            if (enhancedProduct.availableSizes?.length) {
              setSelectedSize(enhancedProduct.availableSizes[0]);
            }
            
            if (enhancedProduct.availableColors?.length) {
              setSelectedColor(enhancedProduct.availableColors[0]);
            }
            
            // Find related products (same category)
            const related = products
              .filter(p => p.id !== productId && p.category === enhancedProduct.category && p.status === 'Active')
              .slice(0, 4);
            
            setRelatedProducts(related);
          }
        } catch (error) {
          console.error('Error loading product:', error);
        } finally {
          setLoading(false);
        }
      }
    }
    
    loadProduct();
  }, [productId, products, getProductById]);

  const handleQuantityChange = (amount: number) => {
    const newQuantity = quantity + amount;
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 10)) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast({
        title: "Please select a size",
        variant: "destructive"
      });
      return;
    }
    
    if (!selectedColor) {
      toast({
        title: "Please select a color",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Added to cart",
      description: `${quantity} × ${product?.name} added to your cart`,
    });
  };

  const handleAddToWishlist = () => {
    toast({
      title: "Added to wishlist",
      description: `${product?.name} has been added to your wishlist`,
    });
  };

  const renderStarRating = (rating: number = 0) => {
    return (
      <div className="flex items-center">
        {Array(5).fill(0).map((_, i) => (
          <svg 
            key={i} 
            className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`} 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="ml-1 text-sm">{rating.toFixed(1)}</span>
        <span className="ml-1 text-sm text-gray-500">({product?.reviews || 0} reviews)</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold mb-6">Loading product...</h1>
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold mb-6">Product not found</h1>
        <Button asChild>
          <Link to="/store">Return to Store</Link>
        </Button>
      </div>
    );
  }
  
  // Format price
  const formatPrice = (price: number) => `$${price.toFixed(2)}`;
  
  // Helper function for breadcrumbs
  // In a real app, you'd fetch the actual category/subcategory data
  const category = product.category;
  const subcategory = product.subcategory || '';
  const categorySlug = category.toLowerCase().replace(/\s+/g, '-');
  const subcategorySlug = subcategory.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="container mx-auto px-4 py-4">
      <BreadcrumbNav 
        items={[
          { label: category, href: `/store/categories/${categorySlug}` },
          ...(subcategory ? [{ label: subcategory, href: `/store/categories/${categorySlug}/${subcategorySlug}` }] : []),
          { label: product.name, href: `/store/product/${product.id}`, isCurrent: true }
        ]} 
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Product Images */}
        <div className="relative">
          <AspectRatio ratio={4/5} className="bg-gray-100 overflow-hidden rounded-lg shadow">
            <img 
              src={product.image || 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&h=800&fit=crop'} 
              alt={product.name}
              className="object-cover w-full h-full"
            />
            {product.isSale && (
              <Badge className="absolute top-4 left-4 bg-[#EC008C] text-white px-3 py-1">
                {product.discountPercentage}% OFF
              </Badge>
            )}
          </AspectRatio>
          <div className="mt-4 flex justify-between">
            <Button variant="outline" size="icon" disabled>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex space-x-2">
              {[1, 2, 3].map((i) => (
                <div 
                  key={i} 
                  className={`w-3 h-3 rounded-full ${i === 1 ? 'bg-[#EC008C]' : 'bg-gray-300'}`} 
                />
              ))}
            </div>
            <Button variant="outline" size="icon">
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Product Details */}
        <div>
          <div className="mb-4">
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <div className="flex items-center gap-4 mb-2">
              <div className="flex items-center gap-1">
                {renderStarRating(product.rating || 0)}
              </div>
              {product.sku && (
                <div className="text-sm text-gray-500">SKU: {product.sku}</div>
              )}
            </div>
            
            <div className="flex items-center gap-2 mb-4">
              <span className="text-3xl font-bold text-[#EC008C]">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-xl text-gray-400 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
            
            <div className="mb-6">
              <p className="text-gray-700 leading-relaxed">
                {product.description || "This beautiful product combines style, comfort, and durability. Perfect for any occasion and designed to last."}
              </p>
            </div>
            
            {/* Colors */}
            {product.availableColors && product.availableColors.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Color</h3>
                <div className="flex flex-wrap gap-2">
                  {product.availableColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        selectedColor === color ? 'ring-2 ring-[#EC008C] ring-offset-2' : ''
                      }`}
                      style={{
                        backgroundColor: 
                          color === 'Red' ? '#ef4444' :
                          color === 'Blue' ? '#3b82f6' :
                          color === 'Green' ? '#22c55e' :
                          color === 'Yellow' ? '#eab308' :
                          color === 'Pink' ? '#ec4899' :
                          color === 'Black' ? '#000000' : '#ffffff',
                        border: color === 'White' ? '1px solid #e5e7eb' : 'none'
                      }}
                    >
                      {selectedColor === color && (
                        <Check className={`h-4 w-4 ${color === 'White' ? 'text-black' : 'text-white'}`} />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Sizes */}
            {product.availableSizes && product.availableSizes.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Size</h3>
                <div className="flex flex-wrap gap-2">
                  {product.availableSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-3 py-1 border rounded-md ${
                        selectedSize === size 
                          ? 'border-[#EC008C] bg-[#EC008C] text-white' 
                          : 'border-gray-300 hover:border-[#EC008C]'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Quantity */}
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Quantity</h3>
              <div className="flex items-center">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <div className="mx-4 w-12 text-center font-medium">{quantity}</div>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= (product.stock || 10)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <div className="ml-4 text-sm text-gray-500">
                  {product.stock || 10} available
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                onClick={handleAddToCart}
                className="flex-1 gap-2 bg-[#EC008C] hover:bg-[#D1007D]"
                size="lg"
              >
                <ShoppingCart className="h-5 w-5" />
                Add to Cart
              </Button>
              <Button 
                variant="outline" 
                onClick={handleAddToWishlist}
                className="gap-2 border-[#EC008C] text-[#EC008C] hover:bg-pink-50"
                size="lg"
              >
                <Heart className="h-5 w-5" />
                Wishlist
              </Button>
              <Button variant="outline" size="icon" className="border-gray-300">
                <Share className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Product Tabs */}
      <Tabs defaultValue="description" className="mb-12">
        <TabsList className="w-full border-b rounded-none justify-start">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="shipping">Shipping Info</TabsTrigger>
        </TabsList>
        <TabsContent value="description" className="pt-4">
          <div className="text-gray-700">
            <h3 className="font-bold text-lg mb-2">Product Details</h3>
            <p className="mb-4">{product.description || "This beautiful product combines style, comfort, and durability. Perfect for any occasion and designed to last."}</p>
            
            <h3 className="font-bold text-lg mb-2">Features</h3>
            <ul className="list-disc pl-5 mb-4 space-y-1">
              <li>Premium quality fabric</li>
              <li>Comfortable fit</li>
              <li>Durable construction</li>
              <li>Easy to care for</li>
              <li>Versatile styling options</li>
            </ul>
            
            <h3 className="font-bold text-lg mb-2">Care Instructions</h3>
            <p>Machine wash cold with like colors. Tumble dry low. Do not bleach.</p>
          </div>
        </TabsContent>
        <TabsContent value="reviews" className="pt-4">
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg">Customer Reviews</h3>
              <Button>Write a Review</Button>
            </div>
            
            {/* Sample reviews */}
            {[
              { 
                name: "Sarah J.", 
                rating: 5, 
                date: "2 weeks ago", 
                comment: "Absolutely love this! The quality is exceptional and it fits perfectly. Will definitely buy more colors." 
              },
              {
                name: "Michael T.", 
                rating: 4, 
                date: "1 month ago", 
                comment: "Great product overall. The material is nice and comfortable. Shipping was fast too!" 
              },
              {
                name: "Emily R.", 
                rating: 5, 
                date: "2 months ago", 
                comment: "This exceeded my expectations! The color is exactly as shown in the picture and the fit is perfect." 
              }
            ].map((review, index) => (
              <div key={index} className="border-b pb-4">
                <div className="flex justify-between mb-2">
                  <div>
                    <h4 className="font-medium">{review.name}</h4>
                    {renderStarRating(review.rating)}
                  </div>
                  <div className="text-sm text-gray-500">{review.date}</div>
                </div>
                <p className="text-gray-700">{review.comment}</p>
              </div>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="shipping" className="pt-4">
          <div className="text-gray-700">
            <h3 className="font-bold text-lg mb-2">Shipping Information</h3>
            <p className="mb-4">We process and ship orders within 1-2 business days. Standard shipping takes 3-5 business days to arrive.</p>
            
            <h3 className="font-bold text-lg mb-2">Return Policy</h3>
            <p className="mb-4">If you're not fully satisfied with your purchase, you can return it within 30 days for a full refund.</p>
            
            <h3 className="font-bold text-lg mb-2">Shipping Fees</h3>
            <p>Free shipping on orders over $50. Standard shipping fee is $5.99.</p>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {relatedProducts.map(item => (
              <Card key={item.id} className="overflow-hidden border shadow-sm hover:shadow-md transition-all duration-200">
                <Link to={`/store/product/${item.id}`}>
                  <AspectRatio ratio={3/4}>
                    <img 
                      src={item.image || 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=300&h=400&fit=crop'} 
                      alt={item.name}
                      className="object-cover w-full h-full"
                    />
                  </AspectRatio>
                </Link>
                <CardContent className="p-3">
                  <Link to={`/store/product/${item.id}`}>
                    <h3 className="font-medium line-clamp-1 hover:text-[#EC008C]">{item.name}</h3>
                  </Link>
                  <div className="mt-1 flex justify-between items-center">
                    <span className="font-semibold text-[#EC008C]">{formatPrice(item.price)}</span>
                    <Button 
                      variant="ghost"
                      size="sm" 
                      className="p-0 h-6 w-6 rounded-full hover:bg-pink-50 hover:text-[#EC008C]"
                    >
                      <ShoppingCart className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;
