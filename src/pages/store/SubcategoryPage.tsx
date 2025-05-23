import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Badge } from '@/components/ui/badge';
import BreadcrumbNav from '@/components/store/BreadcrumbNav';
import useProductInventory from '@/hooks/useProductInventory';
import { Product, ProductColor, ProductSize } from '@/types/product';
import { Category } from '@/types/category';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

const SubcategoryPage: React.FC = () => {
  const { categorySlug, subcategorySlug } = useParams<{ categorySlug: string, subcategorySlug: string }>();
  const { products } = useProductInventory();
  const [category, setCategory] = useState<Category | null>(null);
  const [subcategory, setSubcategory] = useState<Category | null>(null);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch category and subcategory details
  useEffect(() => {
    const fetchCategoryData = async () => {
      setLoading(true);
      
      try {
        // Fetch parent category by slug
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
        
        // Format parent category
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
          color: '#EC008C', // Default color if not provided by the database
        };
        
        setCategory(formattedCategory);
        
        // Fetch subcategory by slug and parent relationship
        const { data: subcategoryData, error: subcategoryError } = await supabase
          .from('categories')
          .select('*')
          .eq('slug', subcategorySlug)
          .eq('parent_id', formattedCategory.id)
          .single();
          
        if (subcategoryError || !subcategoryData) {
          console.error('Error fetching subcategory:', subcategoryError);
          setLoading(false);
          return;
        }
        
        // Format subcategory
        const formattedSubcategory: Category = {
          id: subcategoryData.id,
          name: subcategoryData.name,
          slug: subcategoryData.slug,
          description: subcategoryData.description || '',
          status: subcategoryData.status as Category['status'],
          imageUrl: subcategoryData.image_url,
          productsCount: subcategoryData.products_count || 0,
          createdAt: subcategoryData.created_at,
          updatedAt: subcategoryData.updated_at,
          parentId: subcategoryData.parent_id,
          color: '#EC008C', // Default color if not provided by the database
        };
        
        setSubcategory(formattedSubcategory);
        
        // Filter products
        // In a real app with proper relationships, you would use a join to get products by category_id
        // For now, filter products from the useProductInventory hook by matching subcategory name
        const subcategoryProducts = products
          .filter(p => p.status === 'Active')
          .filter(p => 
            p.subcategory === formattedSubcategory.name || 
            p.category === formattedSubcategory.name
          )
          .map(enhanceProduct)
          .slice(0, 12);
          
        setFilteredProducts(subcategoryProducts);
      } catch (error) {
        console.error('Error in subcategory page:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (categorySlug && subcategorySlug) {
      fetchCategoryData();
    }
  }, [categorySlug, subcategorySlug, products]);
  
  // Helper function to enhance product with additional properties for display
  const enhanceProduct = (product: Product): Product => {
    return {
      ...product,
      rating: product.rating || Math.floor(Math.random() * 5) + 1,
      reviews: product.reviews || Math.floor(Math.random() * 100),
      isNew: product.isNew !== undefined ? product.isNew : 
        new Date(product.createdAt).getTime() > Date.now() - (30 * 24 * 60 * 60 * 1000),
      isSale: product.isSale !== undefined ? product.isSale : Math.random() > 0.7,
      discountPercentage: product.discountPercentage || Math.floor(Math.random() * 50) + 10,
      availableColors: product.availableColors || 
        ['Red', 'Blue', 'Green', 'Black', 'White'].slice(0, Math.floor(Math.random() * 5) + 1) as ProductColor[],
      availableSizes: product.availableSizes || 
        ['XS', 'S', 'M', 'L', 'XL'].slice(0, Math.floor(Math.random() * 5) + 1) as ProductSize[],
      image: product.image || 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=300&h=400&fit=crop',
    };
  };
  
  const formatPrice = (price: number) => `$${price.toFixed(2)}`;

  const renderStarRating = (rating: number) => {
    return (
      <div className="flex items-center">
        {Array(5).fill(0).map((_, i) => (
          <svg 
            key={i} 
            className={`w-3 h-3 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`} 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="ml-1 text-xs text-gray-500">({rating})</span>
      </div>
    );
  };

  const renderProductCard = (product: Product) => {
    return (
      <Card key={product.id} className="group overflow-hidden border shadow-sm hover:shadow-md transition-all duration-200">
        <div className="relative">
          <AspectRatio ratio={3/4}>
            <Link to={`/store/product/${product.id}`}>
              <img 
                src={product.image} 
                alt={product.name}
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
              />
            </Link>
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
          <div className="text-gray-500 text-xs mb-1">{product.subcategory || product.category}</div>
          <Link to={`/store/product/${product.id}`}>
            <h3 className="font-medium line-clamp-1 hover:text-[#EC008C]">{product.name}</h3>
          </Link>
          <div className="mt-1">{renderStarRating(product.rating || 4)}</div>
          <div className="flex items-center gap-2 mt-1">
            <span className="font-semibold text-[#EC008C]">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="text-gray-400 line-through text-sm">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
          <div className="mt-2 flex space-x-1">
            {(product.availableColors || []).slice(0, 4).map((color) => (
              <span 
                key={color} 
                className={`inline-block w-3 h-3 rounded-full border border-gray-200 ${
                  color === 'Red' ? 'bg-red-500' :
                  color === 'Blue' ? 'bg-blue-500' :
                  color === 'Green' ? 'bg-green-500' :
                  color === 'Yellow' ? 'bg-yellow-500' :
                  color === 'Pink' ? 'bg-pink-500' :
                  color === 'Black' ? 'bg-black' : 'bg-white'
                }`}
              ></span>
            ))}
          </div>
          <div className="mt-3 flex justify-between items-center">
            <div className="flex gap-1">
              {(product.availableSizes || []).slice(0, 3).map((size) => (
                <span key={size} className="inline-block text-xs border px-1 rounded">{size}</span>
              ))}
              {(product.availableSizes || []).length > 3 && <span className="text-xs">+{(product.availableSizes || []).length - 3}</span>}
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 rounded-full border-[#EC008C] text-[#EC008C] hover:bg-[#EC008C] hover:text-white"
            >
              <ShoppingCart className="h-3 w-3 mr-1" /> Add
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-4">
        <Skeleton className="h-6 w-72 mb-4" />
        <Skeleton className="h-12 w-full mb-6" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {Array(8).fill(0).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-56 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!category || !subcategory) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold mb-6">Category or subcategory not found</h1>
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
          { label: category.name, href: `/store/categories/${category.slug}` },
          { label: subcategory.name, href: `/store/categories/${category.slug}/${subcategory.slug}`, isCurrent: true }
        ]} 
      />
      
      <h1 className="text-3xl font-bold mb-2">{subcategory.name}</h1>
      <p className="text-gray-600 mb-8">{subcategory.description}</p>
      
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filteredProducts.map(product => renderProductCard(product))}
        </div>
      ) : (
        <div className="py-12 text-center">
          <p className="text-lg text-gray-500 mb-4">No products found in this subcategory.</p>
          <Button asChild variant="outline">
            <Link to="/store">Continue Shopping</Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default SubcategoryPage;
