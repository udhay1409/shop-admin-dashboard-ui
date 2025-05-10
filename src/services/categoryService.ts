import { supabase } from '@/integrations/supabase/client';
import { Category, CategoryFormValues } from '@/types/category';
import { toast } from '@/hooks/use-toast';

// Get all categories
export async function getCategories(): Promise<Category[]> {
  const { data: categoriesData, error } = await supabase
    .from('categories')
    .select('*')
    .is('parent_id', null)
    .order('name');
  
  if (error) {
    console.error('Error fetching categories:', error);
    toast({
      title: 'Failed to load categories',
      description: error.message,
      variant: 'destructive',
    });
    return [];
  }
  
  return categoriesData.map(transformDbCategory);
}

// Get all subcategories (optionally filter by parent)
export async function getSubcategories(parentId?: string): Promise<Category[]> {
  let query = supabase
    .from('categories')
    .select('*')
    .not('parent_id', 'is', null);
  
  if (parentId) {
    query = query.eq('parent_id', parentId);
  }
  
  const { data: subcategoriesData, error } = await query.order('name');
  
  if (error) {
    console.error('Error fetching subcategories:', error);
    toast({
      title: 'Failed to load subcategories',
      description: error.message,
      variant: 'destructive',
    });
    return [];
  }
  
  return subcategoriesData.map(transformDbCategory);
}

// Create a new category
export async function createCategory(categoryData: CategoryFormValues): Promise<Category | null> {
  // Generate a slug from the name
  const slug = generateSlug(categoryData.name);
  
  const { data: category, error } = await supabase
    .from('categories')
    .insert({
      name: categoryData.name,
      description: categoryData.description,
      slug,
      status: categoryData.status,
      image_url: categoryData.imageUrl,
      parent_id: categoryData.parentId === 'none' ? null : categoryData.parentId,
      color: categoryData.color || '#6E59A5', // Add color field to database insertion
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating category:', error);
    toast({
      title: 'Failed to create category',
      description: error.message,
      variant: 'destructive',
    });
    return null;
  }
  
  return transformDbCategory(category);
}

// Update an existing category
export async function updateCategory(id: string, categoryData: CategoryFormValues): Promise<Category | null> {
  // Generate a slug from the name if the name has changed
  const slug = generateSlug(categoryData.name);
  
  const { data: category, error } = await supabase
    .from('categories')
    .update({
      name: categoryData.name,
      description: categoryData.description,
      slug,
      status: categoryData.status,
      image_url: categoryData.imageUrl,
      parent_id: categoryData.parentId === 'none' ? null : categoryData.parentId,
      color: categoryData.color || '#6E59A5', // Add color field to database update
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating category:', error);
    toast({
      title: 'Failed to update category',
      description: error.message,
      variant: 'destructive',
    });
    return null;
  }
  
  return transformDbCategory(category);
}

// Delete a category
export async function deleteCategory(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting category:', error);
    toast({
      title: 'Failed to delete category',
      description: error.message,
      variant: 'destructive',
    });
    return false;
  }
  
  return true;
}

// Helper function to transform database category to frontend Category type
function transformDbCategory(dbCategory: any): Category {
  return {
    id: dbCategory.id,
    name: dbCategory.name,
    slug: dbCategory.slug,
    description: dbCategory.description || '',
    status: dbCategory.status,
    imageUrl: dbCategory.image_url,
    productsCount: dbCategory.products_count || 0,
    createdAt: dbCategory.created_at,
    updatedAt: dbCategory.updated_at,
    parentId: dbCategory.parent_id,
    color: dbCategory.color || '#6E59A5', // Add default color if not present in db
  };
}

// Helper function to generate a slug from a name
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')  // Remove non-word chars
    .replace(/[\s_-]+/g, '-')  // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, '');  // Remove leading/trailing hyphens
}
