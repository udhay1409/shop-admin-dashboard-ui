import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Heart, ShoppingCart } from 'lucide-react';
import useProductInventory from '@/hooks/useProductInventory';
import { Product, ProductColor, ProductSize } from '@/types/product';

const banners = [
  {
    id: 1,
    title: "Every Thread Tells a Story",
    subtitle: "JUST FOR YOU",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=400&fit=crop",
    buttonText: "Shop Now, Discover a Style",
    buttonLink: "/store/categories/all"
  },
  {
    id: 2,
    title: "New Summer Collection",
    subtitle: "FRESH ARRIVALS",
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&h=400&fit=crop",
    buttonText: "Explore Summer Collection",
    buttonLink: "/store/categories/summer"
  },
  {
    id: 3,
    title: "Exclusive Designs",
    subtitle: "PREMIUM QUALITY",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&h=400&fit=crop",
    buttonText: "Discover Premium Range",
    buttonLink: "/store/categories/premium"
  }
];

const categories = [
  { name: "Dresses", image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=100&h=100&fit=crop&auto=format", count: 152 },
  { name: "Tops", image: "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=100&h=100&fit=crop&auto=format", count: 98 },
  { name: "Skirts", image: "https://images.unsplash.com/photo-1577900232427-18219b9166a0?w=100&h=100&fit=crop&auto=format", count: 65 },
  { name: "Pants", image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=100&h=100&fit=crop&auto=format", count: 76 },
  { name: "Accessories", image: "https://images.unsplash.com/photo-1519431458143-1bbd70c4c326?w=100&h=100&fit=crop&auto=format", count: 133 }
];

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&h=50&fit=crop&auto=format",
    rating: 5,
    text: "I absolutely love the quality and style of the clothes. The fit is perfect and the fabric feels so luxurious. Will definitely shop here again!"
  },
  {
    id: 2,
    name: "Michael Chen",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&auto=format",
    rating: 4,
    text: "Great customer service and fast shipping. The dress I ordered looks exactly like the photos online. Very satisfied with my purchase."
  },
  {
    id: 3,
    name: "Emily Roberts",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=50&h=50&fit=crop&auto=format",
    rating: 5,
    text: "The clothes are stylish, comfortable, and reasonably priced. I've received many compliments on the items I've purchased. Highly recommend!"
  }
];

const HomePage: React.FC = () => {
  const { products } = useProductInventory();
  const [hotSellingProducts, setHotSellingProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [limitedStocks, setLimitedStocks] = useState<Product[]>([]);
  const [trendingOffer, setTrendingOffer] = useState<{
    title: string;
    discount: string;
    image: string;
    link: string;
  }>({
    title: "Levi's",
    discount: "Min 60% off",
    image: "https://images.unsplash.com/photo-1520013817300-1f4c1cb245ef?w=600&h=400&fit=crop",
    link: "/store/brands/levis",
  });
  
  useEffect(() => {
    // Convert active products from inventory into store products format
    const available = products.filter(p => p.status === 'Active');
    
    // Set hot selling products - products with high stock for the demo
    const hotSelling = available
      .filter(p => p.stock > 50)
      .slice(0, 4)
      .map(enhanceProduct);
    setHotSellingProducts(hotSelling);
    
    // Set new arrivals - most recently created products
    const newItems = [...available]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 4)
      .map(enhanceProduct);
    setNewArrivals(newItems);
    
    // Set limited stocks - products with low stock
    const limited = available
      .filter(p => p.stock < 20 && p.stock > 0)
      .slice(0, 4)
      .map(enhanceProduct);
    setLimitedStocks(limited);
  }, [products]);
  
  // Helper function to enhance product with additional properties for display
  const enhanceProduct = (product: Product): Product => {
    return {
      ...product,
      rating: Math.floor(Math.random() * 5) + 1,
      reviews: Math.floor(Math.random() * 100),
      isNew: new Date(product.createdAt).getTime() > Date.now() - (30 * 24 * 60 * 60 * 1000),
      isSale: Math.random() > 0.7,
      discountPercentage: Math.floor(Math.random() * 50) + 10,
      availableColors: ['Red', 'Blue', 'Green', 'Black', 'White'].slice(0, Math.floor(Math.random() * 5) + 1) as ProductColor[],
      availableSizes: ['XS', 'S', 'M', 'L', 'XL'].slice(0, Math.floor(Math.random() * 5) + 1) as ProductSize[],
      image: product.image || 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=300&h=400&fit=crop',
    };
  };
  
  const formatPrice = (price: number) => `$${price.toFixed(2)}`;

  const renderStarRating = (rating: number) => {
    return (
      <div className="flex items-center">
        {Array(5).fill(0).map((_, i) => (
          <svg 
            key={i} 
            className={`w-3 h-3 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`} 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="ml-1 text-xs text-gray-500">({rating})</span>
      </div>
    );
  };

  const renderProductCard = (product: Product) => {
    return (
      <Card key={product.id} className="group overflow-hidden border shadow-sm hover:shadow-md transition-all duration-200">
        <div className="relative">
          <AspectRatio ratio={3/4}>
            <img 
              src={product.image} 
              alt={product.name}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
            />
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
          <div className="text-gray-500 text-xs mb-1">{product.subcategory || product.category}</div>
          <h3 className="font-medium line-clamp-1">{product.name}</h3>
          <div className="mt-1">{renderStarRating(product.rating || 4)}</div>
          <div className="flex items-center gap-2 mt-1">
            <span className="font-semibold text-[#EC008C]">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="text-gray-400 line-through text-sm">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
          <div className="mt-2 flex space-x-1">
            {(product.availableColors || []).slice(0, 4).map((color) => (
              <span 
                key={color} 
                className={`inline-block w-3 h-3 rounded-full border border-gray-200 ${
                  color === 'Red' ? 'bg-red-500' :
                  color === 'Blue' ? 'bg-blue-500' :
                  color === 'Green' ? 'bg-green-500' :
                  color === 'Yellow' ? 'bg-yellow-500' :
                  color === 'Pink' ? 'bg-pink-500' :
                  color === 'Black' ? 'bg-black' : 'bg-white'
                }`}
              ></span>
            ))}
          </div>
          <div className="mt-3 flex justify-between items-center">
            <div className="flex gap-1">
              {(product.availableSizes || []).slice(0, 3).map((size) => (
                <span key={size} className="inline-block text-xs border px-1 rounded">{size}</span>
              ))}
              {(product.availableSizes || []).length > 3 && <span className="text-xs">+{(product.availableSizes || []).length - 3}</span>}
            </div>
            <Button 
              variant="pink" 
              size="sm" 
              className="h-8 rounded-full"
            >
              <ShoppingCart className="h-3 w-3" /> Add
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen pb-8">
      {/* Hero Banner Carousel */}
      <section className="relative mb-12">
        <Carousel className="w-full">
          <CarouselContent>
            {banners.map((banner) => (
              <CarouselItem key={banner.id} className="relative h-[400px] md:h-[450px] lg:h-[500px]">
                <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent z-10"></div>
                <img 
                  src={banner.image} 
                  alt={banner.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 z-20 flex items-center">
                  <div className="container mx-auto px-4 md:px-8">
                    <div className="max-w-lg">
                      <h4 className="text-white text-lg md:text-xl mb-2">{banner.subtitle}</h4>
                      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                        {banner.title}
                      </h1>
                      <Button 
                        variant="pink" 
                        size="lg"
                        className="rounded-full"
                        asChild
                      >
                        <Link to={banner.buttonLink}>{banner.buttonText}</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="absolute z-30 bottom-4 left-0 right-0">
            <div className="flex justify-center gap-2">
              {banners.map((_, index) => (
                <div 
                  key={index} 
                  className={`w-2 h-2 rounded-full ${index === 0 ? 'bg-[#EC008C]' : 'bg-white/50'}`}
                />
              ))}
            </div>
          </div>
          <CarouselPrevious className="left-4 bg-white/80 hover:bg-white" />
          <CarouselNext className="right-4 bg-white/80 hover:bg-white" />
        </Carousel>
      </section>
      
      {/* Hot Selling Products */}
      <section className="container mx-auto px-4 mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Hot Selling</h2>
          <Link to="/store/categories/hot-selling" className="text-[#EC008C] hover:underline">View All</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {hotSellingProducts.map(product => renderProductCard(product))}
        </div>
        <div className="flex justify-center mt-6">
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4].map(num => (
              <div 
                key={num} 
                className={`w-2 h-2 rounded-full ${num === 1 ? 'bg-[#EC008C]' : 'bg-gray-300'}`} 
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* Trending Offer */}
      <section className="container mx-auto px-4 mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Trending Offers</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-100 rounded-lg overflow-hidden">
            <Link to={trendingOffer.link} className="block relative h-[300px] md:h-[400px]">
              <img src={trendingOffer.image} alt={trendingOffer.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/20 flex flex-col justify-center p-8">
                <h3 className="text-4xl font-bold text-white mb-2">{trendingOffer.title}</h3>
                <p className="text-2xl text-white mb-6">{trendingOffer.discount}</p>
                <Button 
                  variant="pink" 
                  className="self-start rounded-full"
                >
                  Shop Now For Best Deals
                </Button>
              </div>
            </Link>
          </div>
          <div className="hidden md:block bg-pink-50 rounded-lg p-6">
            <div className="h-full flex flex-col justify-center items-center text-center">
              <h3 className="text-3xl font-bold mb-4">Summer Sale</h3>
              <p className="text-xl mb-4">Get Up To 40% Off</p>
              <p className="text-gray-600 mb-6">Limited time offer. Shop our summer collection and save big!</p>
              <Button 
                variant="outline-pink" 
                className="rounded-full"
                asChild
              >
                <Link to="/store/sale">Explore Sale Items</Link>
              </Button>
            </div>
          </div>
        </div>
        <div className="flex justify-center mt-6">
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4].map(num => (
              <div 
                key={num} 
                className={`w-2 h-2 rounded-full ${num === 1 ? 'bg-[#EC008C]' : 'bg-gray-300'}`} 
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* New Arrivals */}
      <section className="container mx-auto px-4 mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">New Arrivals</h2>
          <Link to="/store/categories/new-arrivals" className="text-[#EC008C] hover:underline">View All</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {newArrivals.map(product => renderProductCard(product))}
        </div>
        <div className="flex justify-center mt-6">
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4].map(num => (
              <div 
                key={num} 
                className={`w-2 h-2 rounded-full ${num === 1 ? 'bg-[#EC008C]' : 'bg-gray-300'}`} 
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* Featured Quote */}
      <section className="py-16 bg-pink-50 mb-12">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-medium mb-4 leading-tight">
            When You Walk Into A Room, <br />Your Dress Should Speak Before You Do.
          </h2>
          <Button 
            variant="pink"
            className="mt-4 rounded-full"
            asChild
          >
            <Link to="/store/categories/premium">Explore Your Signature Style</Link>
          </Button>
        </div>
      </section>
      
      {/* Categories You Might Like */}
      <section className="container mx-auto px-4 mb-12">
        <h2 className="text-2xl font-bold mb-6">Categories you might like</h2>
        <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
          {categories.map((category, index) => (
            <Link 
              key={index} 
              to={`/store/categories/${category.name.toLowerCase()}`} 
              className="group"
            >
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden mb-2 border-2 border-[#EC008C] p-0.5">
                  <img 
                    src={category.image} 
                    alt={category.name} 
                    className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform"
                  />
                </div>
                <h3 className="text-sm font-medium text-center">{category.name}</h3>
                <p className="text-xs text-gray-500">{category.count} items</p>
              </div>
            </Link>
          ))}
        </div>
        <div className="flex justify-center mt-6">
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4].map(num => (
              <div 
                key={num} 
                className={`w-2 h-2 rounded-full ${num === 1 ? 'bg-[#EC008C]' : 'bg-gray-300'}`} 
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* Limited Stocks */}
      <section className="container mx-auto px-4 mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Limited Stocks</h2>
          <Link to="/store/categories/limited-stocks" className="text-[#EC008C] hover:underline">View All</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {limitedStocks.map(product => renderProductCard(product))}
        </div>
        <div className="flex justify-center mt-6">
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4].map(num => (
              <div 
                key={num} 
                className={`w-2 h-2 rounded-full ${num === 1 ? 'bg-[#EC008C]' : 'bg-gray-300'}`} 
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="container mx-auto px-4 mb-12">
        <h2 className="text-2xl font-bold mb-6">What Our Customers Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="p-6 shadow-sm hover:shadow-md transition-all duration-200">
              <div className="flex items-center mb-4">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.name} 
                  className="w-12 h-12 rounded-full mr-4 border border-gray-200"
                />
                <div>
                  <h3 className="font-medium">{testimonial.name}</h3>
                  <div className="flex">
                    {Array(5).fill(0).map((_, i) => (
                      <svg 
                        key={i} 
                        className={`w-4 h-4 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`} 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-700">{testimonial.text}</p>
            </Card>
          ))}
        </div>
        <div className="flex justify-center mt-6">
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4].map(num => (
              <div 
                key={num} 
                className={`w-2 h-2 rounded-full ${num === 1 ? 'bg-[#EC008C]' : 'bg-gray-300'}`} 
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
