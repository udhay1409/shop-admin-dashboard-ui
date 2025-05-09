
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import CategoryForm from './CategoryForm';
import { Category, CategoryFormValues } from '@/types/category';

interface CategoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  category?: Category;
  parentCategories: Category[];
  onSubmit: (values: CategoryFormValues) => Promise<void>;
  isSubmitting: boolean;
  isSubcategory?: boolean;
}

const CategoryDialog: React.FC<CategoryDialogProps> = ({
  isOpen,
  onClose,
  category,
  parentCategories,
  onSubmit,
  isSubmitting,
  isSubcategory = false
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{category ? 'Edit Category' : 'Add New Category'}</DialogTitle>
        </DialogHeader>
        <CategoryForm
          category={category}
          parentCategories={parentCategories}
          onSubmit={onSubmit}
          onCancel={onClose}
          isSubmitting={isSubmitting}
          isSubcategory={isSubcategory}
        />
      </DialogContent>
    </Dialog>
  );
}

export default CategoryDialog;
