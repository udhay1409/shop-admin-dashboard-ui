
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";

const templateFormSchema = z.object({
  welcomeSubject: z.string().min(1, {
    message: "Subject is required.",
  }),
  welcomeBody: z.string().min(1, {
    message: "Template body is required.",
  }),
  orderConfirmationSubject: z.string().min(1, {
    message: "Subject is required.",
  }),
  orderConfirmationBody: z.string().min(1, {
    message: "Template body is required.",
  }),
  shippingConfirmationSubject: z.string().min(1, {
    message: "Subject is required.",
  }),
  shippingConfirmationBody: z.string().min(1, {
    message: "Template body is required.",
  }),
  abandonedCartSubject: z.string().min(1, {
    message: "Subject is required.",
  }),
  abandonedCartBody: z.string().min(1, {
    message: "Template body is required.",
  }),
});

type TemplateFormValues = z.infer<typeof templateFormSchema>;

const EmailTemplatesSettings: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = React.useState("welcome");
  
  const defaultValues: TemplateFormValues = {
    welcomeSubject: "Welcome to our store!",
    welcomeBody: `<h2>Welcome, {{customerName}}!</h2>
<p>Thank you for creating an account with us.</p>
<p>You now have access to:</p>
<ul>
  <li>Order tracking</li>
  <li>Faster checkout</li>
  <li>Exclusive offers</li>
</ul>
<p>If you have any questions, feel free to contact our support team.</p>`,
    
    orderConfirmationSubject: "Your Order #{{orderNumber}} is Confirmed",
    orderConfirmationBody: `<h2>Thank you for your order, {{customerName}}!</h2>
<p>We're pleased to confirm that we've received your order.</p>
<h3>Order Summary:</h3>
<p><strong>Order #:</strong> {{orderNumber}}</p>
<p><strong>Items:</strong> {{items}}</p>
<p><strong>Total:</strong> {{total}}</p>
<p>We'll notify you when your order has been shipped.</p>
<p>Thank you for shopping with us!</p>`,
    
    shippingConfirmationSubject: "Your Order #{{orderNumber}} Has Shipped!",
    shippingConfirmationBody: `<h2>Good news, {{customerName}}!</h2>
<p>Your order #{{orderNumber}} is on its way to you.</p>
<p><strong>Tracking Number:</strong> {{trackingNumber}}</p>
<p><strong>Shipping Provider:</strong> {{carrier}}</p>
<p>Thank you for shopping with us!</p>`,
    
    abandonedCartSubject: "Did You Forget Something?",
    abandonedCartBody: `<h2>Hello {{customerName}},</h2>
<p>We noticed you left some items in your cart:</p>
<p>{{items}}</p>
<p>Your cart is saved and ready whenever you are.</p>
<p><a href="#">Return to your cart</a></p>`,
  };
  
  const form = useForm<TemplateFormValues>({
    resolver: zodResolver(templateFormSchema),
    defaultValues,
  });
  
  function onSubmit(data: TemplateFormValues) {
    // Save templates to localStorage
    localStorage.setItem('emailTemplates', JSON.stringify(data));
    
    // Show success toast
    toast({
      title: "Email templates updated",
      description: "Your email templates have been saved successfully.",
    });
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Email Templates</CardTitle>
        <CardDescription>
          Customize the templates used for automated emails sent to your customers.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="welcome">Welcome</TabsTrigger>
                <TabsTrigger value="orderConfirmation">Order Confirmation</TabsTrigger>
                <TabsTrigger value="shipping">Shipping</TabsTrigger>
                <TabsTrigger value="abandonedCart">Abandoned Cart</TabsTrigger>
              </TabsList>
              
              <TabsContent value="welcome" className="space-y-4 mt-4">
                <FormField
                  control={form.control}
                  name="welcomeSubject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Subject</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="welcomeBody"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Template</FormLabel>
                      <FormControl>
                        <Textarea rows={10} {...field} />
                      </FormControl>
                      <FormDescription>
                        Available variables: {{customerName}}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
              
              <TabsContent value="orderConfirmation" className="space-y-4 mt-4">
                <FormField
                  control={form.control}
                  name="orderConfirmationSubject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Subject</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="orderConfirmationBody"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Template</FormLabel>
                      <FormControl>
                        <Textarea rows={10} {...field} />
                      </FormControl>
                      <FormDescription>
                        Available variables: {{customerName}}, {{orderNumber}}, {{items}}, {{total}}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
              
              <TabsContent value="shipping" className="space-y-4 mt-4">
                <FormField
                  control={form.control}
                  name="shippingConfirmationSubject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Subject</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="shippingConfirmationBody"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Template</FormLabel>
                      <FormControl>
                        <Textarea rows={10} {...field} />
                      </FormControl>
                      <FormDescription>
                        Available variables: {{customerName}}, {{orderNumber}}, {{trackingNumber}}, {{carrier}}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
              
              <TabsContent value="abandonedCart" className="space-y-4 mt-4">
                <FormField
                  control={form.control}
                  name="abandonedCartSubject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Subject</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="abandonedCartBody"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Template</FormLabel>
                      <FormControl>
                        <Textarea rows={10} {...field} />
                      </FormControl>
                      <FormDescription>
                        Available variables: {{customerName}}, {{items}}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>
            
            <div className="flex justify-end">
              <Button type="submit">Save Templates</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default EmailTemplatesSettings;
