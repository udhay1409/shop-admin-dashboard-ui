
import React, { useState } from 'react';
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

// Mock data for the reviews
const mockReviews: Review[] = [
  {
    id: "1",
    productId: "p1",
    productName: "Elegant Summer Dress",
    customerId: "c1",
    customerName: "Jane Smith",
    rating: 5,
    title: "Absolutely love this dress!",
    comment: "This dress is perfect for summer. The fabric is breathable and the fit is exactly as described. I've received so many compliments!",
    status: "published",
    helpful: 12,
    createdAt: "2025-04-28T14:12:00Z",
    updatedAt: "2025-04-28T14:12:00Z"
  },
  {
    id: "2",
    productId: "p2",
    productName: "Classic Denim Jacket",
    customerId: "c2",
    customerName: "Michael Johnson",
    rating: 4,
    title: "Great jacket, slightly large",
    comment: "Quality material and stylish design. Just a bit bigger than I expected.",
    status: "published",
    helpful: 5,
    createdAt: "2025-04-25T09:30:00Z",
    updatedAt: "2025-04-25T09:30:00Z"
  },
  {
    id: "3",
    productId: "p3",
    productName: "Leather Ankle Boots",
    customerId: "c3",
    customerName: "Emily Davis",
    rating: 2,
    title: "Disappointed with quality",
    comment: "These boots started falling apart after just two weeks of normal use. The stitching came undone and the sole is already separating.",
    status: "pending",
    reportCount: 1,
    createdAt: "2025-05-01T16:45:00Z",
    updatedAt: "2025-05-01T16:45:00Z"
  },
  {
    id: "4",
    productId: "p4",
    productName: "Silk Blouse",
    customerId: "c4",
    customerName: "Sarah Williams",
    rating: 5,
    title: "Elegant and high quality",
    comment: "This blouse is absolutely stunning. The silk is high quality and it drapes beautifully. Worth every penny!",
    status: "published",
    helpful: 18,
    createdAt: "2025-04-20T11:23:00Z",
    updatedAt: "2025-04-20T11:23:00Z",
    reply: {
      message: "Thank you for your kind words! We're glad you're enjoying your purchase.",
      createdAt: "2025-04-21T09:15:00Z"
    }
  },
  {
    id: "5",
    productId: "p1",
    productName: "Elegant Summer Dress",
    customerId: "c5",
    customerName: "Anna Brown",
    rating: 1,
    title: "Terrible quality",
    comment: "The dress arrived with loose threads and a broken zipper. Very disappointed with the quality for the price.",
    status: "rejected",
    reportCount: 0,
    createdAt: "2025-05-03T13:17:00Z",
    updatedAt: "2025-05-04T10:22:00Z"
  }
];

const Reviews: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<ReviewStatus | "all">("all");
  const [ratingFilter, setRatingFilter] = useState<string>("all");
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const [sortField, setSortField] = useState<"date" | "rating">("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  
  // Filter and sort reviews
  const filteredReviews = mockReviews.filter(review => {
    // Status filter
    if (statusFilter !== "all" && review.status !== statusFilter) return false;
    
    // Rating filter
    if (ratingFilter !== "all" && Number(ratingFilter) !== review.rating) return false;
    
    // Search term
    const searchLower = searchTerm.toLowerCase();
    return (
      review.customerName.toLowerCase().includes(searchLower) ||
      review.productName.toLowerCase().includes(searchLower) ||
      review.title.toLowerCase().includes(searchLower) ||
      review.comment.toLowerCase().includes(searchLower)
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

  const handleSaveReply = (reviewId: string, replyText: string) => {
    console.log(`Reply to review ${reviewId}: ${replyText}`);
    // In a real app, you would save the reply to the backend here
    setIsReplyOpen(false);
  };

  const handleStatusChange = (reviewId: string, newStatus: ReviewStatus) => {
    console.log(`Changed status of review ${reviewId} to ${newStatus}`);
    // In a real app, you would update the status in the backend
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

      <ReviewStats reviews={mockReviews} />
      
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
