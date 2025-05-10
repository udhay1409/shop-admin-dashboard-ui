import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { useSMTPSettings } from "@/hooks/useSettings";
import { sendEmail } from "@/services/emailService";
import { SMTPSettings as SMTPSettingsType } from "@/services/settingsService";

const smtpFormSchema = z.object({
  host: z.string().min(1, {
    message: "SMTP host is required.",
  }),
  port: z.coerce.number().int().positive({
    message: "Port must be a positive integer.",
  }),
  username: z.string().min(1, {
    message: "Username is required.",
  }),
  password: z.string().min(1, {
    message: "Password is required.",
  }),
  encryption: z.enum(["none", "ssl", "tls"]),
  fromEmail: z.string().email({
    message: "Please enter a valid email.",
  }),
  fromName: z.string().min(1, {
    message: "From name is required.",
  }),
  enableSmtp: z.boolean().default(false),
  useSendTest: z.boolean().default(false),
});

type SMTPFormValues = z.infer<typeof smtpFormSchema>;

const SMTPSettings: React.FC = () => {
  const { settings, loading, saveSettings } = useSMTPSettings();
  
  // Default values for the form
  const defaultValues: SMTPFormValues = {
    host: "",
    port: 587,
    username: "",
    password: "",
    encryption: "tls",
    fromEmail: "",
    fromName: "",
    enableSmtp: false,
    useSendTest: false,
  };

  const form = useForm<SMTPFormValues>({
    resolver: zodResolver(smtpFormSchema),
    defaultValues,
  });

  useEffect(() => {
    if (settings && !loading) {
      form.reset({
        ...settings as SMTPSettingsType,
        useSendTest: false,
      });
    }
  }, [settings, loading, form]);

  async function onSubmit(data: SMTPFormValues) {
    // Create a config object with all required properties
    const config = {
      host: data.host,
      port: data.port,
      username: data.username,
      password: data.password,
      encryption: data.encryption,
      fromEmail: data.fromEmail,
      fromName: data.fromName,
      enableSmtp: data.enableSmtp
    };
    
    // Save SMTP settings to database
    const saved = await saveSettings(config);
    console.log("SMTP settings saved:", config);
    
    // If sendTest is checked and save was successful, send a test email
    if (saved && data.useSendTest) {
      const testEmailSent = await sendEmail({
        to: data.fromEmail,
        subject: "Test Email from Your Store",
        body: `<h1>Test Email</h1><p>This is a test email from your store's SMTP configuration.</p>`
      }, config);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>SMTP Settings</CardTitle>
        <CardDescription>
          Configure SMTP settings to enable email notifications from your store.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="enableSmtp"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Enable SMTP</FormLabel>
                    <FormDescription>
                      Enable to use custom SMTP server for sending emails.
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

            <div className={!form.watch("enableSmtp") ? "opacity-50 pointer-events-none" : ""}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <FormField
                  control={form.control}
                  name="host"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SMTP Host</FormLabel>
                      <FormControl>
                        <Input placeholder="smtp.example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="port"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SMTP Port</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SMTP Username</FormLabel>
                      <FormControl>
                        <Input placeholder="username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SMTP Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="encryption"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Encryption</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select encryption type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="ssl">SSL</SelectItem>
                        <SelectItem value="tls">TLS</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Select the type of encryption your SMTP server uses.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
                <FormField
                  control={form.control}
                  name="fromEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>From Email</FormLabel>
                      <FormControl>
                        <Input placeholder="noreply@example.com" type="email" {...field} />
                      </FormControl>
                      <FormDescription>
                        Email address emails will be sent from.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="fromName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>From Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your Store Name" {...field} />
                      </FormControl>
                      <FormDescription>
                        Name that will appear in emails sent.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="useSendTest"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 mb-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Send test email after saving</FormLabel>
                      <FormDescription>
                        A test email will be sent to your "From Email" after settings are saved.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save SMTP Settings"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default SMTPSettings;
