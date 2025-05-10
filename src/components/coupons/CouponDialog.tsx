
import React, { useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Coupon, CouponType } from "@/types/coupon";
import { Ticket, Calendar } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const couponFormSchema = z.object({
  id: z.string().optional(),
  code: z.string().min(3, "Code must be at least 3 characters"),
  type: z.enum(["percentage", "fixed", "free_shipping", "buy_x_get_y"]),
  value: z.coerce.number().min(0),
  minPurchase: z.coerce.number().min(0).optional(),
  maxDiscount: z.coerce.number().min(0).optional(),
  applicableProducts: z.enum(["all", "specific"]),
  applicableCategories: z.enum(["all", "specific"]),
  startDate: z.string(),
  endDate: z.string(),
  usageLimit: z.coerce.number().int().min(0).optional(),
  perCustomer: z.coerce.number().int().min(0).optional(),
  description: z.string().optional(),
});

type CouponFormSchema = z.infer<typeof couponFormSchema>;

interface CouponDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  coupon: Coupon | null;
  onSave: (data: Coupon) => void;
}

const CouponDialog = ({ open, onOpenChange, coupon, onSave }: CouponDialogProps) => {
  const form = useForm<CouponFormSchema>({
    resolver: zodResolver(couponFormSchema),
    defaultValues: {
      code: "",
      type: "percentage",
      value: 0,
      minPurchase: 0,
      maxDiscount: 0,
      applicableProducts: "all",
      applicableCategories: "all",
      startDate: new Date().toISOString(),
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(),
      usageLimit: undefined,
      perCustomer: undefined,
      description: "",
    },
  });

  useEffect(() => {
    if (coupon) {
      form.reset({
        id: coupon.id,
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        minPurchase: coupon.minPurchase,
        maxDiscount: coupon.maxDiscount,
        applicableProducts: coupon.applicableProducts,
        applicableCategories: coupon.applicableCategories,
        startDate: coupon.startDate,
        endDate: coupon.endDate,
        usageLimit: coupon.usageLimit,
        perCustomer: coupon.perCustomer,
        description: coupon.description,
      });
    } else {
      form.reset({
        code: "",
        type: "percentage",
        value: 0,
        minPurchase: 0,
        maxDiscount: 0,
        applicableProducts: "all",
        applicableCategories: "all",
        startDate: new Date().toISOString(),
        endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(),
        usageLimit: undefined,
        perCustomer: undefined,
        description: "",
      });
    }
  }, [coupon, form]);

  const handleSubmit = (data: CouponFormSchema) => {
    const status = determineStatus(data.startDate, data.endDate);
    const couponData = {
      ...data,
      id: data.id || "",
      status,
      usageCount: coupon?.usageCount || 0,
      createdAt: coupon?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as Coupon;
    
    onSave(couponData);
  };

  const determineStatus = (startDate: string, endDate: string): "active" | "expired" | "scheduled" => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (now < start) return "scheduled";
    if (now > end) return "expired";
    return "active";
  };

  const getValueLabel = (type: CouponType) => {
    switch (type) {
      case "percentage":
        return "%";
      case "fixed":
        return "$";
      case "free_shipping":
        return "";
      case "buy_x_get_y":
        return "Items";
      default:
        return "";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Ticket className="h-5 w-5 text-pink-500" />
            {coupon ? `Edit ${coupon.code}` : "Create New Coupon"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="restrictions">Restrictions</TabsTrigger>
                <TabsTrigger value="usage">Usage Limits</TabsTrigger>
              </TabsList>
              
              <TabsContent value="general" className="pt-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Coupon Code</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. SUMMER25" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Discount Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="percentage">Percentage</SelectItem>
                            <SelectItem value="fixed">Fixed Amount</SelectItem>
                            <SelectItem value="free_shipping">Free Shipping</SelectItem>
                            <SelectItem value="buy_x_get_y">Buy X Get Y</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {form.watch("type") !== "free_shipping" && (
                    <FormField
                      control={form.control}
                      name="value"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {form.watch("type") === "percentage" ? "Discount Percentage" : 
                             form.watch("type") === "fixed" ? "Discount Amount" : 
                             "Free Items"}
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input 
                                type="number" 
                                min={0} 
                                {...field} 
                                className={form.watch("type") === "fixed" ? "pl-6" : ""}
                              />
                              {form.watch("type") === "fixed" && (
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2">$</span>
                              )}
                              {form.watch("type") === "percentage" && (
                                <span className="absolute right-3 top-1/2 transform -translate-y-1/2">%</span>
                              )}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem className={form.watch("type") === "free_shipping" ? "col-span-2" : ""}>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Brief description of this coupon" 
                            className="resize-none" 
                            {...field} 
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Start Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(new Date(field.value), "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <Calendar className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <CalendarComponent
                              mode="single"
                              selected={field.value ? new Date(field.value) : undefined}
                              onSelect={(date) => field.onChange(date ? date.toISOString() : "")}
                              disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>End Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(new Date(field.value), "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <Calendar className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <CalendarComponent
                              mode="single"
                              selected={field.value ? new Date(field.value) : undefined}
                              onSelect={(date) => field.onChange(date ? date.toISOString() : "")}
                              disabled={(date) => {
                                const startDate = form.watch("startDate");
                                return startDate && date < new Date(startDate);
                              }}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="restrictions" className="pt-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="minPurchase"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Minimum Purchase</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2">$</span>
                            <Input 
                              type="number" 
                              min={0}
                              className="pl-6"
                              {...field} 
                              value={field.value || ""}
                            />
                          </div>
                        </FormControl>
                        <FormDescription>
                          Minimum order amount required
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {form.watch("type") === "percentage" && (
                    <FormField
                      control={form.control}
                      name="maxDiscount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Maximum Discount</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 transform -translate-y-1/2">$</span>
                              <Input 
                                type="number" 
                                min={0}
                                className="pl-6"
                                {...field} 
                                value={field.value || ""} 
                              />
                            </div>
                          </FormControl>
                          <FormDescription>
                            Maximum discount amount
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="applicableProducts"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Restrictions</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select products" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="all">All Products</SelectItem>
                            <SelectItem value="specific">Specific Products</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="applicableCategories"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category Restrictions</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select categories" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            <SelectItem value="specific">Specific Categories</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                {/* Additional product/category selection would go here in a real application */}
              </TabsContent>
              
              <TabsContent value="usage" className="pt-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="usageLimit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total Usage Limit</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min={0}
                            placeholder="Unlimited" 
                            {...field} 
                            value={field.value === undefined ? "" : field.value} 
                          />
                        </FormControl>
                        <FormDescription>
                          Leave blank for unlimited usage
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="perCustomer"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Usage Per Customer</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min={0}
                            placeholder="Unlimited" 
                            {...field} 
                            value={field.value === undefined ? "" : field.value} 
                          />
                        </FormControl>
                        <FormDescription>
                          Leave blank for unlimited usage per customer
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>
            </Tabs>

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">
                {coupon ? "Update Coupon" : "Create Coupon"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CouponDialog;
