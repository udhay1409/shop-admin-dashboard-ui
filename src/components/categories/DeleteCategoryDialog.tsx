
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface DeleteCategoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
  categoryName?: string;
}

const DeleteCategoryDialog: React.FC<DeleteCategoryDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
  categoryName
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to delete this category?</AlertDialogTitle>
          <AlertDialogDescription>
            {categoryName ? (
              <>
                This will permanently delete the category <strong>"{categoryName}"</strong> and 
                cannot be undone. This won't delete the products in this category, but they will no 
                longer be associated with this category.
              </>
            ) : (
              'This action cannot be undone. This won't delete the products in this category, but they will no longer be associated with this category.'
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteCategoryDialog;
