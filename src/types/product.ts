
export type ProductStatus = "Active" | "Draft" | "Inactive";
export type ProductSize = "XS" | "S" | "M" | "L" | "XL" | "XXL" | "3XL" | "One Size" | "Custom";
export type ProductColor = 
  "Red" | "Blue" | "Green" | "Yellow" | "Pink" | "Black" | "White" | 
  "Gray" | "Purple" | "Orange" | "Brown" | "Navy" | "Gold" | "Silver" | "Custom";

export type ProductDimension = {
  length?: number;
  width?: number;
  height?: number;
  unit?: "cm" | "in" | "mm";
};

export type ProductWeight = {
  value?: number;
  unit?: "kg" | "g" | "lb" | "oz";
};

export type ProductShipping = {
  freeShipping?: boolean;
  shippingClass?: string;
  requiresShipping?: boolean;
  dimensionalWeight?: number;
};

export type ProductInventory = {
  sku?: string;
  barcode?: string;
  stockManagement?: boolean;
  lowStockThreshold?: number;
  allowBackorders?: boolean;
  stockStatus?: "In Stock" | "Out of Stock" | "On Backorder" | "Discontinued";
};

export type ProductSEO = {
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  canonicalUrl?: string;
};

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
  bulkDiscountQuantity?: number;
  bulkDiscountPercentage?: number;
  additionalImages?: string[];
  
  // Enhanced properties for versatility
  brand?: string;
  manufacturer?: string;
  manufacturerPartNumber?: string;
  model?: string;
  
  // Digital product properties
  isDigital?: boolean;
  downloadable?: boolean;
  downloadLimit?: number;
  downloadExpiry?: number; // In days
  
  // Physical product properties
  dimensions?: ProductDimension;
  weight?: ProductWeight;
  shipping?: ProductShipping;
  
  // Inventory specific
  inventory?: ProductInventory;
  minOrderQuantity?: number;
  maxOrderQuantity?: number;
  
  // SEO properties
  seo?: ProductSEO;
  
  // Tax properties
  taxable?: boolean;
  taxClass?: string;
  taxRate?: number;
  
  // Related products
  relatedProducts?: string[];
  crossSellProducts?: string[];
  
  // Custom product options
  customizable?: boolean;
  customizationOptions?: Array<{
    name: string;
    required: boolean;
    options: string[];
  }>;
}

export interface ProductFormValues {
  id?: string;
  name: string;
  price: number;
  stock: number;
  status: ProductStatus;
  category: string;
  subcategory?: string;
  image?: string;
  description?: string;
  sku?: string;
  availableSizes?: ProductSize[];
  availableColors?: ProductColor[];
  originalPrice?: number;
  rating?: number;
  reviews?: number;
  isNew?: boolean;
  isSale?: boolean;
  discountPercentage?: number;
  trending?: boolean;
  hotSelling?: boolean;
  bulkDiscountQuantity?: number;
  bulkDiscountPercentage?: number;
  additionalImages?: string[];
  
  // Enhanced properties for the form
  brand?: string;
  manufacturer?: string;
  manufacturerPartNumber?: string;
  model?: string;
  
  // Digital product properties
  isDigital?: boolean;
  downloadable?: boolean;
  downloadLimit?: number;
  downloadExpiry?: number;
  
  // Physical product properties
  dimensions?: ProductDimension;
  weight?: ProductWeight;
  
  // Shipping
  freeShipping?: boolean;
  shippingClass?: string;
  requiresShipping?: boolean;
  
  // Inventory specific
  barcode?: string;
  stockManagement?: boolean;
  lowStockThreshold?: number;
  allowBackorders?: boolean;
  stockStatus?: "In Stock" | "Out of Stock" | "On Backorder" | "Discontinued";
  minOrderQuantity?: number;
  maxOrderQuantity?: number;
  
  // SEO properties
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  canonicalUrl?: string;
  
  // Tax properties
  taxable?: boolean;
  taxClass?: string;
  taxRate?: number;
  
  // Customization
  customizable?: boolean;
  customizationOptions?: Array<{
    name: string;
    required: boolean;
    options: string[];
  }>;
}
