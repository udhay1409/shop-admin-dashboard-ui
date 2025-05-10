
import React from 'react';
import { Star, StarHalf, MessageCircle, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { Review, ReviewStatus } from '@/types/review';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ReviewDetailsProps {
  review: Review;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReply: () => void;
  onStatusChange: (status: ReviewStatus) => void;
}

export const ReviewDetails: React.FC<ReviewDetailsProps> = ({ 
  review, 
  open, 
  onOpenChange,
  onReply,
  onStatusChange,
}) => {
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<Star key={i} size={18} className="fill-yellow-400 text-yellow-400" />);
      } else if (i - 0.5 <= rating) {
        stars.push(<StarHalf key={i} size={18} className="fill-yellow-400 text-yellow-400" />);
      } else {
        stars.push(<Star key={i} size={18} className="text-gray-300" />);
      }
    }
    return <div className="flex">{stars}</div>;
  };

  const getStatusBadge = (status: ReviewStatus) => {
    switch (status) {
      case "published":
        return <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">Published</Badge>;
      case "pending":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-700 border-yellow-200">Pending</Badge>;
      case "rejected":
        return <Badge variant="outline" className="bg-red-100 text-red-700 border-red-200">Rejected</Badge>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Review Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">{review.productName}</h3>
              <p className="text-sm text-muted-foreground">
                {format(new Date(review.createdAt), 'MMMM dd, yyyy')}
              </p>
            </div>
            <div>
              {getStatusBadge(review.status)}
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-lg font-medium">
                {review.customerName.charAt(0)}
              </div>
              <div className="ml-2">
                <p className="font-medium">{review.customerName}</p>
                {renderStars(review.rating)}
              </div>
            </div>
            {review.reportCount && review.reportCount > 0 ? (
              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-100 flex items-center gap-1">
                <AlertCircle size={14} />
                {review.reportCount} {review.reportCount === 1 ? 'Report' : 'Reports'}
              </Badge>
            ) : null}
          </div>
          
          <div className="bg-muted/30 p-4 rounded-lg">
            <h4 className="font-medium text-lg">{review.title}</h4>
            <p className="mt-2 text-gray-700">{review.comment}</p>
            
            {review.helpful !== undefined && (
              <div className="mt-2 text-sm text-muted-foreground">
                {review.helpful} {review.helpful === 1 ? 'customer' : 'customers'} found this helpful
              </div>
            )}
          </div>
          
          {review.reply && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mt-2">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <MessageCircle size={16} className="text-blue-700" />
                </div>
                <div className="ml-2">
                  <p className="font-medium text-blue-900">Store Response</p>
                  <p className="text-xs text-blue-700">
                    {format(new Date(review.reply.createdAt), 'MMMM dd, yyyy')}
                  </p>
                </div>
              </div>
              <p className="mt-2 text-blue-800">{review.reply.message}</p>
            </div>
          )}
        </div>
        
        <DialogFooter className="flex justify-between items-center">
          <div className="flex gap-2">
            {review.status !== "published" && (
              <Button onClick={() => onStatusChange("published")} variant="outline" className="bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800 border-green-200">
                Approve
              </Button>
            )}
            {review.status !== "rejected" && (
              <Button onClick={() => onStatusChange("rejected")} variant="outline" className="bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-800 border-red-200">
                Reject
              </Button>
            )}
          </div>
          <Button onClick={onReply} className="flex items-center gap-1">
            <MessageCircle size={16} />
            {review.reply ? 'Edit Reply' : 'Reply'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
