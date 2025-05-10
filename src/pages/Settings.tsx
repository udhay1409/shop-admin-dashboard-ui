
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Settings, Store, CreditCard, Bell, Shield, Globe, Palette, Mail } from "lucide-react";
import ProfileSettings from "@/components/settings/ProfileSettings";
import StoreSettings from "@/components/settings/StoreSettings";
import PaymentSettings from "@/components/settings/PaymentSettings";
import NotificationSettings from "@/components/settings/NotificationSettings";
import SecuritySettings from "@/components/settings/SecuritySettings";
import LocalizationSettings from "@/components/settings/LocalizationSettings";
import AppearanceSettings from "@/components/settings/AppearanceSettings";
import SMTPSettings from "@/components/settings/SMTPSettings";

const SettingsPage: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-1.5">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and store preferences
        </p>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-8 gap-2">
          <TabsTrigger value="profile" className="flex flex-col sm:flex-row gap-2 items-center">
            <Settings size={18} />
            <span className="hidden md:block">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="store" className="flex flex-col sm:flex-row gap-2 items-center">
            <Store size={18} />
            <span className="hidden md:block">Store</span>
          </TabsTrigger>
          <TabsTrigger value="payment" className="flex flex-col sm:flex-row gap-2 items-center">
            <CreditCard size={18} />
            <span className="hidden md:block">Payment</span>
          </TabsTrigger>
          <TabsTrigger value="smtp" className="flex flex-col sm:flex-row gap-2 items-center">
            <Mail size={18} />
            <span className="hidden md:block">Email</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex flex-col sm:flex-row gap-2 items-center">
            <Bell size={18} />
            <span className="hidden md:block">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex flex-col sm:flex-row gap-2 items-center">
            <Shield size={18} />
            <span className="hidden md:block">Security</span>
          </TabsTrigger>
          <TabsTrigger value="localization" className="flex flex-col sm:flex-row gap-2 items-center">
            <Globe size={18} />
            <span className="hidden md:block">Localization</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex flex-col sm:flex-row gap-2 items-center">
            <Palette size={18} />
            <span className="hidden md:block">Appearance</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <ProfileSettings />
        </TabsContent>
        
        <TabsContent value="store">
          <StoreSettings />
        </TabsContent>
        
        <TabsContent value="payment">
          <PaymentSettings />
        </TabsContent>
        
        <TabsContent value="smtp">
          <SMTPSettings />
        </TabsContent>
        
        <TabsContent value="notifications">
          <NotificationSettings />
        </TabsContent>
        
        <TabsContent value="security">
          <SecuritySettings />
        </TabsContent>
        
        <TabsContent value="localization">
          <LocalizationSettings />
        </TabsContent>
        
        <TabsContent value="appearance">
          <AppearanceSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
