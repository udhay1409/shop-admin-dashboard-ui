
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import ProductForm from './ProductForm';
import { Product } from '@/types/product';
import { getSubcategories } from '@/services/productService';

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

  useEffect(() => {
    if (isOpen && product?.category) {
      const fetchSubcategories = async () => {
        try {
          // Find the category ID from the categories list
          const categoryObj = await getSubcategories();
          setSubcategories(categoryObj);
        } catch (error) {
          console.error('Error fetching subcategories:', error);
        }
      };
      
      fetchSubcategories();
    }
  }, [isOpen, product]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{product ? 'Edit Product' : 'Add New Product'}</DialogTitle>
        </DialogHeader>
        <ProductForm
          product={product}
          onSubmit={onSubmit}
          onCancel={onClose}
          isSubmitting={isSubmitting}
          categories={categories}
        />
      </DialogContent>
    </Dialog>
  );
}

export default ProductDialog;
