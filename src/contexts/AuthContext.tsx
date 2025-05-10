
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Customer } from '@/types/customer';

// Define the shape of our auth context
interface AuthContextType {
  user: Customer | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (userData: Partial<Customer>) => void;
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
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
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
      // In a real app, you would make an API request to verify credentials
      // For demo purposes, we'll use mock data
      const foundUser = mockUsers.find(u => u.email === email);
      
      if (foundUser) {
        // In a real app, you would verify the password hash here
        // For demo, we'll assume the password is correct if the user exists
        
        // Update the last login date
        const updatedUser = {
          ...foundUser,
          lastLoginDate: new Date().toISOString()
        };
        
        // Save the user to state and localStorage
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        toast({
          title: "Login successful",
          description: `Welcome back, ${updatedUser.name}!`,
        });
        
        return true;
      }
      
      toast({
        title: "Login failed",
        description: "Invalid email or password.",
        variant: "destructive",
      });
      
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
      // For demo purposes, we'll just simulate a successful registration
      
      // Check if user already exists
      const existingUser = mockUsers.find(u => u.email === email);
      
      if (existingUser) {
        toast({
          title: "Registration failed",
          description: "A user with this email already exists.",
          variant: "destructive",
        });
        return false;
      }
      
      // In a real app, you would hash the password and store the user in a database
      // For demo, we'll just create an in-memory user
      const newUser: Customer = {
        id: `${mockUsers.length + 1}`,
        name,
        email,
        status: 'Active',
        joinedDate: new Date().toISOString(),
        lastLoginDate: new Date().toISOString(),
        totalOrders: 0,
        totalSpent: 0,
        emailSubscription: true,
      };
      
      // In a real app, the user would not be automatically logged in after registration
      // They would need to verify their email first
      // For demo purposes, we'll "verify" the email automatically
      
      toast({
        title: "Registration successful",
        description: "Your account has been created.",
      });
      
      // Note: In a real app, we would wait for email verification before setting the user
      // For demo purposes, we'll set the user right away
      mockUsers.push(newUser);
      
      return true;
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
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
    navigate('/store');
  };

  // Update user profile
  const updateProfile = (userData: Partial<Customer>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
