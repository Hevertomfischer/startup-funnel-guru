
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/auth';
import { toast } from 'sonner';
import { useLoginForm } from '@/hooks/use-login-form';
import { LoginForm } from '@/components/login/LoginForm';
import { LoginAlerts } from '@/components/login/LoginAlerts';
import { LoginLoadingState } from '@/components/login/LoginLoadingState';

export default function Login() {
  const { 
    email, setEmail, 
    password, setPassword,
    isResending, resendSuccess, emailNotConfirmed, loginError,
    from, handleSubmit, handleResendConfirmation, handleDevLogin
  } = useLoginForm();
  
  const { isLoading, user, initializationComplete } = useAuth();

  useEffect(() => {
    console.log('Login: Estado atual -', { 
      user: !!user, 
      isLoading, 
      from,
      initializationComplete
    });
    
    // Se a autenticação estiver completa e o usuário estiver autenticado, redirecionar
    if (user && initializationComplete && !isLoading) {
      console.log('Login: Usuário já autenticado, redirecionando para', from);
      toast.success('Redirecionando para o dashboard', {
        description: 'Você já está autenticado'
      });
      window.location.href = from;
    }
  }, [user, isLoading, from, initializationComplete]);

  // Se estiver carregando e já existir um usuário, mostrar carregamento
  if (isLoading && user) {
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
          isLoading={isLoading}
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
