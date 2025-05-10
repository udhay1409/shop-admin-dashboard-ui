
import { useState, useEffect } from 'react';
import { 
  getUserSettings, 
  updateSettings,
  StoreSettings,
  AppearanceSettings,
  NotificationSettings,
  SecuritySettings,
  LocalizationSettings,
  SMTPSettings,
  EmailTemplates,
  PaymentSettings,
} from '@/services/settingsService';
import { useToast } from '@/components/ui/use-toast';

export function useSettings<T>(
  settingType: 'store_settings' | 'appearance_settings' | 'notification_settings' | 
            'security_settings' | 'localization_settings' | 'smtp_settings' | 
            'email_templates' | 'payment_settings'
) {
  const [settings, setSettings] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchSettings() {
      try {
        const userSettings = await getUserSettings();
        setSettings(userSettings[settingType] || null);
      } catch (err) {
        console.error('Error loading settings:', err);
        setError(err instanceof Error ? err : new Error('Failed to load settings'));
      } finally {
        setLoading(false);
      }
    }

    fetchSettings();
  }, [settingType]);

  const saveSettings = async (newSettings: T) => {
    setLoading(true);
    try {
      await updateSettings(settingType, newSettings);
      setSettings(newSettings);
      toast({
        title: 'Settings saved',
        description: 'Your settings have been saved successfully.',
      });
      return true;
    } catch (err) {
      console.error('Error saving settings:', err);
      setError(err instanceof Error ? err : new Error('Failed to save settings'));
      toast({
        title: 'Error saving settings',
        description: 'There was a problem saving your settings.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { settings, loading, error, saveSettings };
}

export function useStoreSettings() {
  return useSettings<StoreSettings>('store_settings');
}

export function useAppearanceSettings() {
  return useSettings<AppearanceSettings>('appearance_settings');
}

export function useNotificationSettings() {
  return useSettings<NotificationSettings>('notification_settings');
}

export function useSecuritySettings() {
  return useSettings<SecuritySettings>('security_settings');
}

export function useLocalizationSettings() {
  return useSettings<LocalizationSettings>('localization_settings');
}

export function useSMTPSettings() {
  return useSettings<SMTPSettings>('smtp_settings');
}

export function useEmailTemplates() {
  return useSettings<EmailTemplates>('email_templates');
}

export function usePaymentSettings() {
  return useSettings<PaymentSettings>('payment_settings');
}
