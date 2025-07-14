
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const token = localStorage.getItem('auth-token');
    const userData = localStorage.getItem('user-data');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('auth-token');
        localStorage.removeItem('user-data');
      }
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      console.log('Attempting login with username:', username);
      
      // Try JWT authentication first
      const jwtResponse = await fetch('https://erma.shop/wp-json/jwt-auth/v1/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      console.log('JWT login response status:', jwtResponse.status);

      if (jwtResponse.ok) {
        const jwtData = await jwtResponse.json();
        console.log('JWT response received:', jwtData);

        const user = {
          id: jwtData.user_id?.toString() || '1',
          name: jwtData.user_display_name || username,
          email: jwtData.user_email || '',
        };

        localStorage.setItem('auth-token', jwtData.token);
        localStorage.setItem('user-data', JSON.stringify(user));
        setUser(user);
        
        toast({
          title: "Login successful",
          description: `Welcome back, ${user.name}!`,
        });
        
        return true;
      }

      // Fallback to basic auth with regular password
      const credentials = btoa(`${username}:${password}`);
      
      const response = await fetch('https://erma.shop/wp-json/wp/v2/users/me', {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Basic auth response status:', response.status);
      
      if (response.ok) {
        const userData = await response.json();
        console.log('User data received:', userData);

        const user = {
          id: userData.id?.toString() || '1',
          name: userData.name || username,
          email: userData.email || '',
        };

        localStorage.setItem('auth-token', credentials);
        localStorage.setItem('user-data', JSON.stringify(user));
        setUser(user);
        
        toast({
          title: "Login successful",
          description: `Welcome back, ${user.name}!`,
        });
        
        return true;
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Authentication failed' }));
        console.error('Login failed:', errorData);
        
        let errorMessage = "Invalid username or password.";
        
        if (errorData.code === 'incorrect_password') {
          errorMessage = "Invalid password. Please check your password and try again.";
        } else if (errorData.code === 'invalid_username') {
          errorMessage = "Username not found. Please check your username.";
        } else if (errorData.message) {
          errorMessage = errorData.message;
        }
        
        toast({
          title: "Login failed",
          description: errorMessage,
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login failed",
        description: "Network error. Please check your connection and try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      // Try WordPress REST API registration
      const response = await fetch('https://erma.shop/wp-json/wp/v2/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });

      console.log('Registration response status:', response.status);
      const data = await response.json();
      console.log('Registration response:', data);

      if (response.ok) {
        toast({
          title: "Registration successful",
          description: "Account created! Please create an Application Password in your WordPress profile to login.",
        });
        return true;
      } else {
        console.error('Registration failed:', data);
        
        let errorMessage = "Registration failed. Please try again.";
        if (data.code === 'existing_user_login') {
          errorMessage = "Username already exists. Please choose a different username.";
        } else if (data.code === 'existing_user_email') {
          errorMessage = "Email already exists. Please use a different email address.";
        } else if (data.message) {
          errorMessage = data.message;
        }
        
        toast({
          title: "Registration failed",
          description: errorMessage,
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration failed",
        description: "Network error, please try again",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('auth-token');
    localStorage.removeItem('user-data');
    setUser(null);
    
    toast({
      title: "Logged out",
      description: "See you next time!",
    });
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      login,
      register,
      logout,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};
