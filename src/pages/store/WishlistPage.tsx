
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import BreadcrumbNav from '@/components/store/BreadcrumbNav';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

// Mock wishlist data
interface WishlistItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  dateAdded: string;
  inStock: boolean;
}

const WishlistPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([
    {
      id: '1',
      productId: 'prod-101',
      name: 'Designer Long Kurthi',
      price: 2499,
      image: '/placeholder.svg',
      dateAdded: '2024-05-01',
      inStock: true,
    },
    {
      id: '2',
      productId: 'prod-102',
      name: 'Anarkali Suit',
      price: 3599,
      image: '/placeholder.svg',
      dateAdded: '2024-05-02',
      inStock: true,
    },
    {
      id: '3',
      productId: 'prod-103',
      name: 'Bridal Lehenga Choli',
      price: 12999,
      image: '/placeholder.svg',
      dateAdded: '2024-05-03',
      inStock: false,
    },
    {
      id: '4',
      productId: 'prod-104',
      name: 'Silk Dupatta',
      price: 1299,
      image: '/placeholder.svg',
      dateAdded: '2024-05-04',
      inStock: true,
    },
  ]);

  const removeFromWishlist = (itemId: string) => {
    if (!user) {
      toast({
        title: 'Login required',
        description: 'Please login to manage your wishlist',
        variant: 'destructive'
      });
      return;
    }
    
    setWishlistItems(wishlistItems.filter(item => item.id !== itemId));
    toast({
      title: 'Item removed',
      description: 'Item has been removed from your wishlist.',
    });
  };

  const addToCart = (item: WishlistItem) => {
    if (!user) {
      toast({
        title: 'Login required',
        description: 'Please login to add items to your cart',
        variant: 'destructive'
      });
      return;
    }
    
    // In a real app, this would add the item to the cart
    toast({
      title: 'Added to cart',
      description: `${item.name} has been added to your cart.`,
    });
  };

  const clearWishlist = () => {
    if (!user) {
      toast({
        title: 'Login required',
        description: 'Please login to manage your wishlist',
        variant: 'destructive'
      });
      return;
    }
    
    setWishlistItems([]);
    toast({
      title: 'Wishlist cleared',
      description: 'All items have been removed from your wishlist.',
    });
  };

  // Show login prompt for non-authenticated users
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12">
        <BreadcrumbNav 
          items={[
            { label: 'Home', href: '/store' },
            { label: 'Wishlist', href: '/store/wishlist' },
          ]}
        />
        
        <div className="mt-6">
          <h1 className="text-2xl font-bold mb-6">Wishlist</h1>
          
          <div className="bg-gray-50 p-6 rounded-lg border mb-6">
            <div className="text-center py-6">
              <Heart className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <h2 className="text-2xl font-bold mb-2">Create Your Wishlist</h2>
              <p className="text-muted-foreground mb-6">Sign in to save your favorite items and access them anytime</p>
              <div className="flex justify-center gap-4">
                <Button asChild className="bg-[#EC008C] hover:bg-[#D1007D]">
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/register">Register</Link>
                </Button>
              </div>
            </div>
          </div>
          
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Popular Items</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlistItems.slice(0, 4).map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <Link to={`/store/product/${item.productId}`} className="block">
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform hover:scale-105"
                      />
                    </div>
                  </Link>
                  <CardContent className="p-4">
                    <Link to={`/store/product/${item.productId}`} className="block">
                      <h3 className="font-medium mb-2 hover:text-[#EC008C] transition-colors line-clamp-2">{item.name}</h3>
                    </Link>
                    <div className="flex justify-between items-center">
                      <p className="font-bold">₹{item.price.toLocaleString()}</p>
                      <p className={item.inStock ? "text-green-600 text-sm" : "text-red-500 text-sm"}>
                        {item.inStock ? 'In Stock' : 'Out of Stock'}
                      </p>
                    </div>
                    <div className="flex mt-4 gap-2">
                      <Button
                        className="flex-1 bg-[#EC008C] hover:bg-[#D1007D]"
                        disabled={!item.inStock}
                        onClick={() => addToCart(item)}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add to Cart
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => removeFromWishlist(item.id)}
                        className="flex-shrink-0"
                      >
                        <Heart className="h-4 w-4 text-[#EC008C]" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <BreadcrumbNav 
        items={[
          { label: 'Home', href: '/store' },
          { label: 'Wishlist', href: '/store/wishlist' },
        ]}
      />

      <div className="mt-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Wishlist</h1>
          {wishlistItems.length > 0 && (
            <Button variant="outline" onClick={clearWishlist} className="text-red-500 border-red-200 hover:bg-red-50">
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          )}
        </div>

        {wishlistItems.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Your Wishlist is Empty</h2>
            <p className="text-muted-foreground mb-6">Add items to your wishlist to save them for later</p>
            <Button asChild className="bg-[#EC008C] hover:bg-[#D1007D]">
              <Link to="/store/categories/all">Continue Shopping</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <Link to={`/store/product/${item.productId}`} className="block">
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform hover:scale-105"
                    />
                  </div>
                </Link>
                <CardContent className="p-4">
                  <Link to={`/store/product/${item.productId}`} className="block">
                    <h3 className="font-medium mb-2 hover:text-[#EC008C] transition-colors line-clamp-2">{item.name}</h3>
                  </Link>
                  <div className="flex justify-between items-center">
                    <p className="font-bold">₹{item.price.toLocaleString()}</p>
                    <p className={item.inStock ? "text-green-600 text-sm" : "text-red-500 text-sm"}>
                      {item.inStock ? 'In Stock' : 'Out of Stock'}
                    </p>
                  </div>
                  <div className="flex mt-4 gap-2">
                    <Button
                      className="flex-1 bg-[#EC008C] hover:bg-[#D1007D]"
                      disabled={!item.inStock}
                      onClick={() => addToCart(item)}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => removeFromWishlist(item.id)}
                      className="flex-shrink-0"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Added on {new Date(item.dateAdded).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
