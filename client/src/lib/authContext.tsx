import { createContext, useContext, useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface User {
  id: string;
  email: string;
  emailVerified: boolean;
  profile?: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    phone: string | null;
    phoneVerified: boolean;
  };
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  verifyEmail: (email: string, token: string) => Promise<void>;
  refetchUser: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const [isInitialized, setIsInitialized] = useState(false);

  // Get current user
  const { 
    data: userResponse, 
    isLoading, 
    error,
    refetch: refetchUser 
  } = useQuery({
    queryKey: ['/api/auth/me'],
    enabled: true,
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const user = (userResponse as any)?.success ? (userResponse as any).user : null;
  const isAuthenticated = !!user && user.emailVerified;

  // Initialize auth state
  useEffect(() => {
    if (!isLoading) {
      setIsInitialized(true);
    }
  }, [isLoading]);

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const response = await apiRequest('POST', '/api/auth/login', { email, password });
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Ошибка входа');
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const response = await apiRequest('POST', '/api/auth/register', { email, password });
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Ошибка регистрации');
      }
      
      return data;
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/auth/logout');
      const data = await response.json();
      return data;
    },
    onSuccess: () => {
      queryClient.clear();
      queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
    },
  });

  // Email verification mutation
  const verifyEmailMutation = useMutation({
    mutationFn: async ({ email, token }: { email: string; token: string }) => {
      const response = await apiRequest('POST', '/api/auth/verify-email', { email, token });
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Ошибка подтверждения email');
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
    },
  });

  const contextValue: AuthContextType = {
    user,
    isLoading: !isInitialized || isLoading,
    isAuthenticated,
    login: async (email: string, password: string) => {
      await loginMutation.mutateAsync({ email, password });
    },
    register: async (email: string, password: string) => {
      await registerMutation.mutateAsync({ email, password });
    },
    logout: async () => {
      await logoutMutation.mutateAsync();
    },
    verifyEmail: async (email: string, token: string) => {
      await verifyEmailMutation.mutateAsync({ email, token });
    },
    refetchUser: () => refetchUser(),
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Auth guard component
export function AuthGuard({ 
  children, 
  fallback 
}: { 
  children: React.ReactNode; 
  fallback?: React.ReactNode; 
}) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return fallback || <div>Unauthorized</div>;
  }

  return <>{children}</>;
}