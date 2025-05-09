
export type CustomerStatus = 'Active' | 'Inactive' | 'Pending';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  status: CustomerStatus;
  joinedDate: string;
  lastLoginDate: string | null;
  totalOrders: number;
  totalSpent: number;
  address?: string;
  notes?: string;
}

export interface CustomerFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}
