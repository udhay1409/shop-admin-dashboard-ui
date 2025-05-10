
import { toast } from "@/components/ui/use-toast";

export interface EmailConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  encryption: "none" | "ssl" | "tls";
  fromEmail: string;
  fromName: string;
  enableSmtp: boolean;
}

interface EmailOptions {
  to: string;
  subject: string;
  body: string;
  replyTo?: string;
}

// This would normally connect to your SMTP server
// For demo purposes, we're simulating email sending
export const sendEmail = async (options: EmailOptions, config?: EmailConfig): Promise<boolean> => {
  // Get email configuration from localStorage if not provided
  const emailConfig = config || getEmailConfig();
  
  if (!emailConfig.enableSmtp) {
    console.warn("SMTP is not enabled in settings");
    return false;
  }
  
  console.log(`Sending email to ${options.to} with subject "${options.subject}"`);
  console.log(`Using SMTP server: ${emailConfig.host}:${emailConfig.port}`);
  
  try {
    // In a real implementation, this would use a library like nodemailer
    // or make an API request to your backend
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    console.log("Email sent successfully");
    return true;
  } catch (error) {
    console.error("Failed to send email:", error);
    return false;
  }
};

// Email templates
export const createOrderConfirmationEmail = (
  customerName: string, 
  orderNumber: string, 
  items: string, 
  total: string
): EmailOptions => {
  return {
    to: "", // Will be filled when sending
    subject: `Order Confirmed #${orderNumber}`,
    body: `
      <h2>Thank you for your order, ${customerName}!</h2>
      <p>We're pleased to confirm that we've received your order.</p>
      <h3>Order Summary:</h3>
      <p><strong>Order #:</strong> ${orderNumber}</p>
      <p><strong>Items:</strong> ${items}</p>
      <p><strong>Total:</strong> ${total}</p>
      <p>We'll notify you when your order has been shipped.</p>
      <p>Thank you for shopping with us!</p>
    `
  };
};

export const createShippingConfirmationEmail = (
  customerName: string,
  orderNumber: string,
  trackingNumber?: string,
  carrier?: string
): EmailOptions => {
  return {
    to: "", // Will be filled when sending
    subject: `Your Order #${orderNumber} Has Shipped!`,
    body: `
      <h2>Good news, ${customerName}!</h2>
      <p>Your order #${orderNumber} is on its way to you.</p>
      ${trackingNumber ? `<p><strong>Tracking Number:</strong> ${trackingNumber}</p>` : ''}
      ${carrier ? `<p><strong>Shipping Provider:</strong> ${carrier}</p>` : ''}
      <p>Thank you for shopping with us!</p>
    `
  };
};

export const createWelcomeEmail = (customerName: string): EmailOptions => {
  return {
    to: "", // Will be filled when sending
    subject: "Welcome to Our Store!",
    body: `
      <h2>Welcome, ${customerName}!</h2>
      <p>Thank you for creating an account with us.</p>
      <p>You now have access to:</p>
      <ul>
        <li>Order tracking</li>
        <li>Faster checkout</li>
        <li>Exclusive offers</li>
      </ul>
      <p>If you have any questions, feel free to contact our support team.</p>
    `
  };
};

export const createAbandonedCartEmail = (
  customerName: string,
  items: string
): EmailOptions => {
  return {
    to: "", // Will be filled when sending
    subject: "Did You Forget Something?",
    body: `
      <h2>Hello ${customerName},</h2>
      <p>We noticed you left some items in your cart:</p>
      <p>${items}</p>
      <p>Your cart is saved and ready whenever you are.</p>
      <p><a href="#">Return to your cart</a></p>
    `
  };
};

// Helper to get email configuration from storage
export const getEmailConfig = (): EmailConfig => {
  const defaultConfig: EmailConfig = {
    host: "smtp.example.com",
    port: 587,
    username: "",
    password: "",
    encryption: "tls",
    fromEmail: "noreply@example.com",
    fromName: "My Store",
    enableSmtp: false
  };
  
  try {
    const storedConfig = localStorage.getItem('smtpConfig');
    return storedConfig ? JSON.parse(storedConfig) : defaultConfig;
  } catch (error) {
    console.error("Failed to load email config:", error);
    return defaultConfig;
  }
};

// Save email configuration to storage
export const saveEmailConfig = (config: EmailConfig): void => {
  localStorage.setItem('smtpConfig', JSON.stringify(config));
};
