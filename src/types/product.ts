
export type ProductStatus = "Active" | "Draft" | "Inactive";

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
}
