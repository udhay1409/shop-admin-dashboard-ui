
export type VendorStatus = 'Active' | 'Inactive' | 'On Hold';

export interface Vendor {
  id: string;
  name: string;
  contact_name: string | null;
  email: string | null;
  phone: string | null;
  status: VendorStatus;
  notes: string | null;
  address: any | null;
  created_at: string;
  updated_at: string;
}

export interface VendorFormValues {
  name: string;
  contact_name?: string;
  email?: string;
  phone?: string;
  status: VendorStatus;
  notes?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
}

// Filter options for vendors
export interface VendorFilterOptions {
  status?: VendorStatus;
  createdAfter?: string;
  createdBefore?: string;
}
