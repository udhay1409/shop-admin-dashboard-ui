
export type CouponType = "percentage" | "fixed" | "free_shipping" | "buy_x_get_y";
export type CouponStatus = "active" | "expired" | "scheduled" | "draft";

export interface Coupon {
  id: string;
  code: string;
  type: CouponType;
  value: number;
  minPurchase?: number;
  maxDiscount?: number;
  applicableProducts: "all" | "specific";
  productIds?: string[];
  applicableCategories: "all" | "specific";
  categoryIds?: string[];
  startDate: string;
  endDate: string;
  usageLimit?: number;
  usageCount: number;
  perCustomer?: number;
  status: CouponStatus;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CouponFormValues {
  id?: string;
  code: string;
  type: CouponType;
  value: number;
  minPurchase?: number;
  maxDiscount?: number;
  applicableProducts: "all" | "specific";
  productIds?: string[];
  applicableCategories: "all" | "specific";
  categoryIds?: string[];
  startDate: string;
  endDate: string;
  usageLimit?: number;
  perCustomer?: number;
  description?: string;
}
