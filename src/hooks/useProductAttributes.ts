
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ProductAttribute, ProductAttributeWithValues } from '@/types/attribute';
import * as attributeService from '@/services/attributeService';

export function useProductAttributes() {
  const [attributes, setAttributes] = useState<ProductAttribute[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch all attributes
  const fetchAttributes = useCallback(async () => {
    setLoading(true);
    try {
      const data = await attributeService.getAttributes();
      setAttributes(data || []);
    } catch (error) {
      console.error('Error fetching attributes:', error);
      toast({
        title: 'Error',
        description: 'Failed to load attributes',
        variant: 'destructive',
      });
      setAttributes([]); // Set to empty array on error, not undefined
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Get attributes for a specific product
  const getProductAttributes = useCallback(async (productId: string): Promise<ProductAttributeWithValues[]> => {
    try {
      const data = await attributeService.getProductAttributes(productId);
      return data || [];
    } catch (error) {
      console.error('Error fetching product attributes:', error);
      toast({
        title: 'Error',
        description: 'Failed to load product attributes',
        variant: 'destructive',
      });
      return [];
    }
  }, [toast]);

  // Create a new attribute
  const createAttribute = useCallback(async (attribute: {name: string, displayName: string}): Promise<ProductAttribute> => {
    try {
      const newAttribute = await attributeService.createAttribute(attribute);
      setAttributes(prev => [...(prev || []), newAttribute]);
      toast({
        title: 'Success',
        description: 'Attribute created successfully',
      });
      return newAttribute;
    } catch (error) {
      console.error('Error creating attribute:', error);
      toast({
        title: 'Error',
        description: 'Failed to create attribute',
        variant: 'destructive',
      });
      throw error;
    }
  }, [toast]);

  // Set attributes for a product
  const setProductAttributes = useCallback(async (
    productId: string, 
    attributeData: Array<{ attributeId: string, values: string[] }>
  ): Promise<boolean> => {
    try {
      await attributeService.setProductAttributes(productId, attributeData);
      toast({
        title: 'Success',
        description: 'Product attributes updated successfully',
      });
      return true;
    } catch (error) {
      console.error('Error setting product attributes:', error);
      toast({
        title: 'Error',
        description: 'Failed to update product attributes',
        variant: 'destructive',
      });
      return false;
    }
  }, [toast]);

  // Load attributes on component mount
  useEffect(() => {
    fetchAttributes();
  }, [fetchAttributes]);

  return {
    attributes: attributes || [], // Always return an array, even if attributes is undefined
    loading,
    fetchAttributes,
    getProductAttributes,
    createAttribute,
    setProductAttributes
  };
}
