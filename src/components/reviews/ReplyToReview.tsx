
import React, { useState, useEffect } from 'react';
import { Review } from '@/types/review';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ReplyToReviewProps {
  review: Review;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (reviewId: string, replyText: string) => void;
}

export const ReplyToReview: React.FC<ReplyToReviewProps> = ({
  review,
  open,
  onOpenChange,
  onSave,
}) => {
  const [replyText, setReplyText] = useState("");
  
  useEffect(() => {
    // Pre-populate the reply text if there's an existing reply
    if (review.reply) {
      setReplyText(review.reply.message);
    } else {
      setReplyText("");
    }
  }, [review]);

  const handleSave = () => {
    if (replyText.trim()) {
      onSave(review.id, replyText);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {review.reply ? 'Edit Reply' : 'Reply to Review'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="p-4 bg-muted/30 rounded-lg">
            <div className="font-medium">{review.customerName} wrote:</div>
            <div className="mt-1 italic">"{review.comment}"</div>
          </div>
          
          <div>
            <label htmlFor="reply" className="block text-sm font-medium mb-1">
              Your Response
            </label>
            <Textarea
              id="reply"
              placeholder="Type your reply here..."
              rows={5}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="resize-none"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!replyText.trim()}>
            {review.reply ? 'Update Reply' : 'Post Reply'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
