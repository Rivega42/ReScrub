import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { User, Settings, Bell, Shield, Lock, MapPin } from 'lucide-react';

// Profile form schema
const profileSchema = z.object({
  firstName: z.string().min(1, 'Имя обязательно').max(50, 'Максимум 50 символов'),
  lastName: z.string().min(1, 'Фамилия обязательна').max(50, 'Максимум 50 символов'),
  middleName: z.string().max(50, 'Максимум 50 символов').optional().nullable(),
  phone: z.string().min(10, 'Некорректный номер телефона').max(15, 'Максимум 15 символов').optional().nullable(),
});

// Address form schema  
const addressSchema = z.object({
  address: z.string().max(200, 'Максимум 200 символов').optional().nullable(),
  city: z.string().max(50, 'Максимум 50 символов').optional().nullable(),
  region: z.string().max(50, 'Максимум 50 символов').optional().nullable(),
  postalCode: z.string().max(10, 'Максимум 10 символов').optional().nullable(),
  country: z.string().max(2, 'Код страны должен содержать 2 символа').default('RU'),
});

// Notification preferences schema
const notificationSchema = z.object({
  emailNotifications: z.boolean(),
  smsNotifications: z.boolean(),
  pushNotifications: z.boolean(),
  marketingEmails: z.boolean(),
});

// Privacy settings schema
const privacySchema = z.object({
  profileVisibility: z.enum(['public', 'private']),
  dataSharing: z.boolean(),
  analytics: z.boolean(),
});

type ProfileFormData = z.infer<typeof profileSchema>;
type AddressFormData = z.infer<typeof addressSchema>;
type NotificationFormData = z.infer<typeof notificationSchema>;
type PrivacyFormData = z.infer<typeof privacySchema>;

export default function Profile() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('profile');

  // Fetch current user data
  const { data: userData, isLoading } = useQuery({
    queryKey: ['/api/auth/me']
  });

  // Profile form
  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      middleName: '',
      phone: '',
    }
  });

  // Address form  
  const addressForm = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      address: '',
      city: '',
      region: '',
      postalCode: '',
      country: 'RU',
    }
  });

  // Notification form
  const notificationForm = useForm<NotificationFormData>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      marketingEmails: false,
    }
  });

  // Privacy form
  const privacyForm = useForm<PrivacyFormData>({
    resolver: zodResolver(privacySchema),
    defaultValues: {
      profileVisibility: 'private' as const,
      dataSharing: false,
      analytics: true,
    }
  });

  // Update forms when userData loads
  useEffect(() => {
    if (userData && (userData as any).user?.profile) {
      const profile = (userData as any).user.profile;
      
      profileForm.reset({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        middleName: profile.middleName || '',
        phone: profile.phone || '',
      });
      
      addressForm.reset({
        address: profile.address || '',
        city: profile.city || '',
        region: profile.region || '',
        postalCode: profile.postalCode || '',
        country: profile.country || 'RU',
      });
      
      const notificationPrefs = profile.notificationPreferences || {};
      notificationForm.reset({
        emailNotifications: notificationPrefs.email ?? true,
        smsNotifications: notificationPrefs.sms ?? false,
        pushNotifications: notificationPrefs.push ?? true,
        marketingEmails: notificationPrefs.marketing ?? false,
      });
      
      const privacySettings = profile.privacySettings || {};
      privacyForm.reset({
        profileVisibility: privacySettings.profileVisibility || 'private',
        dataSharing: privacySettings.dataSharing ?? false,
        analytics: privacySettings.analytics ?? true,
      });
    }
  }, [userData, profileForm, addressForm, notificationForm, privacyForm]);

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest('PUT', '/api/profile', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
      toast({
        title: "Профиль обновлен",
        description: "Ваши данные успешно сохранены",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Ошибка обновления",
        description: error.message || "Не удалось обновить профиль",
        variant: "destructive",
      });
    },
  });

  const handleProfileSubmit = (data: ProfileFormData) => {
    updateProfileMutation.mutate(data);
  };

  const handleAddressSubmit = (data: AddressFormData) => {
    updateProfileMutation.mutate(data);
  };

  const handleNotificationSubmit = (data: NotificationFormData) => {
    updateProfileMutation.mutate({
      notificationPreferences: {
        email: data.emailNotifications,
        sms: data.smsNotifications,
        push: data.pushNotifications,
        marketing: data.marketingEmails,
      }
    });
  };

  const handlePrivacySubmit = (data: PrivacyFormData) => {
    updateProfileMutation.mutate({
      privacySettings: {
        profileVisibility: data.profileVisibility,
        dataSharing: data.dataSharing,
        analytics: data.analytics,
      }
    });
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-48"></div>
          <div className="h-4 bg-muted rounded w-64"></div>
          <div className="h-32 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight" data-testid="title-profile">
          Профиль
        </h1>
        <p className="text-muted-foreground">
          Управление личной информацией, настройками уведомлений и приватности
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full" data-testid="tabs-profile">
          <TabsTrigger value="profile" className="flex items-center gap-2" data-testid="tab-basic-info">
            <User className="w-4 h-4" />
            Основное
          </TabsTrigger>
          <TabsTrigger value="address" className="flex items-center gap-2" data-testid="tab-address">
            <MapPin className="w-4 h-4" />
            Адрес
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2" data-testid="tab-notifications">
            <Bell className="w-4 h-4" />
            Уведомления
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center gap-2" data-testid="tab-privacy">
            <Shield className="w-4 h-4" />
            Приватность
          </TabsTrigger>
        </TabsList>

        {/* Basic Profile Tab */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Личная информация
              </CardTitle>
              <CardDescription>
                Обновите свои основные данные. Эта информация используется для идентификации
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={profileForm.handleSubmit(handleProfileSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">Имя *</Label>
                    <Input
                      id="firstName"
                      data-testid="input-first-name"
                      {...profileForm.register('firstName')}
                      placeholder="Введите имя"
                    />
                    {profileForm.formState.errors.firstName && (
                      <p className="text-sm text-destructive mt-1">
                        {profileForm.formState.errors.firstName.message}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="lastName">Фамилия *</Label>
                    <Input
                      id="lastName"
                      data-testid="input-last-name"
                      {...profileForm.register('lastName')}
                      placeholder="Введите фамилию"
                    />
                    {profileForm.formState.errors.lastName && (
                      <p className="text-sm text-destructive mt-1">
                        {profileForm.formState.errors.lastName.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="middleName">Отчество</Label>
                  <Input
                    id="middleName"
                    data-testid="input-middle-name"
                    {...profileForm.register('middleName')}
                    placeholder="Введите отчество (необязательно)"
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={(userData as any)?.user?.email || ''}
                    disabled
                    data-testid="input-email-readonly"
                    className="bg-muted"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Email нельзя изменить. Обратитесь в поддержку при необходимости
                  </p>
                </div>

                <div>
                  <Label htmlFor="phone">Телефон</Label>
                  <Input
                    id="phone"
                    data-testid="input-phone"
                    {...profileForm.register('phone')}
                    placeholder="+7 (999) 123-45-67"
                  />
                  {(userData as any)?.user?.profile?.phoneVerified ? (
                    <Badge variant="secondary" className="mt-2">
                      Подтвержден
                    </Badge>
                  ) : (
                    <p className="text-sm text-muted-foreground mt-1">
                      Не подтвержден
                    </p>
                  )}
                </div>

                <Button 
                  type="submit" 
                  disabled={updateProfileMutation.isPending}
                  data-testid="button-save-profile"
                >
                  {updateProfileMutation.isPending ? 'Сохранение...' : 'Сохранить изменения'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Address Tab */}
        <TabsContent value="address">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Адрес проживания
              </CardTitle>
              <CardDescription>
                Укажите адрес для корректной работы с запросами на удаление данных
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={addressForm.handleSubmit(handleAddressSubmit)} className="space-y-4">
                <div>
                  <Label htmlFor="address">Адрес</Label>
                  <Textarea
                    id="address"
                    data-testid="input-address"
                    {...addressForm.register('address')}
                    placeholder="Улица, дом, квартира"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">Город</Label>
                    <Input
                      id="city"
                      data-testid="input-city"
                      {...addressForm.register('city')}
                      placeholder="Москва"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="region">Регион</Label>
                    <Input
                      id="region"
                      data-testid="input-region"
                      {...addressForm.register('region')}
                      placeholder="Московская область"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="postalCode">Индекс</Label>
                    <Input
                      id="postalCode"
                      data-testid="input-postal-code"
                      {...addressForm.register('postalCode')}
                      placeholder="123456"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="country">Страна</Label>
                  <Input
                    id="country"
                    value="RU"
                    disabled
                    data-testid="input-country-readonly"
                    className="bg-muted"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Сервис работает только с российскими данными
                  </p>
                </div>

                <Button 
                  type="submit" 
                  disabled={updateProfileMutation.isPending}
                  data-testid="button-save-address"
                >
                  {updateProfileMutation.isPending ? 'Сохранение...' : 'Сохранить адрес'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Настройки уведомлений
              </CardTitle>
              <CardDescription>
                Управляйте способами получения уведомлений о статусе ваших запросов
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={notificationForm.handleSubmit(handleNotificationSubmit)} className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="emailNotifications" className="text-base font-medium">
                        Email уведомления
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Получать уведомления на электронную почту
                      </p>
                    </div>
                    <Switch
                      id="emailNotifications"
                      data-testid="switch-email-notifications"
                      {...notificationForm.register('emailNotifications')}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="smsNotifications" className="text-base font-medium">
                        SMS уведомления
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Получать SMS на подтвержденный номер телефона
                      </p>
                    </div>
                    <Switch
                      id="smsNotifications"
                      data-testid="switch-sms-notifications"
                      {...notificationForm.register('smsNotifications')}
                      disabled={!(userData as any)?.user?.profile?.phoneVerified}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="pushNotifications" className="text-base font-medium">
                        Push уведомления
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Получать уведомления в браузере
                      </p>
                    </div>
                    <Switch
                      id="pushNotifications"
                      data-testid="switch-push-notifications"
                      {...notificationForm.register('pushNotifications')}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="marketingEmails" className="text-base font-medium">
                        Маркетинговые email
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Получать информацию о новых функциях и предложениях
                      </p>
                    </div>
                    <Switch
                      id="marketingEmails"
                      data-testid="switch-marketing-emails"
                      {...notificationForm.register('marketingEmails')}
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={updateProfileMutation.isPending}
                  data-testid="button-save-notifications"
                >
                  {updateProfileMutation.isPending ? 'Сохранение...' : 'Сохранить настройки'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy Tab */}
        <TabsContent value="privacy">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Настройки приватности
              </CardTitle>
              <CardDescription>
                Управляйте видимостью ваших данных и их использованием
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={privacyForm.handleSubmit(handlePrivacySubmit)} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-base font-medium">Видимость профиля</Label>
                    <p className="text-sm text-muted-foreground">
                      Кто может видеть ваш профиль
                    </p>
                    <div className="flex gap-4">
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          value="private"
                          data-testid="radio-profile-private"
                          {...privacyForm.register('profileVisibility')}
                        />
                        <span>Приватный</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          value="public"
                          data-testid="radio-profile-public"
                          {...privacyForm.register('profileVisibility')}
                        />
                        <span>Публичный</span>
                      </label>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="dataSharing" className="text-base font-medium">
                        Обмен данными
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Разрешить обмен анонимными данными для улучшения сервиса
                      </p>
                    </div>
                    <Switch
                      id="dataSharing"
                      data-testid="switch-data-sharing"
                      {...privacyForm.register('dataSharing')}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="analytics" className="text-base font-medium">
                        Аналитика
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Разрешить сбор данных для аналитики использования
                      </p>
                    </div>
                    <Switch
                      id="analytics"
                      data-testid="switch-analytics"
                      {...privacyForm.register('analytics')}
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={updateProfileMutation.isPending}
                  data-testid="button-save-privacy"
                >
                  {updateProfileMutation.isPending ? 'Сохранение...' : 'Сохранить настройки'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}