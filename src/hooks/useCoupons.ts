
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Coupon } from '@/types/coupon';
import { supabase } from '@/integrations/supabase/client';

export function useCoupons() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { toast } = useToast();

  // Fetch coupons from Supabase
  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('coupon_codes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      // Transform the data to match our Coupon type
      const formattedCoupons: Coupon[] = data.map((coupon: any) => ({
        id: coupon.id,
        code: coupon.code,
        type: coupon.type as any,
        value: coupon.value,
        minPurchase: coupon.min_purchase || undefined,
        maxDiscount: coupon.max_discount || undefined,
        applicableProducts: coupon.applicable_products || 'all',
        productIds: [], // Would need a separate query to get these
        applicableCategories: coupon.applicable_categories || 'all',
        categoryIds: [], // Would need a separate query to get these
        startDate: coupon.start_date,
        endDate: coupon.end_date,
        usageLimit: coupon.usage_limit,
        usageCount: coupon.usage_count || 0,
        perCustomer: coupon.per_customer,
        status: coupon.status as any,
        description: coupon.description,
        createdAt: coupon.created_at,
        updatedAt: coupon.updated_at,
      }));

      setCoupons(formattedCoupons);
    } catch (error: any) {
      console.error('Error fetching coupons:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch coupons: ' + error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Refresh coupons
  const refreshCoupons = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  useEffect(() => {
    fetchCoupons();
  }, [refreshTrigger]);

  // Create a new coupon
  const createCoupon = async (couponData: Omit<Coupon, 'id' | 'createdAt' | 'updatedAt' | 'usageCount'>) => {
    try {
      // Transform our Coupon type to match Supabase table structure
      const { data, error } = await supabase
        .from('coupon_codes')
        .insert({
          code: couponData.code,
          type: couponData.type,
          value: couponData.value,
          min_purchase: couponData.minPurchase,
          max_discount: couponData.maxDiscount,
          applicable_products: couponData.applicableProducts,
          applicable_categories: couponData.applicableCategories,
          start_date: couponData.startDate,
          end_date: couponData.endDate,
          usage_limit: couponData.usageLimit,
          per_customer: couponData.perCustomer,
          status: couponData.status,
          description: couponData.description,
        })
        .select('*')
        .single();

      if (error) {
        throw error;
      }

      toast({
        title: 'Success',
        description: `Coupon ${couponData.code} created successfully.`,
      });

      // Handle product and category mappings if needed
      if (couponData.applicableProducts === 'specific' && couponData.productIds?.length) {
        await addCouponProducts(data.id, couponData.productIds);
      }

      if (couponData.applicableCategories === 'specific' && couponData.categoryIds?.length) {
        await addCouponCategories(data.id, couponData.categoryIds);
      }

      refreshCoupons();
      return data;
    } catch (error: any) {
      console.error('Error creating coupon:', error);
      toast({
        title: 'Error',
        description: 'Failed to create coupon: ' + error.message,
        variant: 'destructive',
      });
      throw error;
    }
  };

  // Update an existing coupon
  const updateCoupon = async (id: string, couponData: Partial<Coupon>) => {
    try {
      // Transform our Coupon type to match Supabase table structure
      const updateData: any = {};
      
      if (couponData.code) updateData.code = couponData.code;
      if (couponData.type) updateData.type = couponData.type;
      if (couponData.value !== undefined) updateData.value = couponData.value;
      if (couponData.minPurchase !== undefined) updateData.min_purchase = couponData.minPurchase;
      if (couponData.maxDiscount !== undefined) updateData.max_discount = couponData.maxDiscount;
      if (couponData.applicableProducts) updateData.applicable_products = couponData.applicableProducts;
      if (couponData.applicableCategories) updateData.applicable_categories = couponData.applicableCategories;
      if (couponData.startDate) updateData.start_date = couponData.startDate;
      if (couponData.endDate) updateData.end_date = couponData.endDate;
      if (couponData.usageLimit !== undefined) updateData.usage_limit = couponData.usageLimit;
      if (couponData.perCustomer !== undefined) updateData.per_customer = couponData.perCustomer;
      if (couponData.status) updateData.status = couponData.status;
      if (couponData.description !== undefined) updateData.description = couponData.description;
      
      const { data, error } = await supabase
        .from('coupon_codes')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      toast({
        title: 'Success',
        description: `Coupon ${couponData.code || data.code} updated successfully.`,
      });

      // Handle product and category mappings if needed
      if (couponData.applicableProducts === 'specific' && couponData.productIds?.length) {
        await updateCouponProducts(id, couponData.productIds);
      }

      if (couponData.applicableCategories === 'specific' && couponData.categoryIds?.length) {
        await updateCouponCategories(id, couponData.categoryIds);
      }

      refreshCoupons();
      return data;
    } catch (error: any) {
      console.error('Error updating coupon:', error);
      toast({
        title: 'Error',
        description: 'Failed to update coupon: ' + error.message,
        variant: 'destructive',
      });
      throw error;
    }
  };

  // Delete a coupon
  const deleteCoupon = async (id: string) => {
    try {
      const { error } = await supabase
        .from('coupon_codes')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      toast({
        title: 'Success',
        description: 'Coupon deleted successfully.',
      });

      refreshCoupons();
      return true;
    } catch (error: any) {
      console.error('Error deleting coupon:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete coupon: ' + error.message,
        variant: 'destructive',
      });
      return false;
    }
  };

  // Helper functions for product and category mappings
  const addCouponProducts = async (couponId: string, productIds: string[]) => {
    const productMappings = productIds.map(productId => ({
      coupon_id: couponId,
      product_id: productId
    }));

    const { error } = await supabase
      .from('coupon_products')
      .insert(productMappings);

    if (error) {
      console.error('Error adding coupon product mappings:', error);
    }
  };

  const updateCouponProducts = async (couponId: string, productIds: string[]) => {
    // First delete existing mappings
    await supabase
      .from('coupon_products')
      .delete()
      .eq('coupon_id', couponId);

    // Then add new mappings
    return addCouponProducts(couponId, productIds);
  };

  const addCouponCategories = async (couponId: string, categoryIds: string[]) => {
    const categoryMappings = categoryIds.map(categoryId => ({
      coupon_id: couponId,
      category_id: categoryId
    }));

    const { error } = await supabase
      .from('coupon_categories')
      .insert(categoryMappings);

    if (error) {
      console.error('Error adding coupon category mappings:', error);
    }
  };

  const updateCouponCategories = async (couponId: string, categoryIds: string[]) => {
    // First delete existing mappings
    await supabase
      .from('coupon_categories')
      .delete()
      .eq('coupon_id', couponId);

    // Then add new mappings
    return addCouponCategories(couponId, categoryIds);
  };

  return {
    coupons,
    loading,
    refreshCoupons,
    createCoupon,
    updateCoupon,
    deleteCoupon,
  };
}
