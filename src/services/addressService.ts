
import { supabase } from '@/integrations/supabase/client';

export interface UserAddress {
  id?: string;
  user_id: string; // Changed from optional to required
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  is_default: boolean;
  address_type: 'shipping' | 'billing' | 'both';
  created_at?: string;
  updated_at?: string;
}

// Get all addresses for current user
export const getUserAddresses = async () => {
  const { data, error } = await supabase
    .from('user_addresses')
    .select('*')
    .order('is_default', { ascending: false });

  if (error) {
    throw error;
  }
  
  return data;
};

// Get a specific address by ID
export const getAddressById = async (addressId: string) => {
  const { data, error } = await supabase
    .from('user_addresses')
    .select('*')
    .eq('id', addressId)
    .single();

  if (error) {
    throw error;
  }
  
  return data;
};

// Create a new address
export const createAddress = async (addressData: Omit<UserAddress, 'id' | 'created_at' | 'updated_at'>) => {
  // Ensure user_id is set if not provided in the data
  if (!addressData.user_id) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User must be authenticated to create an address");
    addressData = { ...addressData, user_id: user.id };
  }

  const { data, error } = await supabase
    .from('user_addresses')
    .insert(addressData)
    .select()
    .single();

  if (error) {
    throw error;
  }
  
  // If this is set as default, update other addresses
  if (addressData.is_default) {
    await updateOtherAddressesDefaultStatus(data.id);
  }
  
  return data;
};

// Update an existing address
export const updateAddress = async (addressId: string, addressData: Partial<UserAddress>) => {
  const { data, error } = await supabase
    .from('user_addresses')
    .update(addressData)
    .eq('id', addressId)
    .select()
    .single();

  if (error) {
    throw error;
  }
  
  // If this is set as default, update other addresses
  if (addressData.is_default) {
    await updateOtherAddressesDefaultStatus(addressId);
  }
  
  return data;
};

// Delete an address
export const deleteAddress = async (addressId: string) => {
  const { error } = await supabase
    .from('user_addresses')
    .delete()
    .eq('id', addressId);

  if (error) {
    throw error;
  }
  
  return true;
};

// Helper function to update default status
const updateOtherAddressesDefaultStatus = async (currentAddressId: string) => {
  const { error } = await supabase
    .from('user_addresses')
    .update({ is_default: false })
    .neq('id', currentAddressId);

  if (error) {
    console.error('Error updating other addresses default status:', error);
  }
};
