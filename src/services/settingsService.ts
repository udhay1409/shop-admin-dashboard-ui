
import { supabase } from "@/integrations/supabase/client";

// Types for settings
export interface StoreSettings {
  storeName: string;
  storeUrl: string;
  description?: string;
  contactEmail: string;
  contactPhone: string;
  businessType: string;
  storeOpen: boolean;
}

export interface AppearanceSettings {
  theme: 'light' | 'dark' | 'system';
  colorScheme: string;
  fontFamily: string;
  fontSize: string;
  sidebarCollapsed: boolean;
  denseMode: boolean;
  animationsEnabled: boolean;
}

export interface NotificationSettings {
  emailOrderConfirmation: boolean;
  emailShippingUpdates: boolean;
  emailInventoryAlerts: boolean;
  emailMarketingNews: boolean;
  appOrderNotifications: boolean;
  appInventoryAlerts: boolean;
  appReviewAlerts: boolean;
  desktopNotifications: boolean;
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  loginNotifications: boolean;
  sessionTimeout: number;
}

export interface LocalizationSettings {
  language: string;
  timezone: string;
  dateFormat: string;
  timeFormat: string;
  measurementUnit: string;
  enableAutoTranslation: boolean;
  supportedLanguages: string[];
}

export interface SMTPSettings {
  host: string;
  port: number;
  username: string;
  password: string;
  encryption: 'none' | 'ssl' | 'tls';
  fromEmail: string;
  fromName: string;
  enableSmtp: boolean;
}

export interface EmailTemplate {
  subject: string;
  body: string;
}

export interface EmailTemplates {
  welcomeSubject: string;
  welcomeBody: string;
  orderConfirmationSubject: string;
  orderConfirmationBody: string;
  shippingConfirmationSubject: string;
  shippingConfirmationBody: string;
  abandonedCartSubject: string;
  abandonedCartBody: string;
}

export interface PaymentSettings {
  currency: string;
  stripeEnabled: boolean;
  stripeKey?: string;
  paypalEnabled: boolean;
  paypalClientId?: string;
  razorpayEnabled: boolean;
  razorpayKeyId?: string;
  codEnabled: boolean;
}

// Function to get all settings for the current user
export async function getUserSettings() {
  const { data: session } = await supabase.auth.getSession();
  if (!session?.session?.user) {
    throw new Error("User not authenticated");
  }
  
  const userId = session.session.user.id;
  const { data, error } = await supabase
    .from('profiles_settings')
    .select('*')
    .eq('id', userId)
    .single();
    
  if (error) {
    console.error('Error fetching settings:', error);
    if (error.code === 'PGRST116') {
      // Record not found - create default settings
      const defaultSettings = {
        id: userId,
        store_settings: getDefaultStoreSettings(),
        appearance_settings: getDefaultAppearanceSettings(),
        notification_settings: getDefaultNotificationSettings(),
        security_settings: getDefaultSecuritySettings(),
        localization_settings: getDefaultLocalizationSettings(),
        smtp_settings: getDefaultSMTPSettings(),
        email_templates: getDefaultEmailTemplates(),
        payment_settings: getDefaultPaymentSettings(),
      };
      
      // Insert as a single object with settings serialized as JSON
      const { error: insertError } = await supabase
        .from('profiles_settings')
        .insert({
          id: userId,
          store_settings: defaultSettings.store_settings,
          appearance_settings: defaultSettings.appearance_settings,
          notification_settings: defaultSettings.notification_settings,
          security_settings: defaultSettings.security_settings,
          localization_settings: defaultSettings.localization_settings,
          smtp_settings: defaultSettings.smtp_settings,
          email_templates: defaultSettings.email_templates,
          payment_settings: defaultSettings.payment_settings,
        });
        
      if (insertError) {
        console.error('Error creating default settings:', insertError);
        throw insertError;
      }
      
      return defaultSettings;
    }
    throw error;
  }
  
  return data;
}

// Function to update specific settings
export async function updateSettings(
  settingType: 'store_settings' | 'appearance_settings' | 'notification_settings' | 
            'security_settings' | 'localization_settings' | 'smtp_settings' | 
            'email_templates' | 'payment_settings',
  value: any
) {
  const { data: session } = await supabase.auth.getSession();
  if (!session?.session?.user) {
    throw new Error("User not authenticated");
  }
  
  const userId = session.session.user.id;
  
  // Update the specified settings
  const updateData = { [settingType]: value, updated_at: new Date().toISOString() };
  const { data, error } = await supabase
    .from('profiles_settings')
    .update(updateData)
    .eq('id', userId)
    .select();
    
  if (error) {
    console.error(`Error updating ${settingType}:`, error);
    throw error;
  }
  
  return data;
}

// Default settings
export function getDefaultStoreSettings(): StoreSettings {
  return {
    storeName: "Fashiona",
    storeUrl: "https://example.com",
    description: "A premium fashion e-commerce store",
    contactEmail: "contact@example.com",
    contactPhone: "1234567890",
    businessType: "retail",
    storeOpen: true,
  };
}

export function getDefaultAppearanceSettings(): AppearanceSettings {
  return {
    theme: "light",
    colorScheme: "pink",
    fontFamily: "inter",
    fontSize: "medium",
    sidebarCollapsed: false,
    denseMode: false,
    animationsEnabled: true,
  };
}

export function getDefaultNotificationSettings(): NotificationSettings {
  return {
    emailOrderConfirmation: true,
    emailShippingUpdates: true,
    emailInventoryAlerts: true,
    emailMarketingNews: false,
    appOrderNotifications: true,
    appInventoryAlerts: true,
    appReviewAlerts: true,
    desktopNotifications: true,
  };
}

export function getDefaultSecuritySettings(): SecuritySettings {
  return {
    twoFactorEnabled: false,
    loginNotifications: true,
    sessionTimeout: 30,
  };
}

export function getDefaultLocalizationSettings(): LocalizationSettings {
  return {
    language: "en",
    timezone: "America/New_York",
    dateFormat: "MM/DD/YYYY",
    timeFormat: "12",
    measurementUnit: "imperial",
    enableAutoTranslation: false,
    supportedLanguages: ["en"],
  };
}

export function getDefaultSMTPSettings(): SMTPSettings {
  return {
    host: "",
    port: 587,
    username: "",
    password: "",
    encryption: "tls",
    fromEmail: "",
    fromName: "",
    enableSmtp: false,
  };
}

export function getDefaultEmailTemplates(): EmailTemplates {
  return {
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
}

export function getDefaultPaymentSettings(): PaymentSettings {
  return {
    currency: "inr",
    stripeEnabled: false,
    stripeKey: "",
    paypalEnabled: false,
    paypalClientId: "",
    razorpayEnabled: true,
    razorpayKeyId: "rzp_test_example",
    codEnabled: true,
  };
}

// Create useSaveSettings hook
export function emailService() {
  // This would normally connect to an actual email service
  return {
    sendEmail: async ({to, subject, body}: {to: string, subject: string, body: string}, config?: SMTPSettings) => {
      console.log(`Sending email to ${to} with subject "${subject}" and config:`, config);
      return true;
    }
  };
}
