
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import BreadcrumbNav from '@/components/store/BreadcrumbNav';
import useProductInventory from '@/hooks/useProductInventory';
import { Category } from '@/types/category';

const CategoryPage: React.FC = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const { products } = useProductInventory();
  const [category, setCategory] = useState<Category | null>(null);
  const [subcategories, setSubcategories] = useState<Category[]>([]);

  // Simulating fetching category details and subcategories
  // In a real app, you would fetch this from your backend
  useEffect(() => {
    // Simulate fetching category by slug
    const formattedSlug = categorySlug?.toLowerCase();
    
    // Mock data for demonstration purposes
    const mockCategories: Category[] = [
      {
        id: '1',
        name: 'Kurthi',
        slug: 'kurthi',
        description: 'Beautiful kurthi collection',
        status: 'Active',
        productsCount: 42,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        color: '#EC008C',
      },
      {
        id: '2',
        name: 'Salwar Suits',
        slug: 'salwar-suits',
        description: 'Elegant salwar suits',
        status: 'Active',
        productsCount: 36,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        color: '#EC008C',
      }
    ];
    
    const foundCategory = mockCategories.find(cat => cat.slug === formattedSlug);
    setCategory(foundCategory || null);
    
    // Simulate fetching subcategories
    const mockSubcategories: Category[] = [
      {
        id: '101',
        name: 'Long Kurthi',
        slug: 'long-kurthi',
        description: 'Long Kurthi collection',
        status: 'Active',
        productsCount: 24,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        parentId: '1',
        color: '#EC008C',
      },
      {
        id: '102',
        name: 'Short Kurthi',
        slug: 'short-kurthi',
        description: 'Short Kurthi collection',
        status: 'Active',
        productsCount: 18,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        parentId: '1',
        color: '#EC008C',
      },
      {
        id: '201',
        name: 'Anarkali Suits',
        slug: 'anarkali-suits',
        description: 'Anarkali Suits collection',
        status: 'Active',
        productsCount: 15,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        parentId: '2',
        color: '#EC008C',
      }
    ];
    
    // Filter subcategories by parent category
    if (foundCategory) {
      const relevantSubcategories = mockSubcategories.filter(
        subcat => subcat.parentId === foundCategory.id
      );
      setSubcategories(relevantSubcategories);
    }
  }, [categorySlug]);

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
                    <div className="w-full h-full bg-pink-100 flex items-center justify-center">
                      <h3 className="text-xl font-medium text-[#EC008C]">{subcat.name}</h3>
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
