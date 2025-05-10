
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
import { Category } from '@/types/category';
import { getCategories, getSubcategories } from '@/services/categoryService';
import { Skeleton } from '@/components/ui/skeleton';

interface DynamicNavigationProps {
  className?: string;
}

const DynamicNavigation: React.FC<DynamicNavigationProps> = ({ className }) => {
  const location = useLocation();
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchCategoriesData = async () => {
      setLoading(true);
      try {
        // Fetch main categories
        const fetchedCategories = await getCategories();
        setCategories(fetchedCategories);
        
        // Fetch all subcategories
        const fetchedSubcategories = await getSubcategories();
        setSubcategories(fetchedSubcategories);
      } catch (error) {
        console.error('Error fetching navigation data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCategoriesData();
  }, []);
  
  const getSubcategoriesForCategory = (categoryId: string) => {
    return subcategories.filter(subcat => subcat.parentId === categoryId);
  };
  
  const isActiveLink = (path: string) => {
    return location.pathname === path;
  };

  // Create a custom link component for NavigationMenuLink that uses React Router
  const MenuLink = React.forwardRef<
    HTMLAnchorElement,
    React.ComponentPropsWithoutRef<"a"> & { active?: boolean, to: string }
  >(({ className, active, children, to, ...props }, ref) => (
    <Link
      ref={ref}
      to={to}
      className={cn(
        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-pink-50 hover:text-[#EC008C]",
        active && "bg-pink-50 text-[#EC008C]", 
        className
      )}
      {...props}
    >
      {children}
    </Link>
  ));
  MenuLink.displayName = "MenuLink";

  if (loading) {
    return (
      <NavigationMenu className={cn("justify-start", className)}>
        <NavigationMenuList>
          <NavigationMenuItem>
            <Skeleton className="h-8 w-20" />
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Skeleton className="h-8 w-20" />
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Skeleton className="h-8 w-20" />
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    );
  }

  return (
    <NavigationMenu className={cn("justify-start", className)}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink
            asChild
            className={cn(
              "group inline-flex h-10 w-max items-center justify-center px-4 py-2 text-sm font-medium transition-colors hover:text-[#EC008C]",
              isActiveLink("/store") ? "text-[#EC008C] font-medium" : "text-foreground"
            )}
          >
            <Link to="/store">Home</Link>
          </NavigationMenuLink>
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
                      <div className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-pink-50 to-pink-100 p-6 no-underline outline-none focus:shadow-md">
                        <Link to={`/store/categories/${category.slug}`} className="no-underline">
                          <div className="mt-4 mb-2 text-lg font-medium">
                            All {category.name}
                          </div>
                          <p className="text-sm leading-tight text-muted-foreground">
                            Browse all {category.name.toLowerCase()} products
                          </p>
                        </Link>
                      </div>
                      <div className="p-2">
                        {categorySubcats.map((subcategory) => (
                          <MenuLink
                            key={subcategory.id}
                            to={`/store/categories/${category.slug}/${subcategory.slug}`}
                            active={location.pathname === `/store/categories/${category.slug}/${subcategory.slug}`}
                          >
                            <div className="text-sm font-medium">{subcategory.name}</div>
                            <div className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              {subcategory.productsCount} products
                            </div>
                          </MenuLink>
                        ))}
                      </div>
                    </div>
                  </NavigationMenuContent>
                </>
              ) : (
                <NavigationMenuLink
                  asChild
                  className={cn(
                    "group inline-flex h-10 w-max items-center justify-center px-4 py-2 text-sm font-medium transition-colors hover:text-[#EC008C]",
                    location.pathname.includes(`/store/categories/${category.slug}`) ? "text-[#EC008C] font-medium" : "text-foreground"
                  )}
                >
                  <Link to={`/store/categories/${category.slug}`}>
                    {category.name}
                  </Link>
                </NavigationMenuLink>
              )}
            </NavigationMenuItem>
          );
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default DynamicNavigation;
