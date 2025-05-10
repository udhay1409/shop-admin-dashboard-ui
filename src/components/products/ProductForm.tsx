
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Product, ProductFormValues } from '@/types/product';
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
import { Upload, Plus, Trash2, Info } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AttributeManager } from './AttributeManager';
import { useProductAttributes } from '@/hooks/useProductAttributes';
import { ProductAttributeWithValues } from '@/types/attribute';
import { Switch } from '@/components/ui/switch';
import { 
  Tooltip,
  TooltipContent,
  TooltipTrigger 
} from '@/components/ui/tooltip';

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
  bulkDiscountQuantity: z.coerce.number().min(0).optional(),
  bulkDiscountPercentage: z.coerce.number().min(0).max(100).optional(),
  additionalImages: z.array(z.string()).optional(),
  // Advanced settings
  isNew: z.boolean().optional(),
  isSale: z.boolean().optional(),
  discountPercentage: z.coerce.number().min(0).max(100).optional(),
  originalPrice: z.coerce.number().min(0).optional(),
  trending: z.boolean().optional(),
  hotSelling: z.boolean().optional(),
});

export interface ProductFormProps {
  product?: Product;
  onSubmit: (values: Partial<Product>, attributes?: Array<{ attributeId: string, values: string[] }>) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
  categories: string[];
  subcategories: {id: string, name: string}[];
  onCategoryChange: (category: string) => void;
}

const ProductForm: React.FC<ProductFormProps> = ({
  product,
  onSubmit,
  onCancel,
  isSubmitting,
  categories,
  subcategories,
  onCategoryChange
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(product?.image || null);
  const [additionalFiles, setAdditionalFiles] = useState<File[]>([]);
  const [additionalPreviews, setAdditionalPreviews] = useState<string[]>(product?.additionalImages || []);
  const [productAttributes, setProductAttributes] = useState<ProductAttributeWithValues[]>([]);
  const [attributesToSave, setAttributesToSave] = useState<Array<{ attributeId: string, values: string[] }>>([]);
  
  const { getProductAttributes } = useProductAttributes();
  
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
      bulkDiscountQuantity: product?.bulkDiscountQuantity || 0,
      bulkDiscountPercentage: product?.bulkDiscountPercentage || 0,
      additionalImages: product?.additionalImages || [],
      // Advanced settings
      isNew: product?.isNew || false,
      isSale: product?.isSale || false,
      discountPercentage: product?.discountPercentage || 0,
      originalPrice: product?.originalPrice || 0,
      trending: product?.trending || false,
      hotSelling: product?.hotSelling || false,
    },
  });

  // Watch values for conditional fields
  const isSaleValue = form.watch('isSale');

  useEffect(() => {
    if (product?.id) {
      const loadProductAttributes = async () => {
        try {
          const attributes = await getProductAttributes(product.id);
          setProductAttributes(attributes);
        } catch (error) {
          console.error('Error loading product attributes:', error);
        }
      };
      
      loadProductAttributes();
    }
  }, [product, getProductAttributes]);

  const handleCategoryChange = (value: string) => {
    onCategoryChange(value);
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

  const handleAttributesChange = (attributes: Array<{ attributeId: string, values: string[] }>) => {
    setAttributesToSave(attributes);
  };

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit(values, attributesToSave);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid grid-cols-5 mb-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="attributes">Attributes</TabsTrigger>
            <TabsTrigger value="pricing">Pricing & Inventory</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
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

          {/* Advanced Attributes Tab */}
          <TabsContent value="attributes" className="space-y-4">
            <AttributeManager 
              productId={product?.id} 
              initialAttributes={productAttributes}
              onAttributesChange={handleAttributesChange}
            />
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
          
          {/* Advanced Tab */}
          <TabsContent value="advanced" className="space-y-4">
            <div className="bg-muted/50 rounded-md p-4">
              <h3 className="font-medium mb-2">Advanced Settings</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Additional product configuration options
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Product Badge Settings */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold border-b pb-1">Product Badges</h4>
                  
                  <FormField
                    control={form.control}
                    name="isNew"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel>New Badge</FormLabel>
                          <FormDescription>
                            Mark this product as new
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="trending"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel>Trending</FormLabel>
                          <FormDescription>
                            Mark this product as trending
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="hotSelling"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel>Hot Selling</FormLabel>
                          <FormDescription>
                            Mark this product as hot selling
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                
                {/* Sale & Pricing Settings */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold border-b pb-1">Sale Settings</h4>
                  
                  <FormField
                    control={form.control}
                    name="isSale"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel>On Sale</FormLabel>
                          <FormDescription>
                            Mark this product as being on sale
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  {isSaleValue && (
                    <>
                      <FormField
                        control={form.control}
                        name="originalPrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Original Price ($)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                min="0" 
                                step="0.01"
                                {...field}
                                value={field.value || ''}
                              />
                            </FormControl>
                            <FormDescription>
                              Original price before discount
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="discountPercentage"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Discount Percentage (%)</FormLabel>
                            <div className="flex items-center gap-2">
                              <FormControl className="flex-1">
                                <Input 
                                  type="number" 
                                  min="0" 
                                  max="100"
                                  {...field}
                                  value={field.value || ''}
                                />
                              </FormControl>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="rounded-full p-1 hover:bg-muted">
                                    <Info className="h-4 w-4 text-muted-foreground" />
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent side="top">
                                  <p className="max-w-xs text-sm">
                                    Sale price will be calculated automatically based on the original price and discount percentage
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}
                </div>
              </div>
            </div>
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
