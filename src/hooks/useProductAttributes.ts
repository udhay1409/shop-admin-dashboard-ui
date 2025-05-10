
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ProductAttribute, ProductAttributeWithValues } from '@/types/attribute';
import * as attributeService from '@/services/attributeService';

export function useProductAttributes() {
  const [attributes, setAttributes] = useState<ProductAttribute[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchAttributes();
  }, []);

  const fetchAttributes = async () => {
    setLoading(true);
    try {
      const fetchedAttributes = await attributeService.getAttributes();
      setAttributes(fetchedAttributes);
    } catch (error) {
      console.error('Error fetching attributes:', error);
      toast({
        title: 'Error',
        description: 'Failed to load product attributes',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const createAttribute = async (attribute: Pick<ProductAttribute, 'name' | 'displayName'>) => {
    try {
      const newAttribute = await attributeService.createAttribute(attribute);
      setAttributes(prev => [...prev, newAttribute]);
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
  };

  const updateAttribute = async (id: string, updates: Partial<Pick<ProductAttribute, 'name' | 'displayName'>>) => {
    try {
      const updatedAttribute = await attributeService.updateAttribute(id, updates);
      setAttributes(prev => prev.map(attr => attr.id === id ? updatedAttribute : attr));
      toast({
        title: 'Success',
        description: 'Attribute updated successfully',
      });
      return updatedAttribute;
    } catch (error) {
      console.error('Error updating attribute:', error);
      toast({
        title: 'Error',
        description: 'Failed to update attribute',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const deleteAttribute = async (id: string) => {
    try {
      await attributeService.deleteAttribute(id);
      setAttributes(prev => prev.filter(attr => attr.id !== id));
      toast({
        title: 'Success',
        description: 'Attribute deleted successfully',
      });
      return true;
    } catch (error) {
      console.error('Error deleting attribute:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete attribute',
        variant: 'destructive',
      });
      return false;
    }
  };

  const getProductAttributes = async (productId: string): Promise<ProductAttributeWithValues[]> => {
    try {
      return await attributeService.getProductAttributes(productId);
    } catch (error) {
      console.error('Error fetching product attributes:', error);
      toast({
        title: 'Error',
        description: 'Failed to load product attributes',
        variant: 'destructive',
      });
      return [];
    }
  };

  const setProductAttributes = async (
    productId: string, 
    attributes: Array<{ attributeId: string, values: string[] }>
  ): Promise<boolean> => {
    try {
      const result = await attributeService.setProductAttributes(productId, attributes);
      if (result) {
        toast({
          title: 'Success',
          description: 'Product attributes updated successfully',
        });
      }
      return result;
    } catch (error) {
      console.error('Error setting product attributes:', error);
      toast({
        title: 'Error',
        description: 'Failed to update product attributes',
        variant: 'destructive',
      });
      return false;
    }
  };

  return {
    attributes,
    loading,
    refreshAttributes: fetchAttributes,
    createAttribute,
    updateAttribute,
    deleteAttribute,
    getProductAttributes,
    setProductAttributes,
  };
}
