
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Product, 
  ProductFormValues,
  ProductDimension,
  ProductWeight
} from '@/types/product';
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
import { 
  Upload, 
  Plus, 
  Trash2, 
  Info, 
  Package, 
  FileDown, 
  Truck, 
  Tag, 
  Settings, 
  Box, 
  BarChart2, 
  Search
} from 'lucide-react';
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
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';

const productSchema = z.object({
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
  
  // Brand information
  brand: z.string().optional(),
  manufacturer: z.string().optional(),
  manufacturerPartNumber: z.string().optional(),
  model: z.string().optional(),
  
  // Digital product
  isDigital: z.boolean().optional(),
  downloadable: z.boolean().optional(),
  downloadLimit: z.coerce.number().min(0).optional(),
  downloadExpiry: z.coerce.number().min(0).optional(),
  
  // Physical dimensions
  dimensions: z.object({
    length: z.coerce.number().min(0).optional(),
    width: z.coerce.number().min(0).optional(),
    height: z.coerce.number().min(0).optional(),
    unit: z.enum(['cm', 'in', 'mm']).optional()
  }).optional(),
  
  // Weight
  weight: z.object({
    value: z.coerce.number().min(0).optional(),
    unit: z.enum(['kg', 'g', 'lb', 'oz']).optional()
  }).optional(),
  
  // Shipping
  freeShipping: z.boolean().optional(),
  shippingClass: z.string().optional(),
  requiresShipping: z.boolean().optional(),
  
  // Inventory
  barcode: z.string().optional(),
  stockManagement: z.boolean().optional(),
  lowStockThreshold: z.coerce.number().min(0).optional(),
  allowBackorders: z.boolean().optional(),
  stockStatus: z.enum(['In Stock', 'Out of Stock', 'On Backorder', 'Discontinued']).optional(),
  minOrderQuantity: z.coerce.number().min(1).optional(),
  maxOrderQuantity: z.coerce.number().min(0).optional(),
  
  // SEO
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  metaKeywords: z.string().optional(),
  canonicalUrl: z.string().optional(),
  
  // Tax
  taxable: z.boolean().optional(),
  taxClass: z.string().optional(),
  taxRate: z.coerce.number().min(0).max(100).optional(),
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
  
  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
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
      
      // Brand information
      brand: product?.brand || '',
      manufacturer: product?.manufacturer || '',
      manufacturerPartNumber: product?.manufacturerPartNumber || '',
      model: product?.model || '',
      
      // Digital product
      isDigital: product?.isDigital || false,
      downloadable: product?.downloadable || false,
      downloadLimit: product?.downloadLimit || 0,
      downloadExpiry: product?.downloadExpiry || 0,
      
      // Dimensions (if exists)
      dimensions: product?.dimensions || { 
        length: 0,
        width: 0,
        height: 0,
        unit: 'cm'
      },
      
      // Weight (if exists)
      weight: product?.weight || {
        value: 0,
        unit: 'kg'
      },
      
      // Shipping
      freeShipping: product?.shipping?.freeShipping || false,
      shippingClass: product?.shipping?.shippingClass || '',
      requiresShipping: product?.shipping?.requiresShipping !== false, // Default to true
      
      // Inventory
      barcode: product?.inventory?.barcode || '',
      stockManagement: product?.inventory?.stockManagement || true,
      lowStockThreshold: product?.inventory?.lowStockThreshold || 5,
      allowBackorders: product?.inventory?.allowBackorders || false,
      stockStatus: product?.inventory?.stockStatus || 'In Stock',
      minOrderQuantity: product?.minOrderQuantity || 1,
      maxOrderQuantity: product?.maxOrderQuantity || 0,
      
      // SEO
      metaTitle: product?.seo?.metaTitle || '',
      metaDescription: product?.seo?.metaDescription || '',
      metaKeywords: product?.seo?.metaKeywords?.join(', ') || '',
      canonicalUrl: product?.seo?.canonicalUrl || '',
      
      // Tax
      taxable: product?.taxable || true,
      taxClass: product?.taxClass || 'standard',
      taxRate: product?.taxRate || 0,
    },
  });

  // Watch values for conditional fields
  const isSaleValue = form.watch('isSale');
  const isDigitalValue = form.watch('isDigital');
  const downloadableValue = form.watch('downloadable');
  const requiresShippingValue = form.watch('requiresShipping');
  const stockManagementValue = form.watch('stockManagement');
  const taxableValue = form.watch('taxable');

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

  const handleSubmit = (values: z.infer<typeof productSchema>) => {
    // Transform the form values into the Product structure
    const productData: Partial<Product> = {
      ...values,
      dimensions: values.dimensions && (values.dimensions.length || values.dimensions.width || values.dimensions.height) ? values.dimensions : undefined,
      weight: values.weight && values.weight.value ? values.weight : undefined,
      shipping: {
        freeShipping: values.freeShipping,
        shippingClass: values.shippingClass,
        requiresShipping: values.requiresShipping,
      },
      inventory: {
        sku: values.sku,
        barcode: values.barcode,
        stockManagement: values.stockManagement,
        lowStockThreshold: values.lowStockThreshold,
        allowBackorders: values.allowBackorders,
        stockStatus: values.stockStatus,
      },
      seo: {
        metaTitle: values.metaTitle,
        metaDescription: values.metaDescription,
        metaKeywords: values.metaKeywords ? values.metaKeywords.split(',').map(k => k.trim()) : [],
        canonicalUrl: values.canonicalUrl,
      },
    };
    
    onSubmit(productData, attributesToSave);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid grid-cols-6 mb-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="attributes">Attributes</TabsTrigger>
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
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

            <div className="space-y-4 border rounded-lg p-4 bg-slate-50">
              <h3 className="text-sm font-medium">Brand Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="brand"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Brand</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter brand name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="model"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Model</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter model name/number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="manufacturer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Manufacturer</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter manufacturer name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="manufacturerPartNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Manufacturer Part Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter MPN" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="space-y-4 border rounded-lg p-4 bg-slate-50">
              <h3 className="text-sm font-medium">Product Type</h3>
              
              <FormField
                control={form.control}
                name="isDigital"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between space-x-2">
                    <div>
                      <FormLabel>Digital Product</FormLabel>
                      <FormDescription>
                        Check if this is a digital product (no physical shipping)
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
              
              {isDigitalValue && (
                <>
                  <FormField
                    control={form.control}
                    name="downloadable"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between space-x-2">
                        <div>
                          <FormLabel>Downloadable</FormLabel>
                          <FormDescription>
                            Enable if this digital product can be downloaded
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
                  
                  {downloadableValue && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="downloadLimit"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Download Limit</FormLabel>
                            <FormControl>
                              <Input type="number" min="0" placeholder="0 for unlimited" {...field} />
                            </FormControl>
                            <FormDescription>
                              Maximum number of downloads allowed (0 = unlimited)
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="downloadExpiry"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Download Expiry (days)</FormLabel>
                            <FormControl>
                              <Input type="number" min="0" placeholder="0 for unlimited" {...field} />
                            </FormControl>
                            <FormDescription>
                              Number of days before download link expires (0 = never)
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </TabsContent>

          {/* Attributes Tab */}
          <TabsContent value="attributes" className="space-y-4">
            <AttributeManager 
              productId={product?.id} 
              initialAttributes={productAttributes}
              onAttributesChange={handleAttributesChange}
            />
          </TabsContent>

          {/* Pricing Tab */}
          <TabsContent value="pricing" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                name="isSale"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between space-x-2">
                    <div>
                      <FormLabel>On Sale</FormLabel>
                      <FormDescription>
                        Enable if this product is on sale
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
            
            {isSaleValue && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg">
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
              </div>
            )}
            
            <div className="space-y-4 border rounded-lg p-4">
              <h3 className="text-sm font-medium">Bulk Pricing</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </div>
            
            <div className="space-y-4 border rounded-lg p-4">
              <h3 className="text-sm font-medium">Tax Settings</h3>
              
              <FormField
                control={form.control}
                name="taxable"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between space-x-2">
                    <div>
                      <FormLabel>Taxable Product</FormLabel>
                      <FormDescription>
                        Enable if this product is subject to tax
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
              
              {taxableValue && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="taxClass"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tax Class</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select tax class" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="standard">Standard</SelectItem>
                            <SelectItem value="reduced">Reduced Rate</SelectItem>
                            <SelectItem value="zero">Zero Rate</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="taxRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tax Rate (%)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="0" 
                            max="100" 
                            step="0.01"
                            {...field}
                            value={field.value || ''}
                          />
                        </FormControl>
                        <FormDescription>
                          Custom tax rate for this product
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>
          </TabsContent>
          
          {/* Inventory Tab */}
          <TabsContent value="inventory" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="sku"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SKU (Stock Keeping Unit)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter SKU" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormDescription>
                      Unique identifier for this product
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="barcode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Barcode (UPC/EAN/ISBN)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter barcode" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="stockManagement"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between space-x-2">
                  <div>
                    <FormLabel>Track Inventory</FormLabel>
                    <FormDescription>
                      Enable to track stock for this product
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
            
            {stockManagementValue && (
              <div className="space-y-4 border rounded-lg p-4 bg-slate-50">
                <h3 className="text-sm font-medium">Stock Management</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="stock"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Stock</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" {...field} />
                        </FormControl>
                        <FormDescription>
                          Current inventory level
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="lowStockThreshold"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Low Stock Threshold</FormLabel>
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
                          Get alerts when stock reaches this level
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="stockStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stock Status</FormLabel>
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
                          <SelectItem value="In Stock">In Stock</SelectItem>
                          <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                          <SelectItem value="On Backorder">On Backorder</SelectItem>
                          <SelectItem value="Discontinued">Discontinued</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Override automatic stock status
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="allowBackorders"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between space-x-2">
                      <div>
                        <FormLabel>Allow Backorders</FormLabel>
                        <FormDescription>
                          Allow customers to purchase even when out of stock
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
            )}
            
            <div className="space-y-4 border rounded-lg p-4">
              <h3 className="text-sm font-medium">Order Limitations</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="minOrderQuantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Minimum Purchase Quantity</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="1" 
                          placeholder="1"
                          {...field}
                          value={field.value || '1'}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="maxOrderQuantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Maximum Purchase Quantity</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0" 
                          placeholder="0 for unlimited"
                          {...field}
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormDescription>
                        0 means no limit
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            {!isDigitalValue && (
              <div className="space-y-4 border rounded-lg p-4">
                <h3 className="text-sm font-medium">Dimensions & Weight</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <FormField
                    control={form.control}
                    name="dimensions.length"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Length</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="0" 
                            step="0.01"
                            placeholder="0"
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
                    name="dimensions.width"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Width</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="0" 
                            step="0.01"
                            placeholder="0"
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
                    name="dimensions.height"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Height</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="0" 
                            step="0.01"
                            placeholder="0"
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
                    name="dimensions.unit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Unit</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select unit" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="cm">cm</SelectItem>
                            <SelectItem value="in">in</SelectItem>
                            <SelectItem value="mm">mm</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <FormField
                    control={form.control}
                    name="weight.value"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Weight</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="0" 
                            step="0.01"
                            placeholder="0"
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
                    name="weight.unit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Weight Unit</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select unit" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="kg">kg</SelectItem>
                            <SelectItem value="g">g</SelectItem>
                            <SelectItem value="lb">lb</SelectItem>
                            <SelectItem value="oz">oz</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}
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
          <TabsContent value="advanced" className="space-y-6">
            {/* Product Badges Section */}
            <div className="bg-muted/50 rounded-md p-4">
              <h3 className="font-medium mb-2">Product Badges</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Configure special badges for this product
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            </div>
            
            {/* Shipping Section */}
            {!isDigitalValue && (
              <div className="bg-muted/50 rounded-md p-4">
                <h3 className="font-medium mb-2">Shipping Settings</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Configure shipping options for this product
                </p>
                
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="requiresShipping"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel>Requires Shipping</FormLabel>
                          <FormDescription>
                            This product requires physical shipping
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
                  
                  {requiresShippingValue && (
                    <>
                      <FormField
                        control={form.control}
                        name="freeShipping"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                            <div className="space-y-0.5">
                              <FormLabel>Free Shipping</FormLabel>
                              <FormDescription>
                                Offer free shipping for this product
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
                        name="shippingClass"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Shipping Class</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select shipping class" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="standard">Standard</SelectItem>
                                <SelectItem value="express">Express</SelectItem>
                                <SelectItem value="bulky">Bulky Items</SelectItem>
                                <SelectItem value="fragile">Fragile</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Choose a shipping class for special handling
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}
                </div>
              </div>
            )}
            
            {/* SEO Settings */}
            <div className="bg-muted/50 rounded-md p-4">
              <h3 className="font-medium mb-2">SEO Settings</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Configure search engine optimization for this product
              </p>
              
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="metaTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meta Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter SEO title" {...field} />
                      </FormControl>
                      <FormDescription>
                        Appears in browser tab and search results (Max 60 characters recommended)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="metaDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meta Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter meta description" 
                          {...field} 
                          className="min-h-[80px]"
                        />
                      </FormControl>
                      <FormDescription>
                        Displayed in search engine results (Max 160 characters recommended)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="metaKeywords"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meta Keywords</FormLabel>
                      <FormControl>
                        <Input placeholder="keyword1, keyword2, keyword3" {...field} />
                      </FormControl>
                      <FormDescription>
                        Comma-separated keywords for search engines
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="canonicalUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Canonical URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/product-url" {...field} />
                      </FormControl>
                      <FormDescription>
                        The preferred URL for search engines to use
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
