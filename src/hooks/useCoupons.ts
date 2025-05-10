
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Coupon } from '@/types/coupon';
import { getCoupons, createCoupon, updateCoupon, deleteCoupon } from '@/services/couponService';

export const useCoupons = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchCoupons = useCallback(async () => {
    try {
      setLoading(true);
      const fetchedCoupons = await getCoupons();
      setCoupons(fetchedCoupons);
    } catch (error) {
      console.error('Error fetching coupons:', error);
      toast({
        title: 'Error',
        description: 'Failed to load coupons',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  const handleCreateCoupon = async (couponData: Omit<Coupon, 'id'>) => {
    try {
      const newCoupon = await createCoupon(couponData);
      setCoupons((prev) => [newCoupon, ...prev]);
      toast({
        title: 'Success',
        description: `Coupon ${newCoupon.code} created successfully`,
      });
      return newCoupon;
    } catch (error) {
      console.error('Error creating coupon:', error);
      toast({
        title: 'Error',
        description: 'Failed to create coupon',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const handleUpdateCoupon = async (id: string, couponData: Partial<Coupon>) => {
    try {
      const updatedCoupon = await updateCoupon(id, couponData);
      setCoupons((prev) => 
        prev.map((coupon) => (coupon.id === id ? updatedCoupon : coupon))
      );
      toast({
        title: 'Success',
        description: `Coupon ${updatedCoupon.code} updated successfully`,
      });
      return updatedCoupon;
    } catch (error) {
      console.error('Error updating coupon:', error);
      toast({
        title: 'Error',
        description: 'Failed to update coupon',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const handleDeleteCoupon = async (id: string) => {
    try {
      await deleteCoupon(id);
      setCoupons((prev) => prev.filter((coupon) => coupon.id !== id));
      toast({
        title: 'Success',
        description: 'Coupon deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting coupon:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete coupon',
        variant: 'destructive',
      });
      throw error;
    }
  };

  return {
    coupons,
    loading,
    createCoupon: handleCreateCoupon,
    updateCoupon: handleUpdateCoupon,
    deleteCoupon: handleDeleteCoupon,
    refreshCoupons: fetchCoupons,
  };
};
