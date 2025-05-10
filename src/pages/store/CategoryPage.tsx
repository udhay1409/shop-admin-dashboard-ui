
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import BreadcrumbNav from '@/components/store/BreadcrumbNav';
import useProductInventory from '@/hooks/useProductInventory';
import { Category } from '@/types/category';
import { getSubcategories } from '@/services/categoryService';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

const CategoryPage: React.FC = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const { products } = useProductInventory();
  const [category, setCategory] = useState<Category | null>(null);
  const [subcategories, setSubcategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Fetch category details and subcategories
  useEffect(() => {
    const fetchCategoryData = async () => {
      setLoading(true);
      
      try {
        // Fetch category by slug
        const { data: categoryData, error: categoryError } = await supabase
          .from('categories')
          .select('*')
          .eq('slug', categorySlug)
          .single();
          
        if (categoryError || !categoryData) {
          console.error('Error fetching category:', categoryError);
          setLoading(false);
          return;
        }
        
        // Transform the category data
        const formattedCategory: Category = {
          id: categoryData.id,
          name: categoryData.name,
          slug: categoryData.slug,
          description: categoryData.description || '',
          status: categoryData.status as Category['status'],
          imageUrl: categoryData.image_url,
          productsCount: categoryData.products_count || 0,
          createdAt: categoryData.created_at,
          updatedAt: categoryData.updated_at,
          parentId: categoryData.parent_id,
          color: categoryData.color || '#EC008C',
        };
        
        setCategory(formattedCategory);
        
        // Fetch subcategories for the current category
        const subcats = await getSubcategories(formattedCategory.id);
        setSubcategories(subcats);
      } catch (error) {
        console.error('Error in category page:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (categorySlug) {
      fetchCategoryData();
    }
  }, [categorySlug]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-4">
        <Skeleton className="h-6 w-72 mb-4" />
        <Skeleton className="h-12 w-full mb-6" />
        <Skeleton className="h-6 w-48 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold mb-6">Category not found</h1>
        <Link to="/store">
          <Button>Return to Home</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-4">
      <BreadcrumbNav 
        items={[
          { label: category.name, href: `/store/categories/${category.slug}`, isCurrent: true }
        ]} 
      />
      
      <h1 className="text-3xl font-bold mb-6">{category.name}</h1>
      <p className="text-gray-600 mb-8">{category.description}</p>
      
      {subcategories.length > 0 ? (
        <>
          <h2 className="text-2xl font-semibold mb-4">Browse Subcategories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {subcategories.map(subcat => (
              <Link key={subcat.id} to={`/store/categories/${category.slug}/${subcat.slug}`}>
                <Card className="hover:shadow-lg transition-shadow duration-300">
                  <AspectRatio ratio={16/9}>
                    <div 
                      className="w-full h-full flex items-center justify-center"
                      style={{ backgroundColor: subcat.color ? `${subcat.color}15` : '#f9e0f0' }}
                    >
                      <h3 
                        className="text-xl font-medium"
                        style={{ color: subcat.color || '#EC008C' }}
                      >
                        {subcat.name}
                      </h3>
                    </div>
                  </AspectRatio>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <p>{subcat.description}</p>
                      <span className="text-sm text-gray-500">{subcat.productsCount} products</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </>
      ) : (
        <p>No subcategories found.</p>
      )}
    </div>
  );
};

export default CategoryPage;
