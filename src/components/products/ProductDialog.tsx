
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import ProductForm from './ProductForm';
import { Product } from '@/types/product';

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
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl">
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
