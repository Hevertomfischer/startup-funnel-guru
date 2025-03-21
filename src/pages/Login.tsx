import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';
import { useAuth } from '@/auth';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [emailNotConfirmed, setEmailNotConfirmed] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const { signIn, isLoading, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    console.log('Login page - Auth state:', { user: !!user, isLoading });
    
    if (user && !isLoading) {
      console.log('User already authenticated, redirecting to dashboard');
      navigate('/dashboard');
    }
  }, [user, isLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoginError(null);
      setEmailNotConfirmed(false);
      console.log('Attempting login with:', email);
      const { success, error } = await signIn(email, password);
      
      if (!success && error) {
        if (error.includes('Email not confirmed')) {
          setEmailNotConfirmed(true);
        } else {
          setLoginError(error);
        }
      }
    } catch (error: any) {
      console.error('Login error:', error);
      
      if (error?.message?.includes('Email not confirmed')) {
        setEmailNotConfirmed(true);
      } else {
        setLoginError(error?.message || 'Falha na autenticação');
      }
    }
  };

  const handleResendConfirmation = async () => {
    try {
      setIsResending(true);
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });
      
      if (error) {
        throw error;
      }
      
      setResendSuccess(true);
    } catch (error) {
      console.error('Error resending confirmation email:', error);
    } finally {
      setIsResending(false);
    }
  };

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="text-center">
          <Skeleton className="h-12 w-12 rounded-full mx-auto mb-4" />
          <Skeleton className="h-4 w-48 mx-auto mb-2" />
          <Skeleton className="h-3 w-32 mx-auto" />
          <p className="text-muted-foreground mt-4">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  // If already authenticated, return null (will redirect in useEffect)
  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Login</h1>
          <p className="text-muted-foreground">
            Entre com suas credenciais para acessar o sistema
          </p>
        </div>

        {emailNotConfirmed && (
          <Alert variant="destructive">
            <InfoIcon className="h-4 w-4" />
            <AlertTitle>Email não confirmado</AlertTitle>
            <AlertDescription>
              Por favor, verifique seu email e confirme sua conta antes de fazer login.
              <Button 
                variant="outline" 
                className="mt-2 w-full"
                onClick={handleResendConfirmation}
                disabled={isResending || resendSuccess}
              >
                {isResending ? 'Enviando...' : resendSuccess ? 'Email reenviado' : 'Reenviar email de confirmação'}
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {loginError && (
          <Alert variant="destructive">
            <InfoIcon className="h-4 w-4" />
            <AlertTitle>Erro de login</AlertTitle>
            <AlertDescription>{loginError}</AlertDescription>
          </Alert>
        )}

        {resendSuccess && (
          <Alert>
            <InfoIcon className="h-4 w-4" />
            <AlertTitle>Email reenviado</AlertTitle>
            <AlertDescription>
              Um novo email de confirmação foi enviado. Por favor, verifique sua caixa de entrada.
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="password">Senha</Label>
              <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                Esqueceu a senha?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>
        
        <div className="text-center text-sm">
          <span className="text-muted-foreground">Ainda não tem uma conta? </span>
          <Link to="/register" className="text-primary hover:underline">
            Registre-se
          </Link>
        </div>
      </div>
    </div>
  );
};
