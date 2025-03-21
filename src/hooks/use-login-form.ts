
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useLoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [emailNotConfirmed, setEmailNotConfirmed] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { signIn, devSignIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the redirect destination
  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
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
      setIsSubmitting(false);
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

  return {
    email,
    setEmail,
    password,
    setPassword,
    isResending,
    resendSuccess,
    emailNotConfirmed,
    loginError,
    isSubmitting,
    from,
    handleSubmit,
    handleResendConfirmation,
    handleDevLogin
  };
}
