import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Menu,
  X,
  ChevronRight,
  ArrowRight,
  Star,
  LayoutDashboard
} from 'lucide-react';
import useProductInventory from '@/hooks/useProductInventory';
import AdminBar from '@/components/AdminBar';
import { Link } from 'react-router-dom';

const categories = [
  "New Arrivals",
  "Dresses",
  "Tops",
  "Bottoms",
  "Outerwear",
  "Activewear",
  "Accessories",
  "Sale"
];

const StoreFront: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { products } = useProductInventory();
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  // Simple admin check (in a real app, use proper auth)
  const isAdmin = true; // Replace with actual auth logic
  
  useEffect(() => {
    // Get featured products from the product inventory
    const available = products.filter(p => p.status === 'Active');
    // Use up to 4 products for the featured section
    setFeaturedProducts(available.slice(0, 4).map(product => ({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=300&h=450&fit=crop',
      category: product.category,
      isNew: new Date(product.createdAt).getTime() > Date.now() - (30 * 24 * 60 * 60 * 1000), // New if less than 30 days old
      sale: false
    })));
  }, [products]);
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Admin Bar */}
      <AdminBar isAdmin={isAdmin} />
      
      {/* Header */}
      <header className="sticky top-0 bg-white border-b z-30 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="h-16 flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="icon"
                className="md:hidden mr-2"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu className="h-6 w-6" />
              </Button>
              <h1 className="text-2xl font-script font-bold text-pink-600">Fashiona</h1>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              {categories.slice(0, 6).map(category => (
                <a 
                  key={category} 
                  href="#" 
                  className="text-sm hover:text-pink-600 transition-colors"
                >
                  {category}
                </a>
              ))}
              <a href="#" className="text-sm text-pink-600 font-medium">
                Sale
              </a>
            </nav>
            
            {/* Search and Icons */}
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Search..." 
                  className="pl-9 w-[200px] h-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Button variant="ghost" size="icon" className="relative">
                <Heart className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-pink-600 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">
                  2
                </span>
              </Button>
              
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-pink-600 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">
                  3
                </span>
              </Button>
              
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
              
              {isAdmin && (
                <Link to="/">
                  <Button variant="outline" size="icon" className="ml-2" title="Admin Dashboard">
                    <LayoutDashboard className="h-5 w-5" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
          
          {/* Mobile Search */}
          <div className="md:hidden pb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search..." 
                className="pl-9 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </header>
      
      {/* Mobile Menu */}
      <div className={`fixed inset-0 bg-white z-40 transition-transform ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex justify-between items-center h-16 px-4 border-b">
          <h1 className="text-xl font-script font-bold text-pink-600">Fashiona</h1>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setMobileMenuOpen(false)}
          >
            <X className="h-6 w-6" />
          </Button>
        </div>
        
        <div className="p-4">
          <nav className="space-y-4">
            {categories.map(category => (
              <a 
                key={category} 
                href="#" 
                className="flex items-center justify-between py-2 border-b"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>{category}</span>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </a>
            ))}
          </nav>
          
          <div className="mt-8 space-y-4">
            <Button variant="outline" className="w-full justify-start">
              <User className="h-4 w-4 mr-2" />
              My Account
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Heart className="h-4 w-4 mr-2" />
              Wishlist
            </Button>
          </div>
        </div>
      </div>
      
      {/* Hero Carousel */}
      <section className="relative">
        <Carousel className="w-full">
          <CarouselContent>
            <CarouselItem>
              <div className="bg-gradient-to-r from-pink-50 to-purple-50 py-16 px-4 md:px-12">
                <div className="container mx-auto">
                  <div className="max-w-xl">
                    <Badge variant="outline" className="mb-4">New Collection</Badge>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Spring Summer 2025 Collection</h1>
                    <p className="text-lg text-gray-600 mb-8">
                      Discover the latest trends in women's fashion and express your unique style with our new arrivals.
                    </p>
                    <div className="flex space-x-4">
                      <Button size="lg" className="bg-pink-600 hover:bg-pink-700">
                        Shop Now
                      </Button>
                      <Button size="lg" variant="outline">
                        Explore Collection
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
            <CarouselItem>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 py-16 px-4 md:px-12">
                <div className="container mx-auto">
                  <div className="max-w-xl">
                    <Badge variant="outline" className="mb-4">Limited Time</Badge>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Summer Sale Up To 50% Off</h1>
                    <p className="text-lg text-gray-600 mb-8">
                      Refresh your wardrobe with our seasonal discounts on selected styles and accessories.
                    </p>
                    <div className="flex space-x-4">
                      <Button size="lg" className="bg-pink-600 hover:bg-pink-700">
                        Shop Sale
                      </Button>
                      <Button size="lg" variant="outline">
                        View All
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          </CarouselContent>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
            <CarouselPrevious className="relative left-0 translate-y-0 h-8 w-8 rounded-full border border-pink-200" />
            <CarouselNext className="relative right-0 translate-y-0 h-8 w-8 rounded-full border border-pink-200" />
          </div>
        </Carousel>
      </section>
      
      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Featured Products</h2>
            {isAdmin ? (
              <div className="flex items-center gap-2">
                <Link to="/products">
                  <Button variant="outline" size="sm" className="text-pink-600 border-pink-600">
                    Manage Products
                  </Button>
                </Link>
                <Button variant="link" className="flex items-center text-pink-600">
                  View All <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button variant="link" className="flex items-center text-pink-600">
                View All <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            )}
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {featuredProducts.length > 0 ? (
              featuredProducts.map(product => (
                <Card key={product.id} className="group overflow-hidden border-none shadow-sm hover:shadow-md transition-all duration-200">
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
                    {product.sale && (
                      <Badge className="absolute top-2 left-2 bg-pink-600 text-white">Sale</Badge>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-90 py-2 px-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-200">
                      <Button variant="outline" size="sm" className="w-full">
                        Quick View
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center text-yellow-400 mb-2">
                      <Star className="h-3.5 w-3.5 fill-current" />
                      <Star className="h-3.5 w-3.5 fill-current" />
                      <Star className="h-3.5 w-3.5 fill-current" />
                      <Star className="h-3.5 w-3.5 fill-current" />
                      <Star className="h-3.5 w-3.5" />
                      <span className="text-xs text-gray-500 ml-1">(24)</span>
                    </div>
                    <h3 className="font-medium">{product.name}</h3>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-pink-600">${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}</span>
                      {product.originalPrice && (
                        <span className="text-gray-400 line-through text-sm">
                          ${product.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-4 text-center py-8">
                <p className="text-gray-500">No products found.</p>
                {isAdmin && (
                  <Link to="/products" className="mt-4 inline-block">
                    <Button>Add Products</Button>
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
      
      {/* Categories */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">Shop by Category</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map(category => (
              <a 
                key={category}
                href="#"
                className="relative aspect-square overflow-hidden group rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                  <span className="text-white text-lg font-medium px-4 py-2 border border-white rounded-md backdrop-blur-sm bg-black/10">
                    {category}
                  </span>
                </div>
                <img 
                  src={`https://source.unsplash.com/random/300x300?${category.toLowerCase()},womens,fashion`} 
                  alt={category}
                  className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
                />
              </a>
            ))}
          </div>
        </div>
      </section>
      
      {/* Features */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 hover-lift">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-pink-100 text-pink-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2">Free Shipping</h3>
              <p className="text-gray-600">Free shipping on all orders over $50</p>
            </div>
            
            <div className="text-center p-6 hover-lift">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-pink-100 text-pink-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2">Easy Returns</h3>
              <p className="text-gray-600">30-day return policy for all items</p>
            </div>
            
            <div className="text-center p-6 hover-lift">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-pink-100 text-pink-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2">Secure Payments</h3>
              <p className="text-gray-600">Your data is protected at all times</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Newsletter */}
      <section className="py-16 bg-gradient-to-r from-pink-500 to-pink-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-2">Subscribe to Our Newsletter</h2>
          <p className="mb-6 max-w-md mx-auto">
            Be the first to know about new collections and exclusive offers.
          </p>
          
          <div className="flex max-w-md mx-auto">
            <Input 
              placeholder="Your email address" 
              className="bg-white text-black rounded-r-none"
            />
            <Button className="bg-black hover:bg-gray-800 rounded-l-none">
              Subscribe
            </Button>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4 font-script">Fashiona</h3>
              <p className="text-gray-400">
                Your destination for trendy women's fashion and accessories.
              </p>
              {isAdmin && (
                <Link to="/" className="mt-4 inline-block">
                  <Button variant="outline" size="sm" className="bg-transparent border-white hover:bg-white hover:text-gray-900 mt-4">
                    Admin Dashboard
                  </Button>
                </Link>
              )}
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">Shop</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">New Arrivals</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Best Sellers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Sale</a></li>
                <li><a href="#" className="hover:text-white transition-colors">All Products</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">Customer Service</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Shipping & Returns</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Size Guide</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              &copy; 2025 Fashiona. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0 flex gap-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Instagram
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Facebook
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Pinterest
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Twitter
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default StoreFront;
