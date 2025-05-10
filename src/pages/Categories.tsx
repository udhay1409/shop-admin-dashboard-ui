
import React, { useState, useEffect } from 'react';
import { Folder, Grid3X3 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CategoryList from '@/components/categories/CategoryList';
import CategoryDialog from '@/components/categories/CategoryDialog';
import DeleteCategoryDialog from '@/components/categories/DeleteCategoryDialog';
import { Category, CategoryFormValues } from '@/types/category';
import { 
  getCategories, 
  getSubcategories, 
  createCategory,
  updateCategory,
  deleteCategory
} from '@/services/categoryService';
import { useLocation } from 'react-router-dom';

interface LocationState {
  activeTab?: string;
}

const Categories: React.FC = () => {
  const location = useLocation();
  const locationState = location.state as LocationState;
  
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>(locationState?.activeTab || "categories");
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Dialog state
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch categories and subcategories
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      try {
        const categoriesData = await getCategories();
        const subcategoriesData = await getSubcategories();
        
        setCategories(categoriesData);
        setSubcategories(subcategoriesData);
      } catch (error) {
        console.error('Error loading categories data:', error);
        toast({
          title: "Error",
          description: "Failed to load categories. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [toast]);

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
      const isSubcategory = activeTab === "subcategories" || values.parentId;
      
      if (values.id) {
        // Update existing category
        const updatedCategory = await updateCategory(values.id, values);
        
        if (updatedCategory) {
          if (isSubcategory) {
            setSubcategories(prev => prev.map(item => 
              item.id === updatedCategory.id ? updatedCategory : item
            ));
          } else {
            setCategories(prev => prev.map(item => 
              item.id === updatedCategory.id ? updatedCategory : item
            ));
          }
          
          toast({
            title: "Category updated",
            description: `${updatedCategory.name} has been updated successfully.`
          });
          
          setCategoryDialogOpen(false);
        }
      } else {
        // Create new category
        const newCategory = await createCategory(values);
        
        if (newCategory) {
          if (isSubcategory) {
            setSubcategories(prev => [...prev, newCategory]);
          } else {
            setCategories(prev => [...prev, newCategory]);
          }
          
          toast({
            title: "Category created",
            description: `${newCategory.name} has been created successfully.`
          });
          
          setCategoryDialogOpen(false);
        }
      }
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
      const success = await deleteCategory(selectedCategory.id);
      
      if (success) {
        const isSubcategory = activeTab === "subcategories" || selectedCategory.parentId;
        
        if (isSubcategory) {
          setSubcategories(prev => prev.filter(item => item.id !== selectedCategory.id));
        } else {
          setCategories(prev => prev.filter(item => item.id !== selectedCategory.id));
          // Also remove any subcategories that had this category as parent
          setSubcategories(prev => prev.filter(item => item.parentId !== selectedCategory.id));
        }
        
        toast({
          title: "Category deleted",
          description: `${selectedCategory.name} has been deleted.`
        });
        
        setDeleteDialogOpen(false);
      }
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

      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
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
            isLoading={loading}
          />
        </TabsContent>

        <TabsContent value="subcategories">
          <CategoryList
            categories={subcategories}
            onEdit={handleEditCategory}
            onDelete={handleDeleteIntent}
            onAdd={handleAddCategory}
            isLoading={loading}
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
