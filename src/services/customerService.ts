
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Customer, CustomerStatus, ContactFilterOptions } from '@/types/customer';

// Fetch all customers
export async function getCustomers(filters?: ContactFilterOptions): Promise<Customer[]> {
  let query = supabase
    .from('profiles')
    .select(`
      id,
      first_name,
      last_name,
      email,
      phone,
      created_at
    `)
    .order('created_at', { ascending: false });

  // Apply filters if provided
  if (filters) {
    if (filters.status) {
      // This would require a status column in your profiles table
      // query = query.eq('status', filters.status);
    }
    
    if (filters.joinedAfter) {
      query = query.gte('created_at', filters.joinedAfter);
    }
    
    if (filters.joinedBefore) {
      query = query.lte('created_at', filters.joinedBefore);
    }
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching customers:', error);
    toast({
      title: 'Failed to load customers',
      description: error.message,
      variant: 'destructive',
    });
    return [];
  }

  // Transform the data to match our Customer interface
  return data.map(profile => {
    // Generate a customer name from first_name and last_name
    const name = `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Unknown';
    
    // In a real implementation, you would fetch this data from related tables
    // For now, we'll use placeholder data
    return {
      id: profile.id,
      name,
      email: profile.email || '',
      phone: profile.phone,
      status: 'Active' as CustomerStatus, // Default to active for demo
      joinedDate: profile.created_at,
      lastLoginDate: null, // Would come from auth.users table in a real implementation
      totalOrders: Math.floor(Math.random() * 10), // Placeholder
      totalSpent: Math.random() * 1000, // Placeholder
    };
  });
}

// Get a single customer by ID
export async function getCustomerById(id: string): Promise<Customer | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select(`
      id,
      first_name,
      last_name,
      email,
      phone,
      created_at
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching customer:', error);
    toast({
      title: 'Failed to load customer',
      description: error.message,
      variant: 'destructive',
    });
    return null;
  }

  if (!data) return null;

  // Transform to Customer type
  return {
    id: data.id,
    name: `${data.first_name || ''} ${data.last_name || ''}`.trim() || 'Unknown',
    email: data.email || '',
    phone: data.phone,
    status: 'Active' as CustomerStatus,
    joinedDate: data.created_at,
    lastLoginDate: null,
    totalOrders: Math.floor(Math.random() * 10), // Placeholder
    totalSpent: Math.random() * 1000, // Placeholder
  };
}

// Update customer details
export async function updateCustomer(id: string, data: Partial<Customer>): Promise<boolean> {
  // Map our Customer type to the profiles table schema
  const { error } = await supabase
    .from('profiles')
    .update({
      first_name: data.name?.split(' ')[0],
      last_name: data.name?.includes(' ') ? data.name.split(' ').slice(1).join(' ') : '',
      email: data.email,
      phone: data.phone,
      updated_at: new Date().toISOString()
    })
    .eq('id', id);

  if (error) {
    console.error('Error updating customer:', error);
    toast({
      title: 'Failed to update customer',
      description: error.message,
      variant: 'destructive',
    });
    return false;
  }

  toast({
    title: 'Customer updated',
    description: 'The customer details have been updated successfully.'
  });
  
  return true;
}

// Delete a customer (soft delete in a real app)
export async function deleteCustomer(id: string): Promise<boolean> {
  // In a real app, you might want to soft delete or check if deletion is allowed
  const { error } = await supabase
    .from('profiles')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting customer:', error);
    toast({
      title: 'Failed to delete customer',
      description: error.message,
      variant: 'destructive',
    });
    return false;
  }

  toast({
    title: 'Customer deleted',
    description: 'The customer has been removed successfully.'
  });
  
  return true;
}

// Get customer stats
export async function getCustomerStats(): Promise<{
  total: number;
  active: number;
  newThisMonth: number;
}> {
  const { count: total, error: countError } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true });

  if (countError) {
    console.error('Error counting customers:', countError);
    return { total: 0, active: 0, newThisMonth: 0 };
  }

  // Get current month's first day
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  
  const { count: newThisMonth, error: newError } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', firstDayOfMonth);

  if (newError) {
    console.error('Error counting new customers:', newError);
    return { total: total || 0, active: total || 0, newThisMonth: 0 };
  }

  return { 
    total: total || 0,
    active: total || 0, // Assuming all customers are active by default
    newThisMonth: newThisMonth || 0 
  };
}
