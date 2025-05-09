
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Category, CategoryFormValues } from '@/types/category';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Category name must be at least 2 characters.' }),
  description: z.string().optional(),
  status: z.enum(['Active', 'Inactive', 'Draft']),
  imageUrl: z.string().optional(),
  parentId: z.string().optional(),
  color: z.string().optional(),
});

interface CategoryFormProps {
  category?: Category;
  parentCategories?: Category[];
  onSubmit: (values: CategoryFormValues) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  category,
  parentCategories = [],
  onSubmit,
  onCancel,
  isSubmitting
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: category?.name || '',
      description: category?.description || '',
      status: category?.status || 'Draft',
      imageUrl: category?.imageUrl || '',
      parentId: category?.parentId || undefined,
      color: category?.color || '#6E59A5',
    },
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit({
      ...values,
      id: category?.id,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Category name" {...field} />
              </FormControl>
              <FormDescription>
                This is how the category will appear in your store.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Brief description of this category" 
                  {...field} 
                  value={field.value || ''} 
                  className="min-h-[100px]"
                />
              </FormControl>
              <FormDescription>
                Provide a short description for this category (optional).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                    <SelectItem value="Draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Set the visibility of this category in your store.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="parentId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Parent Category</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="None (Top Level)" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="">None (Top Level)</SelectItem>
                    {parentCategories.map(parent => (
                      <SelectItem 
                        key={parent.id} 
                        value={parent.id}
                        disabled={parent.id === category?.id}
                      >
                        {parent.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Optionally select a parent category.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Category Color</FormLabel>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-6 h-6 rounded border"
                    style={{ backgroundColor: field.value }}
                  />
                  <FormControl>
                    <Input type="color" {...field} value={field.value || '#6E59A5'} />
                  </FormControl>
                </div>
                <FormDescription>
                  Choose a color for this category.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com/image.jpg" {...field} value={field.value || ''} />
                </FormControl>
                <FormDescription>
                  Optional: Add an image URL for this category.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : category ? 'Update Category' : 'Create Category'}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default CategoryForm;
