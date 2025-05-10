
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import ProductForm from './ProductForm';
import { Product } from '@/types/product';
import { getCategories, getSubcategories } from '@/services/categoryService';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useProductAttributes } from '@/hooks/useProductAttributes';
import { ProductAttributeWithValues } from '@/types/attribute';
import { Category } from '@/types/category';

interface ProductDialogProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product;
  onSubmit: (values: Partial<Product>, attributes?: Array<{ attributeId: string, values: string[] }>) => Promise<void>;
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
  const { getProductAttributes } = useProductAttributes();
  const [productAttributes, setProductAttributes] = useState<ProductAttributeWithValues[]>([]);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Fetch all categories when dialog opens
      const fetchAllCategories = async () => {
        setLoading(true);
        try {
          const categoriesData = await getCategories();
          setAllCategories(categoriesData);
        } catch (error) {
          console.error('Error fetching categories:', error);
        } finally {
          setLoading(false);
        }
      };
      
      fetchAllCategories();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && product?.id) {
      // Fetch product attributes if product exists
      const fetchProductAttributes = async () => {
        try {
          const attributes = await getProductAttributes(product.id);
          setProductAttributes(attributes);
        } catch (error) {
          console.error('Error fetching product attributes:', error);
        }
      };
      
      fetchProductAttributes();
    } else {
      // Reset attributes when adding a new product
      setProductAttributes([]);
    }
  }, [isOpen, product, getProductAttributes]);

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
      const foundCategory = allCategories.find(cat => cat.name === categoryName);
      return foundCategory?.id;
    } catch (error) {
      console.error('Error finding category ID:', error);
      return undefined;
    }
  };
  
  // Handle category change to update subcategories accordingly
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  // Convert categories from the database to string array for the form
  const categoryOptions = allCategories.map(category => category.name);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-5xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{product ? 'Edit Product' : 'Add New Product'}</DialogTitle>
          <DialogDescription>
            {product 
              ? 'Update the product information below.' 
              : 'Fill out the form below to add a new product to your inventory.'}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[80vh] pr-4">
          <ProductForm
            product={product}
            onSubmit={onSubmit}
            onCancel={onClose}
            isSubmitting={isSubmitting}
            categories={categoryOptions}
            subcategories={subcategories}
            onCategoryChange={handleCategoryChange}
            initialAttributes={productAttributes}
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export default ProductDialog;
