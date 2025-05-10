
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import ProductForm from './ProductForm';
import { Product } from '@/types/product';
import { getCategories, getSubcategories } from '@/services/productService';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ProductDialogProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product;
  onSubmit: (values: Partial<Product>) => Promise<void>;
  isSubmitting: boolean;
  categories: string[];
}

const ProductDialog: React.FC<ProductDialogProps> = ({
  isOpen,
  onClose,
  product,
  onSubmit,
  isSubmitting,
  categories
}) => {
  const [subcategories, setSubcategories] = useState<{id: string, name: string}[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Set initial category if product exists
      if (product?.category) {
        setSelectedCategory(product.category);
      }
      
      const fetchSubcategories = async () => {
        try {
          // If we have a specific category selected, fetch subcategories for that category
          const categoryId = selectedCategory ? 
            await getCategoryIdByName(selectedCategory) : undefined;
            
          const subcategoryList = await getSubcategories(categoryId);
          setSubcategories(subcategoryList);
        } catch (error) {
          console.error('Error fetching subcategories:', error);
        }
      };
      
      fetchSubcategories();
    }
  }, [isOpen, selectedCategory, product]);
  
  // Helper function to get category ID by name
  const getCategoryIdByName = async (categoryName: string): Promise<string | undefined> => {
    try {
      const allCategories = await getCategories();
      const category = allCategories.find(cat => cat.name === categoryName);
      return category?.id;
    } catch (error) {
      console.error('Error finding category ID:', error);
      return undefined;
    }
  };
  
  // Handle category change to update subcategories accordingly
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{product ? 'Edit Product' : 'Add New Product'}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[80vh] pr-4">
          <ProductForm
            product={product}
            onSubmit={onSubmit}
            onCancel={onClose}
            isSubmitting={isSubmitting}
            categories={categories}
            subcategories={subcategories}
            onCategoryChange={handleCategoryChange}
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export default ProductDialog;
