
import React from 'react';
import { Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Review } from '@/types/review';

interface ReviewStatsProps {
  reviews: Review[];
}

export const ReviewStats: React.FC<ReviewStatsProps> = ({ reviews }) => {
  const totalReviews = reviews.length;
  const avgRating = totalReviews > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
    : 0;
  
  const publishedCount = reviews.filter(review => review.status === "published").length;
  const pendingCount = reviews.filter(review => review.status === "pending").length;
  const rejectedCount = reviews.filter(review => review.status === "rejected").length;
  
  // Rating distribution
  const ratings = [5, 4, 3, 2, 1].map(rating => {
    const count = reviews.filter(review => review.rating === rating).length;
    const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
    return { rating, count, percentage };
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Review Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="flex flex-col">
              <span className="text-3xl font-bold">{totalReviews}</span>
              <span className="text-sm text-muted-foreground">Total Reviews</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center justify-center">
                <span className="text-3xl font-bold mr-1">{avgRating.toFixed(1)}</span>
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              </div>
              <span className="text-sm text-muted-foreground">Average Rating</span>
            </div>
            <div className="flex flex-col">
              <div className="text-3xl font-bold">
                {totalReviews > 0 ? ((publishedCount / totalReviews) * 100).toFixed(0) : 0}%
              </div>
              <span className="text-sm text-muted-foreground">Approval Rate</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4 text-center text-sm">
            <div className="p-2 bg-green-50 rounded-md">
              <div className="font-medium text-green-700">{publishedCount}</div>
              <div className="text-green-600">Published</div>
            </div>
            <div className="p-2 bg-yellow-50 rounded-md">
              <div className="font-medium text-yellow-700">{pendingCount}</div>
              <div className="text-yellow-600">Pending</div>
            </div>
            <div className="p-2 bg-red-50 rounded-md">
              <div className="font-medium text-red-700">{rejectedCount}</div>
              <div className="text-red-600">Rejected</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Rating Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {ratings.map(({ rating, count, percentage }) => (
              <div key={rating} className="flex items-center">
                <div className="w-12 text-sm flex items-center">
                  <span>{rating}</span>
                  <Star className="h-3 w-3 ml-1 fill-yellow-400 text-yellow-400" />
                </div>
                <div className="flex-1 h-4 mx-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-yellow-400 rounded-full" 
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <div className="w-12 text-right text-sm text-muted-foreground">
                  {count}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
