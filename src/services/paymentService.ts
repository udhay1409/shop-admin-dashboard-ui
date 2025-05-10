
import { supabase } from '@/integrations/supabase/client';

export interface PaymentMethod {
  id?: string;
  user_id: string; // Changed from optional to required
  payment_type: 'credit_card' | 'paypal' | 'bank_transfer' | 'other';
  provider: string;
  account_number?: string;
  expiry_date?: string;
  is_default: boolean;
  created_at?: string;
  updated_at?: string;
}

// Get all payment methods for current user
export const getPaymentMethods = async () => {
  const { data, error } = await supabase
    .from('payment_methods')
    .select('*')
    .order('is_default', { ascending: false });

  if (error) {
    throw error;
  }
  
  return data;
};

// Get a specific payment method by ID
export const getPaymentMethodById = async (paymentMethodId: string) => {
  const { data, error } = await supabase
    .from('payment_methods')
    .select('*')
    .eq('id', paymentMethodId)
    .single();

  if (error) {
    throw error;
  }
  
  return data;
};

// Create a new payment method
export const createPaymentMethod = async (paymentData: Omit<PaymentMethod, 'id' | 'created_at' | 'updated_at'>) => {
  // Ensure user_id is set if not provided in the data
  if (!paymentData.user_id) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User must be authenticated to create a payment method");
    paymentData = { ...paymentData, user_id: user.id };
  }
  
  const { data, error } = await supabase
    .from('payment_methods')
    .insert(paymentData)
    .select()
    .single();

  if (error) {
    throw error;
  }
  
  // If this is set as default, update other payment methods
  if (paymentData.is_default) {
    await updateOtherPaymentMethodsDefaultStatus(data.id);
  }
  
  return data;
};

// Update an existing payment method
export const updatePaymentMethod = async (paymentMethodId: string, paymentData: Partial<PaymentMethod>) => {
  // Encrypt sensitive data if needed
  
  const { data, error } = await supabase
    .from('payment_methods')
    .update(paymentData)
    .eq('id', paymentMethodId)
    .select()
    .single();

  if (error) {
    throw error;
  }
  
  // If this is set as default, update other payment methods
  if (paymentData.is_default) {
    await updateOtherPaymentMethodsDefaultStatus(paymentMethodId);
  }
  
  return data;
};

// Delete a payment method
export const deletePaymentMethod = async (paymentMethodId: string) => {
  const { error } = await supabase
    .from('payment_methods')
    .delete()
    .eq('id', paymentMethodId);

  if (error) {
    throw error;
  }
  
  return true;
};

// Helper function to update default status
const updateOtherPaymentMethodsDefaultStatus = async (currentPaymentMethodId: string) => {
  const { error } = await supabase
    .from('payment_methods')
    .update({ is_default: false })
    .neq('id', currentPaymentMethodId);

  if (error) {
    console.error('Error updating other payment methods default status:', error);
  }
};
