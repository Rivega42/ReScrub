import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Shield, CheckCircle, AlertTriangle, User } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { SEO } from '@/components/SEO';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface SetupResponse {
  success: boolean;
  message: string;
  user?: {
    id: string;
    email: string;
    isAdmin: boolean;
    adminRole: string;
  };
}

export default function AdminSetup() {
  const [setupComplete, setSetupComplete] = useState(false);
  const { toast } = useToast();

  const setupMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/admin/setup-demo-admin');
      return await response.json() as SetupResponse;
    },
    onSuccess: (data) => {
      if (data.success) {
        setSetupComplete(true);
        toast({
          title: "Успех!",
          description: data.message,
        });
      } else {
        toast({
          title: "Ошибка",
          description: data.message,
          variant: "destructive",
        });
      }
    },
    onError: (error: any) => {
      console.error('Setup error:', error);
      toast({
        title: "Ошибка настройки",
        description: error.message || "Произошла ошибка при настройке админа",
        variant: "destructive",
      });
    }
  });

  const handleSetup = () => {
    setupMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Настройка админа - ResCrub"
        description="Настройка администратора для платформы ResCrub"
      />
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="text-center mb-8">
          <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2" data-testid="text-setup-title">
            Настройка админа
          </h1>
          <p className="text-muted-foreground">
            Предоставление прав администратора demo пользователю
          </p>
        </div>

        <div className="space-y-6">
          {/* Environment Check */}
          <Alert data-testid="alert-environment">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Эта функция доступна только в режиме разработки.
              В продакшене права администратора назначаются вручную через базу данных.
            </AlertDescription>
          </Alert>

          {/* Setup Card */}
          <Card data-testid="card-admin-setup">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Demo администратор
              </CardTitle>
              <CardDescription>
                Назначить права superadmin для пользователя demo@rescrub.ru
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!setupComplete ? (
                <>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Email:</span>
                      <Badge variant="outline" data-testid="badge-demo-email">
                        demo@rescrub.ru
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Пароль:</span>
                      <Badge variant="outline" data-testid="badge-demo-password">
                        demo123
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Будущая роль:</span>
                      <Badge variant="default" data-testid="badge-future-role">
                        superadmin
                      </Badge>
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button
                      onClick={handleSetup}
                      disabled={setupMutation.isPending}
                      className="w-full"
                      data-testid="button-setup-admin"
                    >
                      {setupMutation.isPending ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Настраиваем...
                        </>
                      ) : (
                        <>
                          <Shield className="h-4 w-4 mr-2" />
                          Назначить администратором
                        </>
                      )}
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center space-y-4" data-testid="setup-success">
                  <CheckCircle className="h-12 w-12 text-green-600 mx-auto" />
                  <div>
                    <h3 className="font-semibold text-lg">Настройка завершена!</h3>
                    <p className="text-muted-foreground">
                      Demo пользователь теперь имеет права superadmin
                    </p>
                  </div>
                  
                  {setupMutation.data?.user && (
                    <div className="bg-muted rounded-lg p-4 text-left space-y-2">
                      <div className="font-medium">Детали пользователя:</div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <span className="text-muted-foreground">ID:</span>
                        <span data-testid="text-user-id">{setupMutation.data.user.id}</span>
                        <span className="text-muted-foreground">Email:</span>
                        <span data-testid="text-user-email">{setupMutation.data.user.email}</span>
                        <span className="text-muted-foreground">Admin статус:</span>
                        <Badge variant="default" data-testid="badge-admin-status">
                          {setupMutation.data.user.isAdmin ? 'Да' : 'Нет'}
                        </Badge>
                        <span className="text-muted-foreground">Роль:</span>
                        <Badge variant="outline" data-testid="badge-user-role">
                          {setupMutation.data.user.adminRole}
                        </Badge>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => window.location.href = '/login'}
                      data-testid="button-go-login"
                    >
                      Перейти к входу
                    </Button>
                    <Button 
                      onClick={() => window.location.href = '/admin'}
                      data-testid="button-go-admin"
                    >
                      Открыть админку
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card data-testid="card-instructions">
            <CardHeader>
              <CardTitle>Инструкции</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <ol className="space-y-2">
                <li>Нажмите кнопку "Назначить администратором" выше</li>
                <li>Войдите в систему используя email <code>demo@rescrub.ru</code> и пароль <code>demo123</code></li>
                <li>После входа перейдите по ссылке <code>/admin</code></li>
                <li>Теперь у вас есть доступ ко всем админским функциям</li>
              </ol>
              
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Примечание:</strong> Эта функция работает только в режиме разработки. 
                  В продакшене права администратора назначаются через прямое обновление базы данных.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}