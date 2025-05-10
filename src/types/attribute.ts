
export interface ProductAttribute {
  id: string;
  name: string;
  displayName: string;
  createdAt: string;
}

export interface ProductAttributeValue {
  id: string;
  attributeId: string;
  productId: string;
  value: string;
  createdAt: string;
}

export interface ProductAttributeWithValues extends ProductAttribute {
  values: string[];
}
