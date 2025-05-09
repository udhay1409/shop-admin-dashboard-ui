
import React, { useState } from 'react';
import { Folder, Grid3X3 } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CategoryList from '@/components/categories/CategoryList';
import CategoryDialog from '@/components/categories/CategoryDialog';
import DeleteCategoryDialog from '@/components/categories/DeleteCategoryDialog';
import { Category, CategoryFormValues } from '@/types/category';

// Mock data for the initial implementation
const MOCK_CATEGORIES: Category[] = [
  {
    id: '1',
    name: 'Clothing',
    slug: 'clothing',
    description: 'All clothing items',
    status: 'Active',
    productsCount: 42,
    createdAt: new Date(2023, 1, 15).toISOString(),
    updatedAt: new Date(2023, 5, 10).toISOString(),
    color: '#9b87f5'
  },
  {
    id: '2',
    name: 'Electronics',
    slug: 'electronics',
    description: 'Electronic gadgets and accessories',
    status: 'Active',
    productsCount: 26,
    createdAt: new Date(2023, 2, 5).toISOString(),
    updatedAt: new Date(2023, 6, 20).toISOString(),
    color: '#0EA5E9'
  },
  {
    id: '3',
    name: 'Home & Kitchen',
    slug: 'home-kitchen',
    description: 'Home decor and kitchen appliances',
    status: 'Active',
    productsCount: 35,
    createdAt: new Date(2023, 3, 12).toISOString(),
    updatedAt: new Date(2023, 7, 5).toISOString(),
    color: '#F97316'
  },
  {
    id: '4',
    name: 'Beauty',
    slug: 'beauty',
    description: 'Beauty products and cosmetics',
    status: 'Draft',
    productsCount: 18,
    createdAt: new Date(2023, 4, 8).toISOString(),
    updatedAt: new Date(2023, 8, 15).toISOString(),
    color: '#D946EF'
  }
];

const MOCK_SUBCATEGORIES: Category[] = [
  {
    id: '5',
    name: "Men's Wear",
    slug: 'mens-wear',
    description: 'Clothing for men',
    status: 'Active',
    productsCount: 24,
    createdAt: new Date(2023, 1, 20).toISOString(),
    updatedAt: new Date(2023, 5, 15).toISOString(),
    parentId: '1',
    color: '#8B5CF6'
  },
  {
    id: '6',
    name: "Women's Wear",
    slug: 'womens-wear',
    description: 'Clothing for women',
    status: 'Active',
    productsCount: 18,
    createdAt: new Date(2023, 1, 22).toISOString(),
    updatedAt: new Date(2023, 5, 18).toISOString(),
    parentId: '1',
    color: '#EC4899'
  },
  {
    id: '7',
    name: 'Laptops',
    slug: 'laptops',
    description: 'Laptop computers',
    status: 'Active',
    productsCount: 12,
    createdAt: new Date(2023, 2, 10).toISOString(),
    updatedAt: new Date(2023, 6, 25).toISOString(),
    parentId: '2',
    color: '#3B82F6'
  },
  {
    id: '8',
    name: 'Cookware',
    slug: 'cookware',
    description: 'Pots, pans and cooking utensils',
    status: 'Inactive',
    productsCount: 15,
    createdAt: new Date(2023, 3, 15).toISOString(),
    updatedAt: new Date(2023, 7, 10).toISOString(),
    parentId: '3',
    color: '#F59E0B'
  }
];

const Categories: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("categories");
  const [categories, setCategories] = useState<Category[]>(MOCK_CATEGORIES);
  const [subcategories, setSubcategories] = useState<Category[]>(MOCK_SUBCATEGORIES);

  // Dialog state
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // For generating simple slugs
  const generateSlug = (name: string): string => {
    return name.toLowerCase().replace(/\s+/g, '-');
  };

  const handleAddCategory = () => {
    setSelectedCategory(undefined);
    setCategoryDialogOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category);
    setCategoryDialogOpen(true);
  };

  const handleDeleteIntent = (category: Category) => {
    setSelectedCategory(category);
    setDeleteDialogOpen(true);
  };

  const handleCreateOrUpdateCategory = async (values: CategoryFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Convert 'none' to undefined for parentId
      if (values.parentId === 'none') {
        values.parentId = undefined;
      }
      
      const isSubcategory = activeTab === "subcategories" || values.parentId;
      const currentList = isSubcategory ? subcategories : categories;
      const setCurrentList = isSubcategory ? setSubcategories : setCategories;
      
      if (values.id) {
        // Update existing category
        const updatedList = currentList.map(item => 
          item.id === values.id 
            ? {
                ...item,
                ...values,
                slug: generateSlug(values.name),
                updatedAt: new Date().toISOString()
              } 
            : item
        );
        
        setCurrentList(updatedList);
        toast({
          title: "Category updated",
          description: `${values.name} has been updated successfully.`
        });
      } else {
        // Create new category
        const newCategory: Category = {
          id: Math.random().toString(36).substring(2, 9),
          ...values,
          slug: generateSlug(values.name),
          productsCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        setCurrentList([...currentList, newCategory]);
        toast({
          title: "Category created",
          description: `${values.name} has been created successfully.`
        });
      }
      
      setCategoryDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem saving the category.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCategory = async () => {
    if (!selectedCategory) return;
    
    setIsDeleting(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const isSubcategory = activeTab === "subcategories" || selectedCategory.parentId;
      const currentList = isSubcategory ? subcategories : categories;
      const setCurrentList = isSubcategory ? setSubcategories : setCategories;
      
      const filteredList = currentList.filter(item => item.id !== selectedCategory.id);
      setCurrentList(filteredList);
      
      toast({
        title: "Category deleted",
        description: `${selectedCategory.name} has been deleted.`
      });
      
      setDeleteDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem deleting the category.",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
      setSelectedCategory(undefined);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Categories</h1>
        <p className="text-muted-foreground">
          Manage your product categories and subcategories
        </p>
      </div>

      <Tabs defaultValue="categories" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="categories" className="gap-2">
            <Folder className="h-4 w-4" />
            Categories
          </TabsTrigger>
          <TabsTrigger value="subcategories" className="gap-2">
            <Grid3X3 className="h-4 w-4" />
            Subcategories
          </TabsTrigger>
        </TabsList>

        <TabsContent value="categories">
          <CategoryList
            categories={categories}
            onEdit={handleEditCategory}
            onDelete={handleDeleteIntent}
            onAdd={handleAddCategory}
          />
        </TabsContent>

        <TabsContent value="subcategories">
          <CategoryList
            categories={subcategories}
            onEdit={handleEditCategory}
            onDelete={handleDeleteIntent}
            onAdd={handleAddCategory}
          />
        </TabsContent>
      </Tabs>

      {/* Category Dialog */}
      <CategoryDialog
        isOpen={categoryDialogOpen}
        onClose={() => setCategoryDialogOpen(false)}
        category={selectedCategory}
        parentCategories={categories}
        onSubmit={handleCreateOrUpdateCategory}
        isSubmitting={isSubmitting}
        isSubcategory={activeTab === "subcategories"}
      />

      {/* Delete Dialog */}
      <DeleteCategoryDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteCategory}
        isDeleting={isDeleting}
        categoryName={selectedCategory?.name}
      />
    </div>
  );
};

export default Categories;
