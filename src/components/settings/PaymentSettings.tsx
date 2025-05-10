
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { CreditCard, Wallet, DollarSign } from "lucide-react";

const paymentFormSchema = z.object({
  currency: z.string({
    required_error: "Please select a currency.",
  }),
  stripeEnabled: z.boolean().default(true),
  stripeKey: z.string().min(10, {
    message: "API key must be at least 10 characters.",
  }).optional(),
  paypalEnabled: z.boolean().default(false),
  paypalClientId: z.string().min(10, {
    message: "Client ID must be at least 10 characters.",
  }).optional(),
  codEnabled: z.boolean().default(true)
});

type PaymentFormValues = z.infer<typeof paymentFormSchema>;

const PaymentSettings: React.FC = () => {
  const { toast } = useToast();
  
  // Default values for the form
  const defaultValues: Partial<PaymentFormValues> = {
    currency: "usd",
    stripeEnabled: true,
    stripeKey: "sk_test_example",
    paypalEnabled: false,
    paypalClientId: "",
    codEnabled: true
  };

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues,
  });

  const watchStripeEnabled = form.watch("stripeEnabled");
  const watchPaypalEnabled = form.watch("paypalEnabled");

  function onSubmit(data: PaymentFormValues) {
    toast({
      title: "Payment settings updated",
      description: "Your payment settings have been updated successfully.",
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Settings</CardTitle>
        <CardDescription>
          Configure payment methods, currencies, and payment processing options.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Default Currency</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="usd">USD - US Dollar</SelectItem>
                      <SelectItem value="eur">EUR - Euro</SelectItem>
                      <SelectItem value="gbp">GBP - British Pound</SelectItem>
                      <SelectItem value="jpy">JPY - Japanese Yen</SelectItem>
                      <SelectItem value="cad">CAD - Canadian Dollar</SelectItem>
                      <SelectItem value="aud">AUD - Australian Dollar</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    The currency used for displaying prices and processing payments.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <CreditCard className="h-5 w-5" /> Credit Card Payment
              </h3>
              
              <FormField
                control={form.control}
                name="stripeEnabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Enable Stripe Payments</FormLabel>
                      <FormDescription>
                        Allow customers to pay using credit or debit cards via Stripe.
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
              
              {watchStripeEnabled && (
                <FormField
                  control={form.control}
                  name="stripeKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stripe Secret Key</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="sk_test_..." {...field} />
                      </FormControl>
                      <FormDescription>
                        Your Stripe secret key used for payment processing.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Wallet className="h-5 w-5" /> PayPal Payment
              </h3>
              
              <FormField
                control={form.control}
                name="paypalEnabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Enable PayPal Payments</FormLabel>
                      <FormDescription>
                        Allow customers to pay using PayPal.
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
              
              {watchPaypalEnabled && (
                <FormField
                  control={form.control}
                  name="paypalClientId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>PayPal Client ID</FormLabel>
                      <FormControl>
                        <Input placeholder="Your PayPal client ID" {...field} />
                      </FormControl>
                      <FormDescription>
                        Your PayPal client ID for processing payments.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <DollarSign className="h-5 w-5" /> Other Payment Methods
              </h3>
              
              <FormField
                control={form.control}
                name="codEnabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Enable Cash on Delivery</FormLabel>
                      <FormDescription>
                        Allow customers to pay when they receive their order.
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
            
            <div className="flex justify-end">
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default PaymentSettings;
