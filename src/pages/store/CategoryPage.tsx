
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useStoreFrontProducts } from '@/hooks/useStoreFrontProducts';
import ProductGrid from '@/components/store/ProductGrid';
import BreadcrumbNav from '@/components/store/BreadcrumbNav';
import { Product } from '@/types/product';

const CategoryPage = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { fetchProductsByCategory } = useStoreFrontProducts();
  const [categoryName, setCategoryName] = useState(categorySlug || '');

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
      const formattedName = formatCategoryName(categorySlug);
      setCategoryName(formattedName);
      
      try {
        const categoryProducts = await fetchProductsByCategory(categorySlug);
        setProducts(categoryProducts);
      } catch (error) {
        console.error('Error loading category products:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadCategory();
  }, [categorySlug, fetchProductsByCategory]);

  return (
    <div className="container mx-auto px-4 py-8">
      <BreadcrumbNav 
        items={[
          { label: 'Home', href: '/store' },
          { label: categoryName }
        ]} 
      />
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{categoryName}</h1>
        <p className="text-gray-600">Discover our collection of {categoryName.toLowerCase()} items</p>
      </div>
      
      <ProductGrid
        products={products}
        loading={loading}
        emptyMessage={`No products found in ${categoryName}`}
      />
    </div>
  );
};

export default CategoryPage;
