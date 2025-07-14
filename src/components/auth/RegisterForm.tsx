
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin }) => {
  const { register: registerUser, loading } = useAuth();
  const { t } = useLanguage();
  const { register, handleSubmit, formState: { errors }, watch } = useForm<RegisterFormData>();
  const password = watch('password');

  const onSubmit = async (data: RegisterFormData) => {
    const success = await registerUser(data.username, data.email, data.password);
    if (success) {
      onSwitchToLogin();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">{t('auth.register')}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">{t('auth.username')}</Label>
            <Input
              id="username"
              placeholder={t('auth.usernamePlaceholder')}
              {...register('username', { required: t('auth.usernameRequired') })}
              className={errors.username ? 'border-red-500' : ''}
            />
            {errors.username && (
              <p className="text-red-500 text-sm">{errors.username.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">{t('auth.email')}</Label>
            <Input
              id="email"
              type="email"
              placeholder={t('auth.emailPlaceholder')}
              {...register('email', { 
                required: t('auth.emailRequired'),
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: t('auth.invalidEmail')
                }
              })}
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">{t('auth.password')}</Label>
            <Input
              id="password"
              type="password"
              placeholder={t('auth.passwordPlaceholder')}
              {...register('password', { 
                required: t('auth.passwordRequired'),
                minLength: {
                  value: 6,
                  message: t('auth.passwordMinLength')
                }
              })}
              className={errors.password ? 'border-red-500' : ''}
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">{t('auth.confirmPassword')}</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder={t('auth.confirmPasswordPlaceholder')}
              {...register('confirmPassword', { 
                required: t('auth.confirmPasswordRequired'),
                validate: value => value === password || t('auth.passwordsDoNotMatch')
              })}
              className={errors.confirmPassword ? 'border-red-500' : ''}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? t('auth.registering') : t('auth.register')}
          </Button>

          <div className="text-center">
            <span className="text-sm text-gray-600">
              {t('auth.haveAccount')}{' '}
            </span>
            <Button
              type="button"
              variant="link"
              onClick={onSwitchToLogin}
              className="text-sm p-0"
            >
              {t('auth.login')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default RegisterForm;
