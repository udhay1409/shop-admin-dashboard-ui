
import React, { useState } from 'react';
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
import { Upload } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Category name must be at least 2 characters.' }),
  description: z.string().optional(),
  status: z.enum(['Active', 'Inactive', 'Draft']),
  imageUrl: z.string().optional(),
  color: z.string().optional(),
  parentId: z.string().optional(),
});

interface CategoryFormProps {
  category?: Category;
  parentCategories?: Category[];
  onSubmit: (values: CategoryFormValues) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  isSubcategory?: boolean;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  category,
  parentCategories = [],
  onSubmit,
  onCancel,
  isSubmitting,
  isSubcategory = false
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(category?.imageUrl || null);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: category?.name || '',
      description: category?.description || '',
      status: category?.status || 'Draft',
      imageUrl: category?.imageUrl || '',
      color: category?.color || '#6E59A5',
      parentId: category?.parentId || undefined,
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setSelectedFile(file);
    
    // Create a preview URL
    const fileUrl = URL.createObjectURL(file);
    setPreviewUrl(fileUrl);
    
    // Update the form value
    form.setValue('imageUrl', fileUrl);
  };

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    // Ensure we're passing a properly structured CategoryFormValues object
    const formValues: CategoryFormValues = {
      name: values.name,
      description: values.description || '',
      status: values.status,
      imageUrl: values.imageUrl,
      color: values.color
    };
    
    if (category?.id) {
      formValues.id = category.id;
    }
    
    if (isSubcategory && values.parentId) {
      formValues.parentId = values.parentId;
    }
    
    onSubmit(formValues);
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
          {isSubcategory && (
            <FormField
              control={form.control}
              name="parentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parent Category</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select parent category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {parentCategories.map(parentCategory => (
                        <SelectItem key={parentCategory.id} value={parentCategory.id}>
                          {parentCategory.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select which category this will be a subcategory of.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

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
        </div>

        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category Image</FormLabel>
              <div className="flex flex-col space-y-3">
                <div className="flex items-center gap-4">
                  {previewUrl && (
                    <div className="relative w-24 h-24 rounded-md overflow-hidden border">
                      <img 
                        src={previewUrl} 
                        alt="Preview" 
                        className="object-cover w-full h-full"
                      />
                    </div>
                  )}
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <div className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-slate-100 transition-colors">
                      <Upload className="h-5 w-5" />
                      <span>Choose File</span>
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </div>
                    {selectedFile && (
                      <p className="text-sm text-gray-500 mt-1">{selectedFile.name}</p>
                    )}
                  </label>
                </div>
                <FormControl>
                  <Input 
                    type="hidden" 
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  Upload an image for this category (optional).
                </FormDescription>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

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
