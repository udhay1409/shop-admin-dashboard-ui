import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { User, Session, AuthChangeEvent } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

// Define context types
interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  userRole: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<boolean>;
  resetPassword: (newPassword: string) => Promise<boolean>;
  updateProfile: (data: Partial<Profile>) => Promise<boolean>;
  refreshSession: () => Promise<void>;
}

interface Profile {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
}

interface AuthProviderProps {
  children: ReactNode;
}

// Create the context
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Provider component
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [hasInitialized, setHasInitialized] = useState(false);

  // Function to fetch user role - improved to use timeout to prevent recursion
  const fetchUserRole = async (userId: string) => {
    try {
      // Use setTimeout to prevent potential Supabase callback recursion
      setTimeout(async () => {
        try {
          const { data, error } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', userId)
            .single();

          if (error) {
            console.error('Error fetching user role:', error);
            setUserRole('customer'); // Default role
          } else {
            setUserRole(data?.role || 'customer');
          }
        } catch (innerError) {
          console.error('Inner error in fetchUserRole:', innerError);
          setUserRole('customer'); // Default role on error
        } finally {
          // Ensure loading is set to false even if there's an error
          setIsLoading(false);
        }
      }, 0);
    } catch (error) {
      console.error('Error in fetchUserRole:', error);
      setUserRole('customer'); // Default role on error
      setIsLoading(false);
    }
  };

  // Initialize auth state
  useEffect(() => {
    let isMounted = true;
    
    // Set up auth state listener FIRST with debounce to prevent rapid state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, currentSession: Session | null) => {
        if (!isMounted) return;
        
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (!currentSession) {
          setUserRole(null);
          setIsLoading(false);
        } else if (currentSession?.user && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
          fetchUserRole(currentSession.user.id);
        }
      }
    );

    // THEN check for existing session
    const initializeAuth = async () => {
      if (!isMounted) return;
      
      try {
        setIsLoading(true);
        const { data } = await supabase.auth.getSession();
        
        if (isMounted) {
          const currentSession = data?.session;
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
          
          // Fetch user role if there's an existing session
          if (currentSession?.user) {
            await fetchUserRole(currentSession.user.id);
          } else {
            setIsLoading(false);
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        setIsLoading(false);
      } finally {
        if (isMounted) {
          setHasInitialized(true);
        }
      }
    };

    initializeAuth();

    // Cleanup subscription when component unmounts
    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Login function - improved error handling
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        throw error;
      }
      
      // We'll let the auth state change handler update the user role
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      
      return true;
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "Login failed",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
      throw error;
    } finally {
      // Don't set loading to false here, let the auth state change handler do it
    }
  };

  // Register function - updated to handle the name parameter
  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      // Split the name into first_name and last_name (assuming format: "First Last")
      const nameParts = name.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            full_name: name // Store the full name for easy access
          }
        }
      });

      if (error) {
        throw error;
      }

      // Check if email confirmation is required
      if (data.user && !data.user.confirmed_at) {
        toast({
          title: "Verification email sent",
          description: "Please check your email to confirm your account.",
        });
      }
      
      return true;
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: "Registration failed",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function - improved to handle errors better
  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      
      // Clear state synchronously to avoid flickering
      setUserRole(null);
      setUser(null);
      setSession(null);
      
      toast({
        title: "Logout successful",
        description: "You have been logged out.",
      });
    } catch (error: any) {
      console.error('Logout error:', error);
      toast({
        title: "Logout failed",
        description: error.message || "An error occurred during logout.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Forgot password function
  const forgotPassword = async (email: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) {
        throw error;
      }
      
      return true;
    } catch (error: any) {
      console.error('Forgot password error:', error);
      throw error;
    }
  };

  // Reset password function
  const resetPassword = async (newPassword: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) {
        throw error;
      }
      
      return true;
    } catch (error: any) {
      console.error('Reset password error:', error);
      throw error;
    }
  };

  // Update profile function
  const updateProfile = async (profileData: Partial<Profile>): Promise<boolean> => {
    try {
      if (!user) {
        throw new Error('No authenticated user');
      }
      
      // Update auth user metadata
      await supabase.auth.updateUser({
        data: {
          first_name: profileData.first_name,
          last_name: profileData.last_name,
        }
      });
      
      // Update profile in profiles table
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: profileData.first_name,
          last_name: profileData.last_name,
          phone: profileData.phone,
        })
        .eq('id', user.id);
      
      if (error) {
        throw error;
      }
      
      return true;
    } catch (error: any) {
      console.error('Update profile error:', error);
      throw error;
    }
  };

  // Refresh session
  const refreshSession = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.refreshSession();
      if (error) {
        throw error;
      }
      
      setSession(data.session);
      setUser(data.session?.user ?? null);
      
      if (data.session?.user) {
        await fetchUserRole(data.session.user.id);
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Session refresh error:', error);
      setIsLoading(false);
    }
  };

  // Context value
  const value = {
    user,
    session,
    isAuthenticated: !!user,
    isLoading,
    userRole,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    updateProfile,
    refreshSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
