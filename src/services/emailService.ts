
import { SMTPSettings } from './settingsService';

// Note: In a real application, this would connect to a server-side function
// that would handle the actual SMTP communication

/**
 * Creates an email template for order confirmation
 */
export function createOrderConfirmationEmail(
  customerName: string,
  orderId: string,
  items: string,
  totalAmount: string
): {
  to: string;
  subject: string;
  body: string;
} {
  const subject = `Order Confirmation #${orderId}`;
  const body = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Thank you for your order!</h2>
      <p>Hello ${customerName},</p>
      <p>Your order has been received and is being processed.</p>
      <div style="border: 1px solid #ddd; border-radius: 5px; padding: 15px; margin: 15px 0;">
        <h3 style="margin-top: 0;">Order Details</h3>
        <p><strong>Order ID:</strong> ${orderId}</p>
        <p><strong>Items:</strong> ${items}</p>
        <p><strong>Total Amount:</strong> ${totalAmount}</p>
      </div>
      <p>We will notify you once your order ships. If you have any questions, please contact our customer service.</p>
      <p>Thank you for shopping with us!</p>
    </div>
  `;

  return {
    to: '', // This will be set by the calling code
    subject,
    body
  };
}

export function sendEmail({ to, subject, body }: {
  to: string;
  subject: string;
  body: string;
}, config?: SMTPSettings): Promise<boolean> {
  // This is a mock implementation for demonstration purposes
  console.log(`Sending email to ${to} with subject "${subject}" using config:`, config);
  
  // Simulate an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 1000);
  });
}

export function getEmailConfig(): SMTPSettings {
  // Retrieve from localStorage for development purposes
  // In production, this should come from the database
  const storedConfig = localStorage.getItem('smtpSettings');
  if (storedConfig) {
    try {
      return JSON.parse(storedConfig);
    } catch (e) {
      console.error('Error parsing stored SMTP config:', e);
    }
  }
  
  // Default config if none is stored
  return {
    host: '',
    port: 587,
    username: '',
    password: '',
    encryption: 'tls' as const,
    fromEmail: '',
    fromName: '',
    enableSmtp: false
  };
}

export function saveEmailConfig(config: SMTPSettings): void {
  // Save to localStorage for development purposes
  // In production, this should save to the database
  localStorage.setItem('smtpSettings', JSON.stringify(config));
}
