
import { supabase } from "@/integrations/supabase/client";
import { Coupon } from "@/types/coupon";

export const getCoupons = async (): Promise<Coupon[]> => {
  try {
    const { data, error } = await supabase
      .from('coupon_codes')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      throw new Error(error.message);
    }

    return data.map(coupon => ({
      id: coupon.id,
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      startDate: coupon.start_date,
      endDate: coupon.end_date,
      usageCount: coupon.usage_count || 0,
      usageLimit: coupon.usage_limit,
      status: coupon.status || 'active',
      description: coupon.description || '',
      minPurchase: coupon.min_purchase,
      maxDiscount: coupon.max_discount,
      applicableProducts: coupon.applicable_products,
      applicableCategories: coupon.applicable_categories,
      perCustomer: coupon.per_customer
    }));
  } catch (error) {
    console.error("Error getting coupons:", error);
    throw error;
  }
};

export const createCoupon = async (couponData: Omit<Coupon, 'id'>): Promise<Coupon> => {
  try {
    const { data, error } = await supabase
      .from('coupon_codes')
      .insert({
        code: couponData.code,
        type: couponData.type,
        value: couponData.value,
        start_date: couponData.startDate,
        end_date: couponData.endDate,
        usage_count: couponData.usageCount || 0,
        usage_limit: couponData.usageLimit,
        status: couponData.status || 'active',
        description: couponData.description,
        min_purchase: couponData.minPurchase,
        max_discount: couponData.maxDiscount,
        applicable_products: couponData.applicableProducts,
        applicable_categories: couponData.applicableCategories,
        per_customer: couponData.perCustomer
      })
      .select()
      .single();
    
    if (error) {
      throw new Error(error.message);
    }
    
    return {
      id: data.id,
      code: data.code,
      type: data.type,
      value: data.value,
      startDate: data.start_date,
      endDate: data.end_date,
      usageCount: data.usage_count || 0,
      usageLimit: data.usage_limit,
      status: data.status || 'active',
      description: data.description || '',
      minPurchase: data.min_purchase,
      maxDiscount: data.max_discount,
      applicableProducts: data.applicable_products,
      applicableCategories: data.applicable_categories,
      perCustomer: data.per_customer
    };
  } catch (error) {
    console.error("Error creating coupon:", error);
    throw error;
  }
};

export const updateCoupon = async (id: string, couponData: Partial<Coupon>): Promise<Coupon> => {
  try {
    const updateData: any = {};
    if (couponData.code) updateData.code = couponData.code;
    if (couponData.type) updateData.type = couponData.type;
    if (couponData.value !== undefined) updateData.value = couponData.value;
    if (couponData.startDate) updateData.start_date = couponData.startDate;
    if (couponData.endDate) updateData.end_date = couponData.endDate;
    if (couponData.usageCount !== undefined) updateData.usage_count = couponData.usageCount;
    if (couponData.usageLimit !== undefined) updateData.usage_limit = couponData.usageLimit;
    if (couponData.status) updateData.status = couponData.status;
    if (couponData.description !== undefined) updateData.description = couponData.description;
    if (couponData.minPurchase !== undefined) updateData.min_purchase = couponData.minPurchase;
    if (couponData.maxDiscount !== undefined) updateData.max_discount = couponData.maxDiscount;
    if (couponData.applicableProducts) updateData.applicable_products = couponData.applicableProducts;
    if (couponData.applicableCategories) updateData.applicable_categories = couponData.applicableCategories;
    if (couponData.perCustomer !== undefined) updateData.per_customer = couponData.perCustomer;

    const { data, error } = await supabase
      .from('coupon_codes')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      throw new Error(error.message);
    }
    
    return {
      id: data.id,
      code: data.code,
      type: data.type,
      value: data.value,
      startDate: data.start_date,
      endDate: data.end_date,
      usageCount: data.usage_count || 0,
      usageLimit: data.usage_limit,
      status: data.status || 'active',
      description: data.description || '',
      minPurchase: data.min_purchase,
      maxDiscount: data.max_discount,
      applicableProducts: data.applicable_products,
      applicableCategories: data.applicable_categories,
      perCustomer: data.per_customer
    };
  } catch (error) {
    console.error("Error updating coupon:", error);
    throw error;
  }
};

export const deleteCoupon = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('coupon_codes')
      .delete()
      .eq('id', id);
    
    if (error) {
      throw new Error(error.message);
    }
  } catch (error) {
    console.error("Error deleting coupon:", error);
    throw error;
  }
};

// Get coupon usage statistics
export const getCouponStats = async (): Promise<{
  totalCoupons: number;
  activeCoupons: number;
  expiredCoupons: number;
  redemptionsCount: number;
}> => {
  try {
    const { data: coupons, error } = await supabase
      .from('coupon_codes')
      .select('*');
    
    if (error) {
      throw new Error(error.message);
    }

    const currentDate = new Date();
    
    const totalCoupons = coupons.length;
    const activeCoupons = coupons.filter(
      coupon => coupon.status === 'active' && new Date(coupon.end_date) >= currentDate
    ).length;
    const expiredCoupons = coupons.filter(
      coupon => coupon.status === 'active' && new Date(coupon.end_date) < currentDate
    ).length;
    
    // Calculate total redemptions
    const redemptionsCount = coupons.reduce((total, coupon) => total + (coupon.usage_count || 0), 0);

    return {
      totalCoupons,
      activeCoupons,
      expiredCoupons,
      redemptionsCount
    };
  } catch (error) {
    console.error("Error getting coupon stats:", error);
    throw error;
  }
};
