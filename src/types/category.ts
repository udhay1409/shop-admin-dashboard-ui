
export type CategoryStatus = "Active" | "Inactive" | "Draft";

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  status: CategoryStatus;
  imageUrl?: string;
  productsCount: number;
  createdAt: string;
  updatedAt: string;
  parentId?: string;
  color?: string;
};

export type CategoryFormValues = {
  id?: string;
  name: string;
  description: string;
  status: CategoryStatus;
  imageUrl?: string;
  parentId?: string;
  color?: string;
};
