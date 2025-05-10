
import { SMTPSettings } from './settingsService';

// Note: In a real application, this would connect to a server-side function
// that would handle the actual SMTP communication

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
