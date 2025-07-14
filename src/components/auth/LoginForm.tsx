
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface LoginFormData {
  username: string;
  password: string;
}

interface LoginFormProps {
  onSwitchToRegister: () => void;
  onForgotPassword: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister, onForgotPassword }) => {
  const { login, loading } = useAuth();
  const { t } = useLanguage();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    await login(data.username, data.password);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">{t('auth.login')}</CardTitle>
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
            <Label htmlFor="password">{t('auth.password')}</Label>
            <Input
              id="password"
              type="password"
              placeholder={t('auth.passwordPlaceholder')}
              {...register('password', { required: t('auth.passwordRequired') || 'Password is required' })}
              className={errors.password ? 'border-red-500' : ''}
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? t('auth.loggingIn') : t('auth.login')}
          </Button>

          <div className="text-center space-y-2">
            <Button
              type="button"
              variant="link"
              onClick={onForgotPassword}
              className="text-sm"
            >
              {t('auth.forgotPassword')}
            </Button>
            <div>
              <span className="text-sm text-gray-600">
                {t('auth.noAccount')}{' '}
              </span>
              <Button
                type="button"
                variant="link"
                onClick={onSwitchToRegister}
                className="text-sm p-0"
              >
                {t('auth.register')}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
