
import { useState, useCallback, useEffect } from 'react';
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
      console.log('Fetching products for category slug:', categorySlug);
      
      // Handle special cases
      if (categorySlug === 'all') {
        return fetchAllProducts();
      }
      
      if (categorySlug === 'new-arrivals') {
        const { data, error } = await supabase
          .from('products')
          .select(`
            *,
            category:categories(name)
          `)
          .eq('status', 'Active')
          .eq('is_new', true)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching new arrivals:', error);
          throw error;
        }
        
        return data.map(formatProduct);
      }
      
      if (categorySlug === 'sale') {
        const { data, error } = await supabase
          .from('products')
          .select(`
            *,
            category:categories(name)
          `)
          .eq('status', 'Active')
          .eq('is_sale', true);

        if (error) {
          console.error('Error fetching sale products:', error);
          throw error;
        }
        
        return data.map(formatProduct);
      }
      
      // First try to find the category by slug
      const { data: categoryData, error: categoryError } = await supabase
        .from('categories')
        .select('id, name, slug, parent_id')
        .or(`slug.eq.${categorySlug},name.ilike.%${categorySlug.replace(/-/g, ' ')}%`)
        .maybeSingle();

      if (categoryError) {
        console.error('Error fetching category:', categoryError);
        throw categoryError;
      }

      if (!categoryData) {
        console.error('Category not found for slug:', categorySlug);
        // Try a more flexible search by converting slug to name
        const searchName = categorySlug.replace(/-/g, ' ');
        const { data: flexData, error: flexError } = await supabase
          .from('categories')
          .select('id, name, slug')
          .ilike('name', `%${searchName}%`)
          .limit(1);

        if (flexError || !flexData || flexData.length === 0) {
          console.error('Category not found even with flexible search:', categorySlug);
          return [];
        }

        const foundCategory = flexData[0];
        console.log(`Found category using flexible search:`, foundCategory);

        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select(`
            *,
            category:categories(name)
          `)
          .eq('category_id', foundCategory.id)
          .eq('status', 'Active');

        if (productsError) {
          console.error('Error fetching category products:', productsError);
          throw productsError;
        }

        console.log(`Found ${productsData.length} products for category "${foundCategory.name}"`);
        return productsData.map(formatProduct);
      }

      console.log('Found category:', categoryData);

      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(name)
        `)
        .eq('category_id', categoryData.id)
        .eq('status', 'Active');

      if (productsError) {
        console.error('Error fetching category products:', productsError);
        throw productsError;
      }

      console.log(`Found ${productsData.length} products for category "${categoryData.name}" (ID: ${categoryData.id})`);
      return productsData.map(formatProduct);
    } catch (error) {
      console.error('Error in fetchProductsByCategory:', error);
      toast({
        title: 'Error',
        description: 'Unable to load products. Please try again later.',
        variant: 'destructive',
      });
      return [];
    }
  };

  // Fetch a single product by ID
  const fetchProductById = async (productId: string): Promise<Product | null> => {
    try {
      console.log('Fetching product with ID:', productId);
      
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(name)
        `)
        .eq('id', productId)
        .eq('status', 'Active')
        .maybeSingle();

      if (error) {
        console.error('Error fetching product:', error);
        throw error;
      }

      if (!data) {
        console.error('Product not found for ID:', productId);
        return null;
      }

      console.log('Product found:', data.name);
      return formatProduct(data);
    } catch (error) {
      console.error('Error in fetchProductById:', error);
      toast({
        title: 'Error',
        description: 'Unable to load product details. Please try again later.',
        variant: 'destructive',
      });
      return null;
    }
  };

  // Fetch related products
  const fetchRelatedProducts = async (productId: string, categoryId: string | null): Promise<Product[]> => {
    try {
      if (!categoryId) {
        return [];
      }
      
      console.log(`Fetching related products for product ${productId} in category ${categoryId}`);
      
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(name)
        `)
        .eq('category_id', categoryId)
        .eq('status', 'Active')
        .neq('id', productId)
        .limit(4);

      if (error) {
        console.error('Error fetching related products:', error);
        return [];
      }

      console.log(`Found ${data.length} related products`);
      return data.map(formatProduct);
    } catch (error) {
      console.error('Error in fetchRelatedProducts:', error);
      return [];
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
        .eq('status', 'Active')
        .limit(100);

      if (error) {
        console.error('Error fetching all products:', error);
        throw error;
      }

      console.log(`Fetched ${data.length} total products`);
      return data.map(formatProduct);
    } catch (error) {
      console.error('Error in fetchAllProducts:', error);
      toast({
        title: 'Error',
        description: 'Unable to load products. Please try again later.',
        variant: 'destructive',
      });
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
        throw error;
      }

      console.log(`Found ${data.length} products matching search: "${query}"`);
      return data.map(formatProduct);
    } catch (error) {
      console.error('Error in searchProducts:', error);
      toast({
        title: 'Error',
        description: 'Unable to search products. Please try again later.',
        variant: 'destructive',
      });
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
  const loadFeaturedProducts = useCallback(async () => {
    try {
      console.log('Loading featured products');
      // Get a mix of different product types
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(name)
        `)
        .eq('status', 'Active')
        .limit(8);

      if (error) {
        throw error;
      }

      console.log(`Loaded ${data.length} featured products`);
      setFeaturedProducts(data.map(formatProduct));
    } catch (error) {
      console.error('Error loading featured products:', error);
      toast({
        title: 'Error',
        description: 'Failed to load featured products',
        variant: 'destructive',
      });
      setFeaturedProducts([]);
    }
  }, [toast]);

  // Load new arrivals
  const loadNewArrivals = useCallback(async () => {
    try {
      console.log('Loading new arrivals');
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

      console.log(`Loaded ${data.length} new arrivals`);
      setNewArrivals(data.map(formatProduct));
    } catch (error) {
      console.error('Error loading new arrivals:', error);
      setNewArrivals([]);
    }
  }, []);

  // Load trending products
  const loadTrendingProducts = useCallback(async () => {
    try {
      console.log('Loading trending products');
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

      console.log(`Loaded ${data.length} trending products`);
      setTrendingProducts(data.map(formatProduct));
    } catch (error) {
      console.error('Error loading trending products:', error);
      setTrendingProducts([]);
    }
  }, []);

  // Load hot selling products
  const loadHotSellingProducts = useCallback(async () => {
    try {
      console.log('Loading hot selling products');
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

      console.log(`Loaded ${data.length} hot selling products`);
      setHotSellingProducts(data.map(formatProduct));
    } catch (error) {
      console.error('Error loading hot selling products:', error);
      setHotSellingProducts([]);
    }
  }, []);

  // Load sale products
  const loadSaleProducts = useCallback(async () => {
    try {
      console.log('Loading sale products');
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(name)
        `)
        .eq('status', 'Active')
        .eq('is_sale', true)
        .limit(8);

      if (error) {
        throw error;
      }

      console.log(`Loaded ${data.length} sale products`);
      setSaleProducts(data.map(formatProduct));
    } catch (error) {
      console.error('Error loading sale products:', error);
      setSaleProducts([]);
    }
  }, []);

  // Load all product types at once
  const loadAllProductTypes = useCallback(async () => {
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
      toast({
        title: 'Error',
        description: 'Failed to load products',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [loadFeaturedProducts, loadNewArrivals, loadTrendingProducts, loadHotSellingProducts, loadSaleProducts, toast]);

  // Load data on mount
  useEffect(() => {
    loadAllProductTypes();
  }, [loadAllProductTypes]);

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
    fetchRelatedProducts,
    searchProducts,
    refreshProducts: loadAllProductTypes
  };
}
