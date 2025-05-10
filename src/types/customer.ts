
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
  emailSubscription?: boolean; // Whether customer has subscribed to marketing emails
  lastEmailSent?: string; // Date of last email sent
}

export interface CustomerFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface EmailPreferences {
  marketing: boolean;
  orderUpdates: boolean;
  productUpdates: boolean;
}
