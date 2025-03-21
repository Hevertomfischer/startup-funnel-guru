
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/auth';
import { toast } from 'sonner';
import { LoginForm } from '@/components/login/LoginForm';
import { LoginAlerts } from '@/components/login/LoginAlerts';
import { LoginLoadingState } from '@/components/login/LoginLoadingState';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [emailNotConfirmed, setEmailNotConfirmed] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const { isLoading: authLoading, signIn, user, initializationComplete, devSignIn } = useAuth();
  const navigate = useNavigate();
  
  // Obter o destino de redirecionamento
  const from = location.state?.from?.pathname || '/dashboard';

  useEffect(() => {
    console.log('Login: Estado atual -', { 
      user: !!user, 
      authLoading, 
      from,
      initializationComplete
    });
    
    // Se a autenticação estiver completa e o usuário estiver autenticado, redirecionar
    if (user && initializationComplete && !authLoading) {
      console.log('Login: Usuário já autenticado, redirecionando para', from);
      toast.success('Redirecionando para o dashboard', {
        description: 'Você já está autenticado'
      });
      navigate(from, { replace: true });
    }
  }, [user, authLoading, from, initializationComplete, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setLoginError(null);
      setEmailNotConfirmed(false);
      console.log('Tentando login com:', email);
      
      const { success, error } = await signIn(email, password);
      
      if (!success && error) {
        console.error('Login falhou:', error);
        if (error.includes('Email not confirmed')) {
          setEmailNotConfirmed(true);
        } else {
          setLoginError(error);
        }
      } else {
        console.log('Login bem-sucedido, redirecionando para', from);
        toast.success('Login bem-sucedido', {
          description: 'Redirecionando para o dashboard'
        });
        navigate(from, { replace: true });
      }
    } catch (error: any) {
      console.error('Erro de login:', error);
      
      if (error?.message?.includes('Email not confirmed')) {
        setEmailNotConfirmed(true);
      } else {
        setLoginError(error?.message || 'Falha na autenticação');
      }
    } finally {
      setLoading(false);
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
      toast.success('Email de confirmação reenviado');
    } catch (error) {
      console.error('Erro ao reenviar email de confirmação:', error);
      toast.error('Erro ao reenviar email');
    } finally {
      setIsResending(false);
    }
  };

  const handleDevLogin = () => {
    devSignIn();
    navigate(from, { replace: true });
  };

  // Se estiver carregando e já existir um usuário, mostrar carregamento
  if (authLoading && user) {
    return <LoginLoadingState />;
  }

  // Formulário de login
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Login</h1>
          <p className="text-muted-foreground">
            Entre com suas credenciais para acessar o sistema
          </p>
        </div>

        <LoginAlerts
          loginError={loginError}
          emailNotConfirmed={emailNotConfirmed}
          resendSuccess={resendSuccess}
          isResending={isResending}
          onResend={handleResendConfirmation}
        />

        <LoginForm
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          isLoading={loading || authLoading}
          onSubmit={handleSubmit}
        />
        
        <div className="text-center text-sm">
          <span className="text-muted-foreground">Ainda não tem uma conta? </span>
          <Link to="/register" className="text-primary hover:underline">
            Registre-se
          </Link>
        </div>

        {/* Dev login button - only for development */}
        {process.env.NODE_ENV === 'development' && (
          <div className="pt-4 border-t mt-6">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={handleDevLogin}
            >
              Dev Login (Admin)
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
