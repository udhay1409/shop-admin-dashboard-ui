
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
  // New fields for enhanced contact management
  company?: string; 
  tags?: string[];
  assignedTo?: string;
  contactHistory?: ContactHistoryEntry[];
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

export interface ContactHistoryEntry {
  id: string;
  type: 'email' | 'call' | 'meeting' | 'note';
  date: string;
  description: string;
  createdBy?: string;
}

// Filter options for contacts
export interface ContactFilterOptions {
  status?: CustomerStatus;
  joinedAfter?: string;
  joinedBefore?: string;
  hasOrders?: boolean;
  tags?: string[];
}
