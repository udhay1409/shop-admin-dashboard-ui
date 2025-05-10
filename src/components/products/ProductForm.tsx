import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Product, ProductFormValues, ProductSize, ProductColor } from '@/types/product';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Upload, Plus, Trash2, Square } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const formSchema = z.object({
  name: z.string().min(2, { message: 'Product name must be at least 2 characters.' }),
  price: z.coerce.number().min(0, { message: 'Price cannot be negative.' }),
  stock: z.coerce.number().min(0, { message: 'Stock cannot be negative.' }),
  description: z.string().optional(),
  sku: z.string().optional(),
  status: z.enum(['Active', 'Inactive', 'Draft']),
  category: z.string().min(1, { message: 'Please select a category.' }),
  subcategory: z.string().optional(),
  image: z.string().optional(),
  availableSizes: z.array(z.enum(['XS', 'S', 'M', 'L', 'XL'])).optional(),
  availableColors: z.array(z.enum(['Red', 'Blue', 'Green', 'Yellow', 'Pink', 'Black', 'White'])).optional(),
  bulkDiscountQuantity: z.coerce.number().min(0).optional(),
  bulkDiscountPercentage: z.coerce.number().min(0).max(100).optional(),
  additionalImages: z.array(z.string()).optional(),
});

interface ProductFormProps {
  product?: Product;
  onSubmit: (values: Partial<Product>) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
  categories: string[];
  subcategories: {id: string, name: string}[];
}

const ProductForm: React.FC<ProductFormProps> = ({
  product,
  onSubmit,
  onCancel,
  isSubmitting,
  categories,
  subcategories
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(product?.image || null);
  const [additionalFiles, setAdditionalFiles] = useState<File[]>([]);
  const [additionalPreviews, setAdditionalPreviews] = useState<string[]>(product?.additionalImages || []);
  const [selectedCategory, setSelectedCategory] = useState<string>(product?.category || '');
  
  // Available sizes and colors for selection
  const sizes: ProductSize[] = ['XS', 'S', 'M', 'L', 'XL'];
  const colors: ProductColor[] = ['Red', 'Blue', 'Green', 'Yellow', 'Pink', 'Black', 'White'];
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: product?.name || '',
      price: product?.price || 0,
      stock: product?.stock || 0,
      description: product?.description || '',
      sku: product?.sku || '',
      status: product?.status || 'Draft',
      category: product?.category || (categories.length > 0 ? categories[0] : 'Uncategorized'),
      subcategory: product?.subcategory || '',
      image: product?.image || '',
      availableSizes: product?.availableSizes || [],
      availableColors: product?.availableColors || [],
      bulkDiscountQuantity: product?.bulkDiscountQuantity || 0,
      bulkDiscountPercentage: product?.bulkDiscountPercentage || 0,
      additionalImages: product?.additionalImages || [],
    },
  });

  // No need to fetch subcategories here as they're passed as props
  // from ProductDialog.tsx which already fetches them

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    form.setValue('category', value);
    form.setValue('subcategory', ''); // Reset subcategory when category changes
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setSelectedFile(file);
    
    // Create a preview URL
    const fileUrl = URL.createObjectURL(file);
    setPreviewUrl(fileUrl);
    
    // Update the form value
    form.setValue('image', fileUrl);
  };

  const handleAdditionalFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    const newFiles = Array.from(files);
    setAdditionalFiles(prev => [...prev, ...newFiles]);
    
    // Create preview URLs
    const newPreviewUrls = newFiles.map(file => URL.createObjectURL(file));
    setAdditionalPreviews(prev => [...prev, ...newPreviewUrls]);
    
    // Update the form value
    form.setValue('additionalImages', [...additionalPreviews, ...newPreviewUrls]);
  };

  const removeAdditionalImage = (index: number) => {
    const newPreviews = [...additionalPreviews];
    newPreviews.splice(index, 1);
    setAdditionalPreviews(newPreviews);
    
    // Update the form value
    form.setValue('additionalImages', newPreviews);
  };

  const handleSizeChange = (size: ProductSize) => {
    const currentSizes = form.getValues('availableSizes') || [];
    const updated = currentSizes.includes(size) 
      ? currentSizes.filter(s => s !== size)
      : [...currentSizes, size];
    
    form.setValue('availableSizes', updated);
  };

  const handleColorChange = (color: ProductColor) => {
    const currentColors = form.getValues('availableColors') || [];
    const updated = currentColors.includes(color) 
      ? currentColors.filter(c => c !== color)
      : [...currentColors, color];
    
    form.setValue('availableColors', updated);
  };

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="attributes">Attributes</TabsTrigger>
            <TabsTrigger value="pricing">Pricing & Inventory</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
          </TabsList>

          {/* Basic Info Tab */}
          <TabsContent value="basic" className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter product name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select 
                      onValueChange={handleCategoryChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.length > 0 ? (
                          categories.map(category => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="uncategorized">Uncategorized</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="subcategory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subcategory</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      disabled={subcategories.length === 0}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={subcategories.length === 0 ? "No subcategories available" : "Select subcategory"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {subcategories.map(subcategory => (
                          <SelectItem key={subcategory.id} value={subcategory.name}>
                            {subcategory.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Select a subcategory if applicable
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
                      <SelectItem value="Draft">Draft</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Controls whether this product is visible in your store.
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
                      placeholder="Enter product description" 
                      className="min-h-[100px]"
                      {...field} 
                      value={field.value || ''} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sku"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SKU (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter SKU" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormDescription>
                    Stock Keeping Unit - unique identifier for this product.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>

          {/* Attributes Tab */}
          <TabsContent value="attributes" className="space-y-6">
            <div className="space-y-3">
              <FormLabel>Available Sizes</FormLabel>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => {
                  const isSelected = form.getValues('availableSizes')?.includes(size) || false;
                  return (
                    <Badge 
                      key={size} 
                      variant={isSelected ? "default" : "outline"}
                      className={`cursor-pointer ${isSelected ? 'bg-primary' : ''}`}
                      onClick={() => handleSizeChange(size)}
                    >
                      <Square className="h-4 w-4 mr-1" />
                      {size}
                    </Badge>
                  );
                })}
              </div>
              <FormDescription>
                Select all available sizes for this product
              </FormDescription>
            </div>
            
            <div className="space-y-3">
              <FormLabel>Available Colors</FormLabel>
              <div className="flex flex-wrap gap-2">
                {colors.map((color) => {
                  const isSelected = form.getValues('availableColors')?.includes(color) || false;
                  return (
                    <Badge 
                      key={color} 
                      variant={isSelected ? "default" : "outline"}
                      className={`cursor-pointer ${isSelected ? 'bg-primary' : ''}`}
                      onClick={() => handleColorChange(color)}
                    >
                      <span 
                        className="inline-block w-3 h-3 rounded-full mr-1" 
                        style={{ 
                          backgroundColor: color.toLowerCase(),
                          border: color.toLowerCase() === 'white' ? '1px solid #ddd' : 'none'
                        }}
                      ></span>
                      {color}
                    </Badge>
                  );
                })}
              </div>
              <FormDescription>
                Select all available colors for this product
              </FormDescription>
            </div>
          </TabsContent>

          {/* Pricing & Inventory Tab */}
          <TabsContent value="pricing" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price ($)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" min="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="bulkDiscountQuantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bulk Order Quantity</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0" 
                        placeholder="e.g., 5" 
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormDescription>
                      Minimum quantity for discount
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bulkDiscountPercentage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discount Percentage</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0" 
                        max="100"
                        placeholder="e.g., 10"
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormDescription>
                      Discount % for bulk orders
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </TabsContent>

          {/* Images Tab */}
          <TabsContent value="images" className="space-y-4">
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Main Product Image</FormLabel>
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
                      <label htmlFor="product-image-upload" className="cursor-pointer">
                        <div className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-slate-100 transition-colors">
                          <Upload className="h-5 w-5" />
                          <span>Choose File</span>
                          <input
                            id="product-image-upload"
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
                      Upload a main image for this product
                    </FormDescription>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="additionalImages"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Product Images</FormLabel>
                  <div className="flex flex-col space-y-3">
                    <div className="flex flex-wrap gap-3">
                      {additionalPreviews.map((preview, index) => (
                        <div key={index} className="relative w-24 h-24 rounded-md overflow-hidden border">
                          <img 
                            src={preview} 
                            alt={`Additional preview ${index + 1}`} 
                            className="object-cover w-full h-full"
                          />
                          <button
                            type="button"
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                            onClick={() => removeAdditionalImage(index)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                      <label htmlFor="additional-images-upload" className="cursor-pointer flex items-center justify-center w-24 h-24 border-2 border-dashed rounded-md hover:bg-slate-50 transition-colors">
                        <div className="flex flex-col items-center gap-1">
                          <Plus className="h-6 w-6 text-gray-400" />
                          <span className="text-xs text-gray-500">Add Image</span>
                        </div>
                        <input
                          id="additional-images-upload"
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleAdditionalFileChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                    <FormControl>
                      <Input 
                        type="hidden" 
                        {...field} 
                        value={field.value ? JSON.stringify(field.value) : ''}
                      />
                    </FormControl>
                    <FormDescription>
                      Upload additional images to show more product views
                    </FormDescription>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-6">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProductForm;
