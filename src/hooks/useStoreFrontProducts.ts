
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@/types/product';
import { supabase } from '@/integrations/supabase/client';

export function useStoreFrontProducts() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [hotSellingProducts, setHotSellingProducts] = useState<Product[]>([]);
  const [saleProducts, setSaleProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch products by category
  const fetchProductsByCategory = async (categorySlug: string): Promise<Product[]> => {
    try {
      const { data: categoryData } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', categorySlug)
        .single();

      if (!categoryData) return [];

      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(name)
        `)
        .eq('category_id', categoryData.id)
        .eq('status', 'Active');

      if (error) {
        console.error('Error fetching category products:', error);
        return [];
      }

      return data.map(formatProduct);
    } catch (error) {
      console.error('Error in fetchProductsByCategory:', error);
      return [];
    }
  };

  // Fetch a single product by ID
  const fetchProductById = async (productId: string): Promise<Product | null> => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(name)
        `)
        .eq('id', productId)
        .eq('status', 'Active')
        .single();

      if (error) {
        console.error('Error fetching product:', error);
        return null;
      }

      return formatProduct(data);
    } catch (error) {
      console.error('Error in fetchProductById:', error);
      return null;
    }
  };

  // Fetch all products
  const fetchAllProducts = async (): Promise<Product[]> => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(name)
        `)
        .eq('status', 'Active');

      if (error) {
        console.error('Error fetching all products:', error);
        return [];
      }

      return data.map(formatProduct);
    } catch (error) {
      console.error('Error in fetchAllProducts:', error);
      return [];
    }
  };

  // Search products
  const searchProducts = async (query: string): Promise<Product[]> => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(name)
        `)
        .eq('status', 'Active')
        .ilike('name', `%${query}%`);

      if (error) {
        console.error('Error searching products:', error);
        return [];
      }

      return data.map(formatProduct);
    } catch (error) {
      console.error('Error in searchProducts:', error);
      return [];
    }
  };

  // Helper function to format product data
  const formatProduct = (item: any): Product => ({
    id: item.id,
    name: item.name,
    price: Number(item.price),
    stock: item.stock,
    status: item.status,
    category: item.category?.name || 'Uncategorized',
    image: item.image_url,
    description: item.description || '',
    sku: item.sku || '',
    createdAt: item.created_at,
    updatedAt: item.updated_at,
    originalPrice: item.original_price ? Number(item.original_price) : undefined,
    discountPercentage: item.discount_percentage ? Number(item.discount_percentage) : undefined,
    isNew: item.is_new,
    isSale: item.is_sale,
    trending: item.trending,
    hotSelling: item.hot_selling
  });

  // Load featured products
  const loadFeaturedProducts = async () => {
    setLoading(true);
    try {
      // Get a mix of different product types
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(name)
        `)
        .eq('status', 'Active')
        .or('is_new.eq.true,trending.eq.true,hot_selling.eq.true')
        .limit(8);

      if (error) {
        throw error;
      }

      setFeaturedProducts(data.map(formatProduct));
    } catch (error) {
      console.error('Error loading featured products:', error);
      toast({
        title: 'Error',
        description: 'Failed to load featured products',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Load new arrivals
  const loadNewArrivals = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(name)
        `)
        .eq('status', 'Active')
        .eq('is_new', true)
        .order('created_at', { ascending: false })
        .limit(8);

      if (error) {
        throw error;
      }

      setNewArrivals(data.map(formatProduct));
    } catch (error) {
      console.error('Error loading new arrivals:', error);
    }
  };

  // Load trending products
  const loadTrendingProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(name)
        `)
        .eq('status', 'Active')
        .eq('trending', true)
        .limit(8);

      if (error) {
        throw error;
      }

      setTrendingProducts(data.map(formatProduct));
    } catch (error) {
      console.error('Error loading trending products:', error);
    }
  };

  // Load hot selling products
  const loadHotSellingProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(name)
        `)
        .eq('status', 'Active')
        .eq('hot_selling', true)
        .limit(8);

      if (error) {
        throw error;
      }

      setHotSellingProducts(data.map(formatProduct));
    } catch (error) {
      console.error('Error loading hot selling products:', error);
    }
  };

  // Load sale products
  const loadSaleProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(name)
        `)
        .eq('status', 'Active')
        .eq('is_sale', true)
        .not('discount_percentage', 'is', null)
        .limit(8);

      if (error) {
        throw error;
      }

      setSaleProducts(data.map(formatProduct));
    } catch (error) {
      console.error('Error loading sale products:', error);
    }
  };

  // Load all product types at once
  const loadAllProductTypes = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadFeaturedProducts(),
        loadNewArrivals(),
        loadTrendingProducts(),
        loadHotSellingProducts(),
        loadSaleProducts()
      ]);
    } catch (error) {
      console.error('Error loading product types:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load data on mount
  useEffect(() => {
    loadAllProductTypes();
  }, []);

  return {
    featuredProducts,
    newArrivals,
    trendingProducts,
    hotSellingProducts,
    saleProducts,
    loading,
    fetchProductsByCategory,
    fetchProductById,
    fetchAllProducts,
    searchProducts,
    refreshProducts: loadAllProductTypes
  };
}
