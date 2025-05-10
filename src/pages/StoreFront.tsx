
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';

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

const featuredProducts = [
  {
    id: '1',
    name: 'Floral Summer Dress',
    price: 59.99,
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=300&h=450&fit=crop',
    category: 'Dresses',
    isNew: true,
    sale: false
  },
  {
    id: '2',
    name: 'Essential White Blouse',
    price: 34.99,
    image: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=300&h=450&fit=crop',
    category: 'Tops',
    isNew: true,
    sale: false
  },
  {
    id: '3',
    name: 'High-Waisted Jeans',
    price: 49.99,
    originalPrice: 79.99,
    image: 'https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=300&h=450&fit=crop',
    category: 'Bottoms',
    isNew: false,
    sale: true
  },
  {
    id: '4',
    name: 'Oversized Cardigan',
    price: 45.99,
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=300&h=450&fit=crop',
    category: 'Outerwear',
    isNew: false,
    sale: false
  }
];

const StoreFront: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 bg-white border-b z-30">
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
              <h1 className="text-2xl font-bold text-pink-600">Fashiona</h1>
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
          <h1 className="text-xl font-bold text-pink-600">Fashiona</h1>
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
      
      {/* Hero Section */}
      <section className="bg-pink-50 py-16">
        <div className="container mx-auto px-4">
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
      </section>
      
      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">Featured Products</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {featuredProducts.map(product => (
              <div key={product.id} className="group">
                <div className="relative aspect-[3/4] mb-3 overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                  />
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
                <h3 className="font-medium">{product.name}</h3>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-pink-600">${product.price.toFixed(2)}</span>
                  {product.originalPrice && (
                    <span className="text-gray-400 line-through text-sm">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Button>View All Products</Button>
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
                className="relative aspect-square overflow-hidden group"
              >
                <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                  <span className="text-white text-lg font-medium px-4 py-2 border border-white">
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
      
      {/* Newsletter */}
      <section className="py-16 bg-pink-600 text-white">
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
              <h3 className="text-lg font-bold mb-4">Fashiona</h3>
              <p className="text-gray-400">
                Your destination for trendy women's fashion and accessories.
              </p>
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
