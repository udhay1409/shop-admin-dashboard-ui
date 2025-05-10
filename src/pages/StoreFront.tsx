
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
  Heart,
  Menu,
  X,
  ChevronRight,
  Phone,
  Mail,
  MapPin,
  Search,
  ShoppingCart,
  User
} from 'lucide-react';
import useProductInventory from '@/hooks/useProductInventory';
import AdminBar from '@/components/AdminBar';
import { Link } from 'react-router-dom';
import { ProductSize, ProductColor } from '@/types/product';

const categories = [
  "Home",
  "Kurthi",
  "Salwar Suits",
  "Lehenga Cholis",
  "Dupattas"
];

// Updated product type with sizes and colors
type StoreProduct = {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  subcategory: string;
  isNew?: boolean;
  isSale?: boolean;
  availableSizes?: ProductSize[];
  availableColors?: ProductColor[];
};

const StoreFront: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { products } = useProductInventory();
  const [storeProducts, setStoreProducts] = useState<StoreProduct[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<StoreProduct[]>([]);
  // Simple admin check (in a real app, use proper auth)
  const isAdmin = true; // Replace with actual auth logic
  const [currentPage, setCurrentPage] = useState(1);
  
  useEffect(() => {
    // Convert products from inventory into store products format
    const available = products.filter(p => p.status === 'Active');
    
    const convertedProducts = available.map(product => ({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice || (Math.random() > 0.5 ? product.price * 1.2 : undefined),
      image: product.image || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=300&h=450&fit=crop',
      category: product.category,
      subcategory: product.subcategory || 'Sub Category',
      isNew: new Date(product.createdAt).getTime() > Date.now() - (30 * 24 * 60 * 60 * 1000), // New if less than 30 days old
      isSale: Math.random() > 0.7, // Randomly mark some as on sale
      availableSizes: ['XS', 'S', 'M', 'L', 'XL'] as ProductSize[],
      availableColors: ['Red', 'Blue', 'Green', 'Yellow'] as ProductColor[]
    }));
    
    setStoreProducts(convertedProducts);
    
    // Also set some related products (this would normally be based on current product)
    setRelatedProducts(convertedProducts.slice(0, 4));
  }, [products]);
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Admin Bar */}
      <AdminBar isAdmin={isAdmin} />
      
      {/* Top notification bar */}
      <div className="bg-[#EC008C] text-white py-2 px-4 text-center text-sm flex justify-between">
        <div className="hidden md:flex space-x-4">
          <span className="flex items-center">
            <Phone className="h-3 w-3 mr-1" /> (223) 555-0118
          </span>
          <span className="flex items-center">
            <Mail className="h-3 w-3 mr-1" /> michelle.rivera@example.com
          </span>
        </div>
        <div className="flex-1 md:flex-none text-center">
          Free shipping on orders over $50
        </div>
        <div className="hidden md:flex space-x-4">
          <span>Follow Us:</span>
          <div className="flex space-x-2">
            <a href="#" className="hover:text-gray-200">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-2-9h4v-2h-4v2z" clipRule="evenodd" /></svg>
            </a>
            <a href="#" className="hover:text-gray-200">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-2-9h4v-2h-4v2z" clipRule="evenodd" /></svg>
            </a>
            <a href="#" className="hover:text-gray-200">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-2-9h4v-2h-4v2z" clipRule="evenodd" /></svg>
            </a>
          </div>
        </div>
      </div>
      
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
              <h1 className="text-2xl font-script font-bold text-[#EC008C]">Fashiona</h1>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {categories.map(category => (
                <a 
                  key={category} 
                  href="#" 
                  className={`text-sm hover:text-[#EC008C] transition-colors ${category === 'Kurthi' ? 'text-[#EC008C] font-medium' : ''}`}
                >
                  {category}
                </a>
              ))}
            </nav>
            
            {/* Icons */}
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
              
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
              
              <Button variant="ghost" size="icon" className="relative">
                <Heart className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-[#EC008C] text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">
                  0
                </span>
              </Button>
              
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-[#EC008C] text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">
                  3
                </span>
              </Button>
              
              <Button
                className="ml-2 bg-[#EC008C] hover:bg-[#D1007D]"
                size="sm"
              >
                Login
              </Button>
              
              {isAdmin && (
                <Link to="/">
                  <Button variant="outline" size="sm" className="ml-2 border-[#EC008C] text-[#EC008C]" title="Admin Dashboard">
                    Admin
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
          <h1 className="text-xl font-script font-bold text-[#EC008C]">Fashiona</h1>
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
      
      {/* Hero Banner */}
      <div className="relative">
        <div className="bg-gray-800 bg-opacity-70 absolute inset-0 z-10"></div>
        <img
          src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1600&h=500&fit=crop"
          alt="Fashion Collection"
          className="w-full h-[400px] object-cover"
        />
        <div className="absolute inset-0 z-20 flex items-center justify-center text-center p-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
              Our Collections Are Not Sorted By Season <br className="hidden md:block" />— But By Emotion, Expression, And Identity.
            </h1>
          </div>
        </div>
      </div>
      
      {/* Product Grid Section */}
      <section className="py-12 container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Side Filter Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white p-4 border rounded-lg shadow-sm">
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-3">CATEGORIES</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <a href="#" className="text-[#EC008C] font-medium">Kurtis</a>
                    <span className="text-sm text-gray-500">21</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <a href="#" className="hover:text-[#EC008C]">Sarees</a>
                    <span className="text-sm text-gray-500">15</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <a href="#" className="hover:text-[#EC008C]">Salwar Suits</a>
                    <span className="text-sm text-gray-500">8</span>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-3">CHOOSE SIZE</h3>
                <div className="flex flex-wrap gap-2">
                  {['XS', 'S', 'M', 'L', 'XL'].map(size => (
                    <button 
                      key={size} 
                      className={`w-8 h-8 border rounded-full flex items-center justify-center text-xs ${size === 'M' ? 'bg-[#EC008C] text-white border-[#EC008C]' : 'hover:border-[#EC008C]'}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-3">CHOOSE COLOR</h3>
                <div className="flex flex-wrap gap-2">
                  <button className="w-6 h-6 rounded-full bg-violet-600 border border-gray-300"></button>
                  <button className="w-6 h-6 rounded-full bg-blue-500 border border-gray-300"></button>
                  <button className="w-6 h-6 rounded-full bg-pink-500 border border-gray-300"></button>
                  <button className="w-6 h-6 rounded-full bg-green-600 border border-gray-300"></button>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">SELECT PRICE</h3>
                <div className="mb-4">
                  <input 
                    type="range" 
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" 
                    min="0" 
                    max="5000"
                    value="1500" 
                  />
                </div>
                <div className="text-sm text-gray-600">
                  <span>Price: ₹0 - ₹1,500</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Products */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {storeProducts.map(product => (
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
                    <div className="text-gray-500 text-xs mb-1">{product.subcategory}</div>
                    <h3 className="font-medium">{product.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-semibold text-[#EC008C]">${product.price.toFixed(2)}</span>
                      {product.originalPrice && (
                        <span className="text-gray-400 line-through text-sm">
                          ${product.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {['S', 'M', 'L', 'XL'].map(size => (
                        <span key={size} className="inline-block w-6 h-6 border text-xs flex items-center justify-center rounded-full">{size}</span>
                      ))}
                    </div>
                    <div className="mt-3 flex justify-between items-center">
                      <div className="flex gap-1">
                        {['Red', 'Blue', 'Yellow', 'Green'].map((color, idx) => (
                          <span 
                            key={color} 
                            className={`inline-block w-4 h-4 rounded-full ${
                              color === 'Red' ? 'bg-red-500' :
                              color === 'Blue' ? 'bg-blue-500' :
                              color === 'Yellow' ? 'bg-yellow-500' :
                              'bg-green-500'
                            }`}
                          ></span>
                        ))}
                      </div>
                      <Button className="bg-[#EC008C] hover:bg-[#D1007D] text-xs h-8" size="sm">
                        Add to Cart
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {/* Pagination */}
            <div className="mt-8 flex justify-center">
              <div className="flex items-center space-x-1">
                <Button 
                  variant="outline" 
                  size="icon"
                  className="w-8 h-8 p-0"
                >
                  &lt;
                </Button>
                <Button 
                  variant="default"
                  size="icon" 
                  className="w-8 h-8 p-0 bg-[#EC008C]"
                >
                  1
                </Button>
                <Button 
                  variant="outline"
                  size="icon" 
                  className="w-8 h-8 p-0"
                >
                  2
                </Button>
                <Button 
                  variant="outline"
                  size="icon" 
                  className="w-8 h-8 p-0"
                >
                  3
                </Button>
                <Button 
                  variant="outline"
                  size="icon" 
                  className="w-8 h-8 p-0"
                >
                  &gt;
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Quote */}
      <section className="py-16 bg-pink-50">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-medium mb-4 leading-tight">
            When You Walk Into A Room, <br />Your Dress Should Speak Before You Do.
          </h2>
          <Button className="mt-4 bg-[#EC008C] hover:bg-[#D1007D]">
            + Explore Your Signature Style
          </Button>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4 font-script">Fashiona</h3>
              <p className="text-gray-400 mb-4">
                We believe style is personal, not timeless.<br />
                Every design you see is a reflection of love for craftsmanship, detail, and individuality.
              </p>
              <p className="text-gray-400">
                Thank you for walking this journey with us - one stylish step at a time.
              </p>
              
              {isAdmin && (
                <Link to="/" className="mt-4 inline-block">
                  <Button variant="outline" size="sm" className="bg-transparent border-white hover:bg-white hover:text-gray-900 mt-4">
                    Admin Dashboard
                  </Button>
                </Link>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-bold mb-4">Useful links</h3>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#" className="hover:text-white transition-colors flex items-center"><ChevronRight className="h-3 w-3 mr-1" /> Home</a></li>
                  <li><a href="#" className="hover:text-white transition-colors flex items-center"><ChevronRight className="h-3 w-3 mr-1" /> About us</a></li>
                  <li><a href="#" className="hover:text-white transition-colors flex items-center"><ChevronRight className="h-3 w-3 mr-1" /> Catalog</a></li>
                  <li><a href="#" className="hover:text-white transition-colors flex items-center"><ChevronRight className="h-3 w-3 mr-1" /> Contact</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-bold mb-4">Terms And Policy's</h3>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#" className="hover:text-white transition-colors flex items-center"><ChevronRight className="h-3 w-3 mr-1" /> Shipping policy</a></li>
                  <li><a href="#" className="hover:text-white transition-colors flex items-center"><ChevronRight className="h-3 w-3 mr-1" /> Refund Policy</a></li>
                  <li><a href="#" className="hover:text-white transition-colors flex items-center"><ChevronRight className="h-3 w-3 mr-1" /> Terms of Service</a></li>
                </ul>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">Contact Info</h3>
              <ul className="space-y-4 text-gray-400">
                <li className="flex items-start">
                  <Phone className="h-5 w-5 mr-3 text-[#EC008C] flex-shrink-0" />
                  <span>TEL: +91 93844 09680</span>
                </li>
                <li className="flex items-start">
                  <Mail className="h-5 w-5 mr-3 text-[#EC008C] flex-shrink-0" />
                  <span>EMAIL: @gmail.com</span>
                </li>
                <li className="flex items-start">
                  <MapPin className="h-5 w-5 mr-3 text-[#EC008C] flex-shrink-0" />
                  <span>LOCATION: Pondicherry</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>
              &copy; 2025 Fashiona. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default StoreFront;
