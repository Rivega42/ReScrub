import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface User {
  id: string;
  email: string;
  emailVerified: boolean;
  isAdmin?: boolean;
  adminRole?: string;
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
    queryKey: ['/api/v1/auth/me'],
    queryFn: async () => { try { const res = await fetch('/api/v1/auth/me', { credentials: 'include', headers: { Authorization: 'Bearer ' + (localStorage.getItem('token') || '') } }); if (!res.ok) return null; const data = await res.json(); return data; } catch { return null; } },
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
      try {
        const data = await apiRequest('/api/v1/auth/login', { method: 'POST', body: { email, password } });
        
        if (!data.success) {
          throw new Error(data.message || 'Ошибка входа');
        }
        
        return data;
      } catch (error: any) {
        // Parse JSON error from apiRequest format: "403: {JSON}"
        let errorMessage = 'Ошибка входа';
        
        if (error.message) {
          const match = error.message.match(/^\d+:\s*(.+)$/);
          if (match) {
            try {
              const errorData = JSON.parse(match[1]);
              errorMessage = errorData.message || errorMessage;
            } catch {
              // If JSON parsing fails, use the part after status code
              errorMessage = match[1];
            }
          } else {
            errorMessage = error.message;
          }
        }
        
        throw new Error(errorMessage);
      }
    },
    onSuccess: async () => {
      // Force immediate refetch and wait for it to complete
      await queryClient.invalidateQueries({ queryKey: ['/api/v1/auth/me'] });
      await refetchUser();
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      try {
        const data = await apiRequest('/api/v1/auth/register', { method: 'POST', body: { email, password } });
        
        if (!data.success) {
          throw new Error(data.message || 'Ошибка регистрации');
        }
        
        return data;
      } catch (error: any) {
        // Parse JSON error from apiRequest format: "403: {JSON}"
        let errorMessage = 'Ошибка регистрации';
        
        if (error.message) {
          const match = error.message.match(/^\d+:\s*(.+)$/);
          if (match) {
            try {
              const errorData = JSON.parse(match[1]);
              errorMessage = errorData.message || errorMessage;
            } catch {
              // If JSON parsing fails, use the part after status code
              errorMessage = match[1];
            }
          } else {
            errorMessage = error.message;
          }
        }
        
        throw new Error(errorMessage);
      }
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const data = await apiRequest('/api/v1/auth/logout', { method: 'POST' });
      return data;
    },
    onSuccess: () => {
      queryClient.clear();
      queryClient.invalidateQueries({ queryKey: ['/api/v1/auth/me'] });
    },
  });

  // Email verification mutation
  const verifyEmailMutation = useMutation({
    mutationFn: async ({ email, token }: { email: string; token: string }) => {
      const data = await apiRequest('/api/auth/verify-email', { method: 'POST', body: { email, token } });
      
      if (!data.success) {
        throw new Error(data.message || 'Ошибка подтверждения email');
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/v1/auth/me'] });
    },
  });

  // Memoize auth functions to prevent useEffect loops
  const login = useCallback(async (email: string, password: string) => {
    await loginMutation.mutateAsync({ email, password });
  }, []); // No dependencies - mutation is stable

  const register = useCallback(async (email: string, password: string) => {
    await registerMutation.mutateAsync({ email, password });
  }, []); // No dependencies - mutation is stable

  const logout = useCallback(async () => {
    await logoutMutation.mutateAsync();
  }, []); // No dependencies - mutation is stable

  const verifyEmail = useCallback(async (email: string, token: string) => {
    await verifyEmailMutation.mutateAsync({ email, token });
  }, []); // No dependencies - mutation is stable

  const refetchUserCallback = useCallback(() => refetchUser(), []);

  const contextValue: AuthContextType = {
    user,
    isLoading: !isInitialized || isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    verifyEmail,
    refetchUser: refetchUserCallback,
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

// Admin guard component for admin-only pages
export function AdminGuard({ 
  children, 
  fallback 
}: { 
  children: React.ReactNode; 
  fallback?: React.ReactNode; 
}) {
  const { user, isAuthenticated, isLoading } = useAuth();

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

  if (!user?.isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Доступ запрещен</h1>
          <p className="text-muted-foreground">У вас нет прав администратора</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}