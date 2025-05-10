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

  // Initialize authentication and set up auth state listener
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      
      // Set up auth state listener FIRST
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (event, session) => {
          if (session?.user) {
            // Using setTimeout to avoid potential deadlock with Supabase
            setTimeout(async () => {
              try {
                // Fetch profile data
                const { data: profileData, error: profileError } = await supabase
                  .from('profiles')
                  .select('*')
                  .eq('id', session.user.id)
                  .single();
                  
                if (profileError) {
                  console.error('Error fetching profile:', profileError);
                }
                
                // Fetch user role
                const { data: roleData, error: roleError } = await supabase
                  .from('user_roles')
                  .select('*')
                  .eq('user_id', session.user.id)
                  .single();
                  
                if (roleError && roleError.code !== 'PGRST116') { // PGRST116 is "row not found" error
                  console.error('Error fetching role:', roleError);
                }
                
                // Get role (default to customer if none found)
                const role = roleData?.role || 'customer';
                setUserRole(role as 'admin' | 'staff' | 'customer');

                // Create a merged user object with profile data and auth data
                const userData: Customer = {
                  id: session.user.id,
                  email: session.user.email || '',
                  name: profileData ? 
                    `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim() : 
                    session.user.email?.split('@')[0] || 'User',
                  status: 'Active',
                  joinedDate: session.user.created_at || new Date().toISOString(),
                  lastLoginDate: new Date().toISOString(),
                  phone: profileData?.phone || '',
                  totalOrders: 0,
                  totalSpent: 0,
                  emailSubscription: true
                };
                
                setUser(userData);
              } catch (error) {
                console.error('Error processing auth state change:', error);
              }
            }, 0);
          } else {
            setUser(null);
            setUserRole(null);
          }
        }
      );
  
      // THEN check for existing session
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // Fetch profile data
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          if (profileError) {
            console.error('Error fetching profile:', profileError);
          }
          
          // Fetch user role
          const { data: roleData, error: roleError } = await supabase
            .from('user_roles')
            .select('*')
            .eq('user_id', session.user.id)
            .single();
            
          if (roleError && roleError.code !== 'PGRST116') { // PGRST116 is "row not found" error
            console.error('Error fetching role:', roleError);
          }
          
          // Get role (default to customer if none found)
          const role = roleData?.role || 'customer';
          setUserRole(role as 'admin' | 'staff' | 'customer');

          // Create a merged user object with profile data and auth data
          const userData: Customer = {
            id: session.user.id,
            email: session.user.email || '',
            name: profileData ? 
              `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim() : 
              session.user.email?.split('@')[0] || 'User',
            status: 'Active',
            joinedDate: session.user.created_at || new Date().toISOString(),
            lastLoginDate: new Date().toISOString(),
            phone: profileData?.phone || '',
            totalOrders: 0,
            totalSpent: 0,
            emailSubscription: true
          };
          
          setUser(userData);
        }
      } catch (error) {
        console.error('Error during authentication check:', error);
      } finally {
        setIsLoading(false);
      }
  
      return () => {
        subscription.unsubscribe();
      };
    };
  
    initAuth();
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
        // Properly throw the error to be caught in the component
        throw error;
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
        
        // Save the user to state
        setUser(updatedUser);
        
        toast({
          title: "Login successful",
          description: `Welcome back, ${updatedUser.name}!`,
        });
        
        // Redirect based on role
        if (role === 'admin') {
          navigate('/dashboard');
        } else {
          navigate('/store');
        }
        
        return true;
      }
      
      return false;
    } catch (error: any) {
      console.error('Login error:', error);
      // Re-throw the error to be caught in the component
      throw error;
    }
  };

  // Register function
  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      // Create a new user in Supabase Auth
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
        
        // Don't auto-login the user - they need to verify email first if required
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
      toast({
        title: "Logged out",
        description: "You have been logged out successfully.",
      });
      navigate('/login');
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
