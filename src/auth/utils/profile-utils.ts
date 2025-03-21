
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/auth';

/**
 * Fetches user profile from Supabase with error handling and fallback
 */
export const fetchUserProfile = async (userId: string, userEmail?: string): Promise<Profile | null> => {
  try {
    console.log(`Buscando perfil para o usuário ID: ${userId}`);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle(); // Usar maybeSingle em vez de single para evitar erros quando nenhum perfil é encontrado
      
    if (error) {
      console.error('Erro ao buscar perfil:', error);
      return null;
    }
    
    console.log('Dados do perfil recuperados:', data);
    
    // Se não encontrou perfil, retornar um perfil padrão
    if (!data) {
      console.warn(`Nenhum perfil encontrado para o usuário ${userId}. Usando perfil padrão.`);
      // Retorna um perfil padrão para evitar estado nulo
      return {
        id: userId,
        email: userEmail || '',
        full_name: null,
        avatar_url: null,
        role: 'investor',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      } as Profile;
    }
    
    return data as Profile;
  } catch (error) {
    console.error('Erro inesperado ao buscar perfil:', error);
    return null;
  }
};
