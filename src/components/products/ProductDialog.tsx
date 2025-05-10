
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

  useEffect(() => {
    if (isOpen) {
      const fetchSubcategories = async () => {
        try {
          // Fetch all subcategories
          const subcategoryList = await getSubcategories();
          setSubcategories(subcategoryList);
        } catch (error) {
          console.error('Error fetching subcategories:', error);
        }
      };
      
      fetchSubcategories();
    }
  }, [isOpen]);

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
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export default ProductDialog;
