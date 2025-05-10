
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, KeyRound, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import VerifyEmail from '@/components/auth/VerifyEmail';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { login, isAuthenticated, userRole, isLoading } = useAuth();
  const [showVerification, setShowVerification] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Check if we have a redirect path
  const from = location.state?.from?.pathname || '/';

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      if (userRole === 'admin') {
        navigate('/dashboard');
      } else {
        navigate('/store');
      }
    }
  }, [isAuthenticated, isLoading, navigate, userRole]);

  const onSubmit = async (values: LoginFormValues) => {
    try {
      setErrorMessage(null);
      const success = await login(values.email, values.password);
      
      if (success) {
        toast({
          title: 'Login successful',
          description: 'Welcome back!',
        });
      }
    } catch (error: any) {
      console.error('Login error:', error);
      
      if (error.message && error.message.includes('Email not confirmed')) {
        setUserEmail(values.email);
        setShowVerification(true);
      } else {
        setErrorMessage(error.message || 'An unexpected error occurred.');
        toast({
          title: 'Login failed',
          description: error.message || 'An unexpected error occurred.',
          variant: 'destructive',
        });
      }
    }
  };

  const handleVerificationComplete = () => {
    toast({
      title: 'Verification complete',
      description: 'You can now log in',
    });
    setShowVerification(false);
  };

  // If still loading, show a spinner
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#EC008C]"></div>
      </div>
    );
  }

  // If we need to show the email verification component
  if (showVerification) {
    return <VerifyEmail email={userEmail} onComplete={handleVerificationComplete} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
          <CardDescription className="text-center">
            Enter your email and password to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {errorMessage && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Enter your email"
                          className="pl-10"
                          {...field}
                        />
                      </div>
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
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <KeyRound className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          type="password"
                          placeholder="Enter your password"
                          className="pl-10"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Login
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </Form>
          
          {/* Display admin test credentials */}
          <div className="mt-4 p-3 bg-gray-50 rounded-md border border-gray-200">
            <p className="text-sm font-medium text-gray-700">Admin Test Credentials:</p>
            <p className="text-xs text-gray-600">Email: kansha@mntfuture.com</p>
            <p className="text-xs text-gray-600">Password: 123456</p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2 border-t pt-4">
          <div className="text-center text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#EC008C] font-semibold underline underline-offset-4 hover:text-[#D1007D]">
              Register
            </Link>
          </div>
          <div className="text-center text-sm">
            <Link to="/forgot-password" className="text-[#EC008C] font-semibold underline underline-offset-4 hover:text-[#D1007D]">
              Forgot password?
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
