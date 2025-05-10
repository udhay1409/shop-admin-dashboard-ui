
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export interface ProductTag {
  id: string;
  name: string;
  created_at?: string;
  updated_at?: string;
}

export function useProductTags() {
  const [tags, setTags] = useState<ProductTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { toast } = useToast();

  // Fetch tags from Supabase
  const fetchTags = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('product_tags')
        .select('*')
        .order('name');

      if (error) {
        throw error;
      }

      setTags(data);
    } catch (error: any) {
      console.error('Error fetching product tags:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch product tags: ' + error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Refresh tags
  const refreshTags = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  useEffect(() => {
    fetchTags();
  }, [refreshTrigger]);

  // Create a new tag
  const createTag = async (name: string) => {
    try {
      const { data, error } = await supabase
        .from('product_tags')
        .insert({ name })
        .select()
        .single();

      if (error) {
        throw error;
      }

      toast({
        title: 'Success',
        description: `Tag "${name}" created successfully.`,
      });

      refreshTags();
      return data;
    } catch (error: any) {
      console.error('Error creating product tag:', error);
      toast({
        title: 'Error',
        description: 'Failed to create tag: ' + error.message,
        variant: 'destructive',
      });
      throw error;
    }
  };

  // Update an existing tag
  const updateTag = async (id: string, name: string) => {
    try {
      const { data, error } = await supabase
        .from('product_tags')
        .update({ name })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      toast({
        title: 'Success',
        description: `Tag updated successfully.`,
      });

      refreshTags();
      return data;
    } catch (error: any) {
      console.error('Error updating product tag:', error);
      toast({
        title: 'Error',
        description: 'Failed to update tag: ' + error.message,
        variant: 'destructive',
      });
      throw error;
    }
  };

  // Delete a tag
  const deleteTag = async (id: string) => {
    try {
      const { error } = await supabase
        .from('product_tags')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      toast({
        title: 'Success',
        description: 'Tag deleted successfully.',
      });

      refreshTags();
      return true;
    } catch (error: any) {
      console.error('Error deleting product tag:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete tag: ' + error.message,
        variant: 'destructive',
      });
      return false;
    }
  };

  // Associate tags with a product
  const associateTagsWithProduct = async (productId: string, tagIds: string[]) => {
    try {
      // First remove existing mappings
      await supabase
        .from('product_tags_mapping')
        .delete()
        .eq('product_id', productId);
      
      // Create new mappings
      const mappings = tagIds.map(tagId => ({
        product_id: productId,
        tag_id: tagId
      }));
      
      const { error } = await supabase
        .from('product_tags_mapping')
        .insert(mappings);

      if (error) {
        throw error;
      }

      return true;
    } catch (error: any) {
      console.error('Error associating tags with product:', error);
      toast({
        title: 'Error',
        description: 'Failed to associate tags: ' + error.message,
        variant: 'destructive',
      });
      return false;
    }
  };

  // Get tags for a specific product
  const getTagsForProduct = async (productId: string) => {
    try {
      const { data, error } = await supabase
        .from('product_tags_mapping')
        .select('tag_id')
        .eq('product_id', productId);

      if (error) {
        throw error;
      }

      const tagIds = data.map(item => item.tag_id);
      return tagIds;
    } catch (error: any) {
      console.error('Error getting tags for product:', error);
      return [];
    }
  };

  return {
    tags,
    loading,
    refreshTags,
    createTag,
    updateTag,
    deleteTag,
    associateTagsWithProduct,
    getTagsForProduct
  };
}
