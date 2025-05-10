
export type ReviewStatus = "published" | "pending" | "rejected";

export interface Review {
  id: string;
  productId: string;
  productName: string;
  customerId: string;
  customerName: string;
  rating: number;
  title: string;
  comment: string;
  status: ReviewStatus;
  reportCount?: number;
  helpful?: number;
  createdAt: string;
  updatedAt: string;
  reply?: {
    message: string;
    createdAt: string;
  };
}

export interface ReviewFilterOptions {
  status?: ReviewStatus;
  rating?: number;
  productId?: string;
  dateRange?: {
    from: string;
    to: string;
  };
}
