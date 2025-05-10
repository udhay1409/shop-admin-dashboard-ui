
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface Vendor {
  id: string;
  name: string;
  contact_name: string | null;
  email: string | null;
  phone: string | null;
  status: string;
  notes: string | null;
  address: any | null;
  created_at: string;
  updated_at: string;
}

// Fetch all vendors
export async function getVendors(): Promise<Vendor[]> {
  const { data, error } = await supabase
    .from('vendors')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching vendors:', error);
    toast({
      title: 'Failed to load vendors',
      description: error.message,
      variant: 'destructive',
    });
    return [];
  }

  return data || [];
}

// Get a single vendor by ID
export async function getVendorById(id: string): Promise<Vendor | null> {
  const { data, error } = await supabase
    .from('vendors')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching vendor:', error);
    toast({
      title: 'Failed to load vendor',
      description: error.message,
      variant: 'destructive',
    });
    return null;
  }

  return data;
}

// Create a new vendor
export async function createVendor(vendor: Omit<Vendor, 'id' | 'created_at' | 'updated_at'>): Promise<Vendor | null> {
  const { data, error } = await supabase
    .from('vendors')
    .insert([{ ...vendor }])
    .select()
    .single();

  if (error) {
    console.error('Error creating vendor:', error);
    toast({
      title: 'Failed to create vendor',
      description: error.message,
      variant: 'destructive',
    });
    return null;
  }

  toast({
    title: 'Vendor created',
    description: 'New vendor has been added successfully.'
  });
  
  return data;
}

// Update vendor details
export async function updateVendor(id: string, updates: Partial<Vendor>): Promise<boolean> {
  const { error } = await supabase
    .from('vendors')
    .update({ 
      ...updates, 
      updated_at: new Date().toISOString() 
    })
    .eq('id', id);

  if (error) {
    console.error('Error updating vendor:', error);
    toast({
      title: 'Failed to update vendor',
      description: error.message,
      variant: 'destructive',
    });
    return false;
  }

  toast({
    title: 'Vendor updated',
    description: 'Vendor details have been updated successfully.'
  });
  
  return true;
}

// Delete a vendor
export async function deleteVendor(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('vendors')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting vendor:', error);
    toast({
      title: 'Failed to delete vendor',
      description: error.message,
      variant: 'destructive',
    });
    return false;
  }

  toast({
    title: 'Vendor deleted',
    description: 'The vendor has been removed successfully.'
  });
  
  return true;
}

// Get vendor stats
export async function getVendorStats(): Promise<{
  total: number;
  active: number;
  newThisMonth: number;
}> {
  const { count: total, error: countError } = await supabase
    .from('vendors')
    .select('*', { count: 'exact', head: true });

  if (countError) {
    console.error('Error counting vendors:', countError);
    return { total: 0, active: 0, newThisMonth: 0 };
  }

  const { count: active, error: activeError } = await supabase
    .from('vendors')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'Active');

  if (activeError) {
    console.error('Error counting active vendors:', activeError);
    return { total: total || 0, active: 0, newThisMonth: 0 };
  }

  // Get current month's first day
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  
  const { count: newThisMonth, error: newError } = await supabase
    .from('vendors')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', firstDayOfMonth);

  if (newError) {
    console.error('Error counting new vendors:', newError);
    return { total: total || 0, active: active || 0, newThisMonth: 0 };
  }

  return { 
    total: total || 0,
    active: active || 0,
    newThisMonth: newThisMonth || 0 
  };
}
