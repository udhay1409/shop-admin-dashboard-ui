
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

export type CategoryFormValues = Omit<Category, "id" | "productsCount" | "createdAt" | "updatedAt" | "slug"> & {
  id?: string;
};
