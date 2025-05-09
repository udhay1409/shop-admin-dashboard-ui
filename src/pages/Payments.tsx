
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

const Payments = () => {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Payment Gateway</h1>
        <Button className="bg-purple-600 hover:bg-purple-700">Connect Razorpay</Button>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹12,546.00</div>
                <p className="text-xs text-muted-foreground">+20.1% from last month</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Successful Payments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">142</div>
                <p className="text-xs text-muted-foreground">+12% from last month</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Failed Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground">-3% from last month</p>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Razorpay Integration Status</CardTitle>
              <CardDescription>Current status of your payment gateway configuration</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-dashed p-6 text-center">
                <div className="mb-2 flex justify-center">
                  <CreditCard className="h-10 w-10 text-purple-500" />
                </div>
                <h3 className="mb-1 text-lg font-semibold">Connect Your Razorpay Account</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Link your existing Razorpay account or create a new one to start accepting payments
                </p>
                <Button className="bg-purple-600 hover:bg-purple-700">Configure Razorpay</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="configuration">
          <Card>
            <CardHeader>
              <CardTitle>Razorpay Settings</CardTitle>
              <CardDescription>Configure your Razorpay payment gateway settings</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="key_id" className="text-sm font-medium">API Key ID</label>
                    <input
                      id="key_id"
                      type="text"
                      placeholder="rzp_test_xxxxxxxxxxxx"
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="key_secret" className="text-sm font-medium">API Key Secret</label>
                    <input
                      id="key_secret"
                      type="password"
                      placeholder="••••••••••••••••"
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="webhook_secret" className="text-sm font-medium">Webhook Secret</label>
                  <input
                    id="webhook_secret"
                    type="text"
                    placeholder="Enter your webhook secret"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div className="pt-4">
                  <Button className="bg-purple-600 hover:bg-purple-700">Save Settings</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>View and manage your payment transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="py-3 text-left">Transaction ID</th>
                      <th className="py-3 text-left">Date</th>
                      <th className="py-3 text-left">Amount</th>
                      <th className="py-3 text-left">Status</th>
                      <th className="py-3 text-left">Customer</th>
                      <th className="py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-3">pay_12345abcde</td>
                      <td className="py-3">May 8, 2025</td>
                      <td className="py-3">₹1,200.00</td>
                      <td className="py-3"><span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">Completed</span></td>
                      <td className="py-3">John Doe</td>
                      <td className="py-3 text-right"><Button variant="outline" size="sm">View</Button></td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3">pay_67890fghij</td>
                      <td className="py-3">May 7, 2025</td>
                      <td className="py-3">₹3,500.00</td>
                      <td className="py-3"><span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">Completed</span></td>
                      <td className="py-3">Jane Smith</td>
                      <td className="py-3 text-right"><Button variant="outline" size="sm">View</Button></td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3">pay_54321klmno</td>
                      <td className="py-3">May 6, 2025</td>
                      <td className="py-3">₹850.00</td>
                      <td className="py-3"><span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">Failed</span></td>
                      <td className="py-3">Robert Brown</td>
                      <td className="py-3 text-right"><Button variant="outline" size="sm">View</Button></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Payments;

// Missing CreditCard component import
import { CreditCard } from "lucide-react";
