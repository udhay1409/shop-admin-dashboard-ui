
import { useState, useEffect } from 'react';
import { Product } from '@/types/product';
import { useToast } from '@/hooks/use-toast';
import { getPOSProducts, getPOSCategories, createTransaction } from '@/services/posService';

export interface CartItem {
  product: Product;
  quantity: number;
}

export default function usePOS() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const { toast } = useToast();

  // Calculate totals
  const cartSubtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const taxRate = 0.05; // 5% tax
  const taxAmount = cartSubtotal * taxRate;
  const cartTotal = cartSubtotal + taxAmount;
  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);

  // Load products and categories
  useEffect(() => {
    async function loadPOSData() {
      setLoading(true);
      try {
        const [productsData, categoriesData] = await Promise.all([
          getPOSProducts(),
          getPOSCategories()
        ]);
        
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error loading POS data:', error);
        toast({
          title: 'Failed to load POS data',
          description: 'Please check your connection and try again',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    }
    
    loadPOSData();
  }, [toast]);

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = searchTerm === '' || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === '' || 
      product.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  // Add to cart
  const addToCart = (product: Product) => {
    if (product.stock <= 0) {
      toast({
        title: 'Product out of stock',
        description: 'This item is currently unavailable',
        variant: 'destructive',
      });
      return;
    }

    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id);
      
      if (existingItem) {
        if (existingItem.quantity >= product.stock) {
          toast({
            title: 'Stock limit reached',
            description: `Only ${product.stock} units available`,
            variant: 'destructive',
          });
          return prevCart;
        }
        
        return prevCart.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      } else {
        return [...prevCart, { product, quantity: 1 }];
      }
    });
  };

  // Update item quantity
  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart(prevCart => {
      const item = prevCart.find(item => item.product.id === productId);
      if (!item) return prevCart;

      // Check stock limit
      const product = products.find(p => p.id === productId);
      if (product && quantity > product.stock) {
        toast({
          title: 'Stock limit reached',
          description: `Only ${product.stock} units available`,
          variant: 'destructive',
        });
        return prevCart.map(item => 
          item.product.id === productId 
            ? { ...item, quantity: product.stock } 
            : item
        );
      }
      
      return prevCart.map(item => 
        item.product.id === productId ? { ...item, quantity } : item
      );
    });
  };

  // Remove from cart
  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  };

  // Clear cart
  const clearCart = () => {
    setCart([]);
  };

  // Process transaction
  const processTransaction = async (
    paymentMethod: string,
    customerInfo?: { name?: string; email?: string; phone?: string; address?: string }
  ) => {
    setLoading(true);
    try {
      const result = await createTransaction(
        cart,
        paymentMethod,
        cartSubtotal,
        taxAmount,
        customerInfo
      );

      if (result) {
        clearCart();
        return result;
      }
      return null;
    } catch (error) {
      console.error('Transaction failed:', error);
      toast({
        title: 'Transaction failed',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    products: filteredProducts,
    categories,
    cart,
    loading,
    searchTerm,
    setSearchTerm,
    categoryFilter,
    setCategoryFilter,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    cartSubtotal,
    taxAmount,
    cartTotal,
    cartItemsCount,
    processTransaction
  };
}
