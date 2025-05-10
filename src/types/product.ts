
export type ProductStatus = "Active" | "Draft" | "Inactive";
export type ProductSize = "XS" | "S" | "M" | "L" | "XL";
export type ProductColor = "Red" | "Blue" | "Green" | "Yellow" | "Pink" | "Black" | "White";

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  status: ProductStatus;
  category: string;
  image?: string;
  description?: string;
  sku?: string;
  createdAt: string;
  updatedAt: string;
  availableSizes?: ProductSize[];
  availableColors?: ProductColor[];
  originalPrice?: number;
  subcategory?: string;
  rating?: number;
  reviews?: number;
  isNew?: boolean;
  isSale?: boolean;
  discountPercentage?: number;
  trending?: boolean;
  hotSelling?: boolean;
}

export interface ProductFormValues {
  id?: string;
  name: string;
  price: number;
  stock: number;
  status: ProductStatus;
  category: string;
  image?: string;
  description?: string;
  sku?: string;
  availableSizes?: ProductSize[];
  availableColors?: ProductColor[];
  originalPrice?: number;
  subcategory?: string;
  rating?: number;
  reviews?: number;
  isNew?: boolean;
  isSale?: boolean;
  discountPercentage?: number;
  trending?: boolean;
  hotSelling?: boolean;
}
