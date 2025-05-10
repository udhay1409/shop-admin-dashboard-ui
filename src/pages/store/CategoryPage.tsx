
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useStoreFrontProducts } from '@/hooks/useStoreFrontProducts';
import ProductGrid from '@/components/store/ProductGrid';
import BreadcrumbNav from '@/components/store/BreadcrumbNav';
import { Product } from '@/types/product';
import { Skeleton } from '@/components/ui/skeleton';

const CategoryPage = () => {
  const params = useParams<{ categorySlug: string; subcategorySlug?: string }>();
  const categorySlug = params.categorySlug;
  const subcategorySlug = params.subcategorySlug;
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { fetchProductsByCategory } = useStoreFrontProducts();
  const [categoryName, setCategoryName] = useState('');
  const [subcategoryName, setSubcategoryName] = useState('');

  useEffect(() => {
    const formatCategoryName = (slug: string) => {
      // Handle special cases
      if (slug === 'all') return 'All Products';
      if (slug === 'new-arrivals') return 'New Arrivals';
      if (slug === 'sale') return 'Sale Items';
      
      // Convert kebab-case to Title Case
      return slug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    };

    // Set up the page for the current category
    const loadCategory = async () => {
      setLoading(true);
      
      if (!categorySlug) {
        setLoading(false);
        return;
      }
      
      // Format the category name for display
      const formattedCategoryName = formatCategoryName(categorySlug);
      setCategoryName(formattedCategoryName);
      
      if (subcategorySlug) {
        const formattedSubcategoryName = formatCategoryName(subcategorySlug);
        setSubcategoryName(formattedSubcategoryName);
      } else {
        setSubcategoryName('');
      }
      
      try {
        console.log(`Loading products for category: ${categorySlug}${subcategorySlug ? ', subcategory: ' + subcategorySlug : ''}`);
        // If we have a subcategory, we'll try to fetch by that more specific path
        const actualSlug = subcategorySlug || categorySlug;
        const categoryProducts = await fetchProductsByCategory(actualSlug);
        console.log(`Loaded ${categoryProducts.length} products for ${subcategorySlug ? 'subcategory' : 'category'}: ${actualSlug}`);
        setProducts(categoryProducts);
      } catch (error) {
        console.error('Error loading category products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    
    loadCategory();
  }, [categorySlug, subcategorySlug, fetchProductsByCategory]);

  // Prepare breadcrumb items
  const breadcrumbItems = [];
  
  // Always add Home
  breadcrumbItems.push({ label: 'Home', href: '/store' });
  
  // Add category if available
  if (categoryName) {
    breadcrumbItems.push({ 
      label: categoryName, 
      href: `/store/categories/${categorySlug}` 
    });
  }
  
  // Add subcategory if available
  if (subcategoryName) {
    breadcrumbItems.push({ 
      label: subcategoryName, 
      href: `/store/categories/${categorySlug}/${subcategorySlug}`,
      isCurrent: true
    });
  }

  const displayName = subcategoryName || categoryName;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <BreadcrumbNav items={breadcrumbItems} />
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{displayName}</h1>
        <p className="text-gray-600">Discover our collection of {displayName.toLowerCase()} items</p>
      </div>
      
      <ProductGrid
        products={products}
        loading={loading}
        emptyMessage={`No products found in ${displayName}`}
      />
    </div>
  );
};

export default CategoryPage;
