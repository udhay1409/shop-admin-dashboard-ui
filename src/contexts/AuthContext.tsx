import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Customer } from '@/types/customer';
import { supabase } from '@/integrations/supabase/client';
import { Profile, UserRole } from '@/types/supabase';

// Define the shape of our auth context
interface AuthContextType {
  user: Customer | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  userRole: 'admin' | 'staff' | 'customer' | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (userData: Partial<Customer>) => void;
  checkUserRole: () => Promise<string | null>;
}

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create a custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Mock user data (in a real app, this would come from the backend)
const mockUsers: Customer[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+91 98765 43210',
    status: 'Active',
    joinedDate: '2023-01-15',
    lastLoginDate: '2024-05-09',
    totalOrders: 5,
    totalSpent: 12500,
    address: '123 Main St, Mumbai, India - 400001',
    notes: 'Prefers evening delivery',
    emailSubscription: true
  }
];

interface AuthProviderProps {
  children: ReactNode;
}

// Provider component that wraps the app and makes auth available to all children
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<Customer | null>(null);
  const [userRole, setUserRole] = useState<'admin' | 'staff' | 'customer' | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check the user's role from Supabase
  const checkUserRole = async (): Promise<string | null> => {
    try {
      if (!user) return null;

      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching user role:', error);
        return null;
      }

      return data?.role || 'customer';
    } catch (error) {
      console.error('Error checking user role:', error);
      return null;
    }
  };

  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const checkAuth = async () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          
          // Set up a session
          const { data: { session } } = await supabase.auth.getSession();
          
          // If session exists, fetch the user role
          if (session) {
            const role = await checkUserRole();
            setUserRole(role as 'admin' | 'staff' | 'customer' | null);
          }
        } catch (error) {
          console.error('Failed to parse stored user:', error);
          localStorage.removeItem('user');
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Attempt to sign in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        toast({
          title: "Login failed",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }
      
      if (data.user) {
        // Fetch user profile from profiles table
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();
          
        if (profileError) {
          console.error('Error fetching profile:', profileError);
        }
        
        // Fetch user role
        const { data: roleData, error: roleError } = await supabase
          .from('user_roles')
          .select('*')
          .eq('user_id', data.user.id)
          .single();
          
        if (roleError && roleError.code !== 'PGRST116') { // PGRST116 is "row not found" error
          console.error('Error fetching role:', roleError);
        }
        
        // Get role (default to customer if none found)
        const role = roleData?.role || 'customer';
        setUserRole(role as 'admin' | 'staff' | 'customer');

        // Create a merged user object with profile data and auth data
        const updatedUser: Customer = {
          id: data.user.id,
          email: data.user.email || '',
          name: profileData ? 
            `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim() : 
            data.user.email?.split('@')[0] || 'User',
          status: 'Active',
          joinedDate: data.user.created_at || new Date().toISOString(),
          lastLoginDate: new Date().toISOString(),
          phone: profileData?.phone || '',
          totalOrders: 0,
          totalSpent: 0,
          emailSubscription: true
        };
        
        // Save the user to state and localStorage
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        toast({
          title: "Login successful",
          description: `Welcome back, ${updatedUser.name}!`,
        });
        
        // Redirect based on role
        if (role === 'admin') {
          navigate('/');
        } else {
          navigate('/store');
        }
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login failed",
        description: "An error occurred during login.",
        variant: "destructive",
      });
      return false;
    }
  };

  // Register function
  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      // In a real app, you would make an API request to create the user
      // We'll use Supabase Auth to create the user
      const firstName = name.split(' ')[0];
      const lastName = name.split(' ').slice(1).join(' ');
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName
          }
        }
      });
      
      if (error) {
        toast({
          title: "Registration failed",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }
      
      if (data.user) {
        // In Supabase, the profile should be auto-created by our trigger
        // Add default role for new user
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({
            user_id: data.user.id,
            role: 'customer'
          });
          
        if (roleError) {
          console.error('Error setting user role:', roleError);
        }
        
        toast({
          title: "Registration successful",
          description: "Your account has been created. Please verify your email if required.",
        });
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration failed",
        description: "An error occurred during registration.",
        variant: "destructive",
      });
      return false;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setUserRole(null);
      localStorage.removeItem('user');
      toast({
        title: "Logged out",
        description: "You have been logged out successfully.",
      });
      navigate('/store');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Update user profile
  const updateProfile = async (userData: Partial<Customer>) => {
    if (user) {
      try {
        const updatedUser = { ...user, ...userData };
        
        // Update the profile in Supabase
        if (user.id) {
          const nameParts = updatedUser.name.split(' ');
          const firstName = nameParts[0];
          const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
          
          const { error } = await supabase
            .from('profiles')
            .update({
              first_name: firstName,
              last_name: lastName,
              phone: updatedUser.phone
            })
            .eq('id', user.id);
            
          if (error) {
            console.error('Error updating profile:', error);
            toast({
              title: "Profile update failed",
              description: error.message,
              variant: "destructive",
            });
            return;
          }
        }
        
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        toast({
          title: "Profile updated",
          description: "Your profile has been updated successfully.",
        });
      } catch (error) {
        console.error('Error updating profile:', error);
        toast({
          title: "Profile update failed",
          description: "An error occurred while updating your profile.",
          variant: "destructive",
        });
      }
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    userRole,
    login,
    register,
    logout,
    updateProfile,
    checkUserRole
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
