
import React, { useState, useEffect } from 'react';
import { 
  Search,
  Filter, 
  Star, 
  StarHalf,
  ChevronDown,
  ChevronUp,
  MessageCircle
} from 'lucide-react';
import { format } from 'date-fns';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ReviewStatus, Review } from '@/types/review';
import { ReviewDetails } from '@/components/reviews/ReviewDetails';
import { ReplyToReview } from '@/components/reviews/ReplyToReview';
import { ReviewStats } from '@/components/reviews/ReviewStats';
import { getReviews, saveReviewReply, updateReviewStatus } from '@/services/reviewService';
import { useToast } from '@/hooks/use-toast';

const Reviews: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<ReviewStatus | "all">("all");
  const [ratingFilter, setRatingFilter] = useState<string>("all");
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const [sortField, setSortField] = useState<"date" | "rating">("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const data = await getReviews();
        setReviews(data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
        toast({
          title: 'Error',
          description: 'Failed to load reviews',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchReviews();
  }, [toast]);

  // Filter and sort reviews
  const filteredReviews = reviews.filter(review => {
    // Status filter
    if (statusFilter !== "all" && review.status !== statusFilter) return false;
    
    // Rating filter
    if (ratingFilter !== "all" && Number(ratingFilter) !== review.rating) return false;
    
    // Search term
    const searchLower = searchTerm.toLowerCase();
    return (
      review.customerName.toLowerCase().includes(searchLower) ||
      review.productName.toLowerCase().includes(searchLower) ||
      (review.title && review.title.toLowerCase().includes(searchLower)) ||
      (review.comment && review.comment.toLowerCase().includes(searchLower))
    );
  }).sort((a, b) => {
    if (sortField === "date") {
      return sortDirection === "asc" 
        ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else {
      return sortDirection === "asc" 
        ? a.rating - b.rating 
        : b.rating - a.rating;
    }
  });

  // Toggle sort direction
  const toggleSort = (field: "date" | "rating") => {
    if (sortField === field) {
      setSortDirection(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const handleOpenReply = (review: Review) => {
    setSelectedReview(review);
    setIsReplyOpen(true);
  };

  const handleSaveReply = async (reviewId: string, replyText: string) => {
    try {
      await saveReviewReply(reviewId, replyText);
      toast({
        title: 'Reply Saved',
        description: 'Your reply has been saved successfully',
      });
      
      // Refresh the reviews list
      const updatedReviews = await getReviews();
      setReviews(updatedReviews);
      setIsReplyOpen(false);
    } catch (error) {
      console.error('Error saving reply:', error);
      toast({
        title: 'Error',
        description: 'Failed to save your reply',
        variant: 'destructive',
      });
    }
  };

  const handleStatusChange = async (reviewId: string, newStatus: ReviewStatus) => {
    try {
      await updateReviewStatus(reviewId, newStatus);
      toast({
        title: 'Status Updated',
        description: `Review status has been changed to ${newStatus}`,
      });
      
      // Update the reviews list
      const updatedReviews = await getReviews();
      setReviews(updatedReviews);
    } catch (error) {
      console.error('Error updating review status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update review status',
        variant: 'destructive',
      });
    }
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

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />);
      } else if (i - 0.5 <= rating) {
        stars.push(<StarHalf key={i} size={16} className="fill-yellow-400 text-yellow-400" />);
      } else {
        stars.push(<Star key={i} size={16} className="text-gray-300" />);
      }
    }
    return <div className="flex">{stars}</div>;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Customer Reviews</h1>
        <div className="flex items-center gap-2">
          <Input
            type="search"
            placeholder="Search reviews..."
            className="max-w-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <ReviewStats reviews={reviews} />
      
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle>Reviews</CardTitle>
            <div className="flex gap-2">
              <Select 
                value={statusFilter} 
                onValueChange={(value) => setStatusFilter(value as ReviewStatus | "all")}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              
              <Select 
                value={ratingFilter} 
                onValueChange={setRatingFilter}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ratings</SelectItem>
                  <SelectItem value="5">5 Stars</SelectItem>
                  <SelectItem value="4">4 Stars</SelectItem>
                  <SelectItem value="3">3 Stars</SelectItem>
                  <SelectItem value="2">2 Stars</SelectItem>
                  <SelectItem value="1">1 Star</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <CardDescription>
            Manage customer reviews for your products
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#EC008C] border-t-transparent"></div>
            </div>
          ) : (
            <div className="rounded-md border">
              <div className="bg-muted/50 p-4 grid grid-cols-12 font-medium text-sm">
                <div className="col-span-3">
                  <button 
                    onClick={() => toggleSort("date")}
                    className="inline-flex items-center hover:text-foreground"
                  >
                    Date
                    {sortField === "date" ? (
                      sortDirection === "asc" ? (
                        <ChevronUp className="ml-1 h-4 w-4" />
                      ) : (
                        <ChevronDown className="ml-1 h-4 w-4" />
                      )
                    ) : null}
                  </button>
                </div>
                <div className="col-span-2">
                  <button 
                    onClick={() => toggleSort("rating")}
                    className="inline-flex items-center hover:text-foreground"
                  >
                    Rating
                    {sortField === "rating" ? (
                      sortDirection === "asc" ? (
                        <ChevronUp className="ml-1 h-4 w-4" />
                      ) : (
                        <ChevronDown className="ml-1 h-4 w-4" />
                      )
                    ) : null}
                  </button>
                </div>
                <div className="col-span-3">Product</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-2 text-right">Actions</div>
              </div>
              {filteredReviews.length > 0 ? (
                <div>
                  {filteredReviews.map((review) => (
                    <div 
                      key={review.id} 
                      className="grid grid-cols-12 p-4 items-center border-t"
                    >
                      <div className="col-span-3">
                        <div>{format(new Date(review.createdAt), 'MMM dd, yyyy')}</div>
                        <div className="text-sm text-muted-foreground">{review.customerName}</div>
                      </div>
                      <div className="col-span-2">
                        {renderStars(review.rating)}
                      </div>
                      <div className="col-span-3">
                        <div className="font-medium">{review.productName}</div>
                        <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                          {review.title}
                        </div>
                      </div>
                      <div className="col-span-2">
                        {getStatusBadge(review.status)}
                      </div>
                      <div className="col-span-2 text-right space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedReview(review)}
                        >
                          View
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                              <span className="sr-only">Actions</span>
                              <ChevronDown className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleOpenReply(review)}>
                              <MessageCircle className="mr-2 h-4 w-4" />
                              Reply
                            </DropdownMenuItem>
                            {review.status !== "published" && (
                              <DropdownMenuItem onClick={() => handleStatusChange(review.id, "published")}>
                                Approve
                              </DropdownMenuItem>
                            )}
                            {review.status !== "rejected" && (
                              <DropdownMenuItem onClick={() => handleStatusChange(review.id, "rejected")}>
                                Reject
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-muted-foreground">
                  No reviews match your filters
                </div>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </CardFooter>
      </Card>

      {selectedReview && (
        <ReviewDetails 
          review={selectedReview} 
          open={!!selectedReview} 
          onOpenChange={() => setSelectedReview(null)}
          onReply={() => handleOpenReply(selectedReview)}
          onStatusChange={(status) => handleStatusChange(selectedReview.id, status)}
        />
      )}

      {selectedReview && (
        <ReplyToReview
          review={selectedReview}
          open={isReplyOpen}
          onOpenChange={setIsReplyOpen}
          onSave={handleSaveReply}
        />
      )}
    </div>
  );
};

export default Reviews;
