
import React, { useState } from 'react';
import { Mail, Check, ArrowRight, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useToast } from '@/hooks/use-toast';

interface VerifyEmailProps {
  email: string;
  onComplete: () => void;
}

const VerifyEmail: React.FC<VerifyEmailProps> = ({ email, onComplete }) => {
  const { toast } = useToast();
  const [value, setValue] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const handleVerify = async () => {
    // In a real app, send verification code to your API
    setIsVerifying(true);

    // Simulate API call
    setTimeout(() => {
      setIsVerifying(false);
      setIsVerified(true);
      toast({
        title: 'Email verified',
        description: 'Your email has been successfully verified.',
      });
      
      // Redirect after short delay
      setTimeout(onComplete, 1500);
    }, 1500);
  };

  const handleResendCode = async () => {
    setIsSending(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSending(false);
      toast({
        title: 'Verification code sent',
        description: `A new verification code has been sent to ${email}`,
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="mx-auto w-12 h-12 rounded-full bg-[#EC008C]/10 flex items-center justify-center mb-2">
            {isVerified ? (
              <Check className="h-6 w-6 text-[#EC008C]" />
            ) : (
              <Mail className="h-6 w-6 text-[#EC008C]" />
            )}
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            {isVerified ? 'Email Verified' : 'Verify your email'}
          </CardTitle>
          <CardDescription className="text-center">
            {isVerified ? (
              'Your email has been successfully verified.'
            ) : (
              <>We've sent a verification code to <span className="font-medium">{email}</span></>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isVerified && (
            <div className="space-y-4">
              <div className="flex flex-col items-center space-y-2">
                <div className="text-sm text-gray-500 mb-2">
                  Enter the 6-digit code sent to your email
                </div>
                <InputOTP
                  maxLength={6}
                  value={value}
                  onChange={setValue}
                  disabled={isVerifying}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              
              <Button 
                onClick={handleVerify} 
                disabled={value.length !== 6 || isVerifying || isVerified}
                className="w-full"
              >
                {isVerifying ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Verifying
                  </>
                ) : (
                  <>
                    Verify Email
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          )}
          
          {isVerified && (
            <Button 
              onClick={onComplete}
              className="w-full"
            >
              Continue to Login
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </CardContent>
        {!isVerified && (
          <CardFooter className="border-t pt-4">
            <div className="text-center w-full text-sm">
              Didn't receive a code?{' '}
              <Button
                variant="link"
                size="sm"
                className="p-0 h-auto text-[#EC008C] font-semibold underline-offset-4 hover:text-[#D1007D]"
                disabled={isSending}
                onClick={handleResendCode}
              >
                {isSending ? (
                  <>
                    <RefreshCw className="mr-1 h-3 w-3 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Resend code'
                )}
              </Button>
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default VerifyEmail;
