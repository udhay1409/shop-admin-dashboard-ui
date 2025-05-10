import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';
import { Category, CategoryStatus } from '@/types/category';

interface DynamicNavigationProps {
  className?: string;
}

const DynamicNavigation: React.FC<DynamicNavigationProps> = ({ className }) => {
  const location = useLocation();
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Category[]>([]);
  
  useEffect(() => {
    // In a real app, you would fetch these from your API or backend
    // For now, we'll use mock data
    const mockCategories: Category[] = [
      {
        id: "1",
        name: "Kurthi",
        slug: "kurthi",
        description: "Beautiful kurthi collection",
        status: "Active" as CategoryStatus,
        productsCount: 42,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "2",
        name: "Salwar Suits",
        slug: "salwar-suits",
        description: "Elegant salwar suits",
        status: "Active" as CategoryStatus,
        productsCount: 36,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "3",
        name: "Lehenga Cholis",
        slug: "lehenga-cholis",
        description: "Traditional lehenga cholis",
        status: "Active" as CategoryStatus,
        productsCount: 24,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "4",
        name: "Dupattas",
        slug: "dupattas",
        description: "Stylish dupattas collection",
        status: "Active" as CategoryStatus,
        productsCount: 18,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
    
    const mockSubcategories: Category[] = [
      // Kurthi subcategories
      {
        id: "101",
        name: "Long Kurthi",
        slug: "long-kurthi",
        description: "Long Kurthi collection",
        status: "Active" as CategoryStatus,
        productsCount: 24,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        parentId: "1",
      },
      {
        id: "102",
        name: "Short Kurthi",
        slug: "short-kurthi",
        description: "Short Kurthi collection",
        status: "Active" as CategoryStatus,
        productsCount: 18,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        parentId: "1",
      },
      {
        id: "103",
        name: "Designer Kurthi",
        slug: "designer-kurthi",
        description: "Designer Kurthi collection",
        status: "Active" as CategoryStatus,
        productsCount: 14,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        parentId: "1",
      },
      
      // Salwar Suits subcategories
      {
        id: "201",
        name: "Anarkali Suits",
        slug: "anarkali-suits",
        description: "Anarkali Suits collection",
        status: "Active" as CategoryStatus,
        productsCount: 15,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        parentId: "2",
      },
      {
        id: "202",
        name: "Punjabi Suits",
        slug: "punjabi-suits",
        description: "Punjabi Suits collection",
        status: "Active" as CategoryStatus,
        productsCount: 12,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        parentId: "2",
      },
      
      // Lehenga Cholis subcategories
      {
        id: "301",
        name: "Bridal Lehenga",
        slug: "bridal-lehenga",
        description: "Bridal Lehenga collection",
        status: "Active" as CategoryStatus,
        productsCount: 10,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        parentId: "3",
      },
      {
        id: "302",
        name: "Designer Lehenga",
        slug: "designer-lehenga",
        description: "Designer Lehenga collection",
        status: "Active" as CategoryStatus,
        productsCount: 14,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        parentId: "3",
      },
      
      // Dupattas subcategories
      {
        id: "401",
        name: "Silk Dupattas",
        slug: "silk-dupattas",
        description: "Silk Dupattas collection",
        status: "Active" as CategoryStatus,
        productsCount: 8,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        parentId: "4",
      },
      {
        id: "402",
        name: "Cotton Dupattas",
        slug: "cotton-dupattas",
        description: "Cotton Dupattas collection",
        status: "Active" as CategoryStatus,
        productsCount: 10,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        parentId: "4",
      },
    ];
    
    setCategories(mockCategories);
    setSubcategories(mockSubcategories);
  }, []);
  
  const getSubcategoriesForCategory = (categoryId: string) => {
    return subcategories.filter(subcat => subcat.parentId === categoryId);
  };
  
  const isActiveLink = (path: string) => {
    return location.pathname === path;
  };

  return (
    <NavigationMenu className={cn("justify-start", className)}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link to="/store">
            <NavigationMenuLink
              className={cn(
                "group inline-flex h-10 w-max items-center justify-center px-4 py-2 text-sm font-medium transition-colors hover:text-[#EC008C]",
                isActiveLink("/store") ? "text-[#EC008C] font-medium" : "text-foreground"
              )}
            >
              Home
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        
        {categories.map((category) => {
          const categorySubcats = getSubcategoriesForCategory(category.id);
          
          return (
            <NavigationMenuItem key={category.id}>
              {categorySubcats.length > 0 ? (
                <>
                  <NavigationMenuTrigger
                    className={cn(
                      "text-sm hover:text-[#EC008C] transition-colors",
                      location.pathname.includes(`/store/categories/${category.slug}`) ? "text-[#EC008C] font-medium" : ""
                    )}
                  >
                    {category.name}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid w-[400px] gap-3 p-4 md:grid-cols-2">
                      <Link
                        to={`/store/categories/${category.slug}`}
                        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-pink-50 to-pink-100 p-6 no-underline outline-none focus:shadow-md"
                      >
                        <div className="mt-4 mb-2 text-lg font-medium">
                          All {category.name}
                        </div>
                        <p className="text-sm leading-tight text-muted-foreground">
                          Browse all {category.name.toLowerCase()} products
                        </p>
                      </Link>
                      <div className="p-2">
                        {categorySubcats.map((subcategory) => (
                          <Link
                            key={subcategory.id}
                            to={`/store/categories/${category.slug}/${subcategory.slug}`}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-pink-50 hover:text-[#EC008C]"
                          >
                            <div className="text-sm font-medium">{subcategory.name}</div>
                            <div className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              {subcategory.productsCount} products
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </NavigationMenuContent>
                </>
              ) : (
                <Link to={`/store/categories/${category.slug}`}>
                  <NavigationMenuLink
                    className={cn(
                      "group inline-flex h-10 w-max items-center justify-center px-4 py-2 text-sm font-medium transition-colors hover:text-[#EC008C]",
                      location.pathname.includes(`/store/categories/${category.slug}`) ? "text-[#EC008C] font-medium" : "text-foreground"
                    )}
                  >
                    {category.name}
                  </NavigationMenuLink>
                </Link>
              )}
            </NavigationMenuItem>
          );
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default DynamicNavigation;
