
import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Ticket } from "lucide-react";

interface DeleteCouponDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  couponId: string;
  couponCode: string;
  onDelete: (id: string) => void;
}

const DeleteCouponDialog = ({
  open,
  onOpenChange,
  couponId,
  couponCode,
  onDelete,
}: DeleteCouponDialogProps) => {
  const handleDelete = () => {
    onDelete(couponId);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-2 text-destructive">
            <Ticket className="h-5 w-5" />
            <AlertDialogTitle>Delete Coupon</AlertDialogTitle>
          </div>
          <AlertDialogDescription>
            Are you sure you want to delete the coupon <span className="font-semibold">{couponCode}</span>?
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteCouponDialog;
