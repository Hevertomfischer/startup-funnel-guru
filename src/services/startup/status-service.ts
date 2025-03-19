
import { supabase, handleError } from '../base-service';
import type { Startup } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { prepareStartupData } from './utils/prepare-data';

/**
 * Updates just the status of a startup - this is a specialized function for drag & drop
 * operations which need to only update the status field 
 */
export const updateStartupStatus = async (
  id: string, 
  newStatusId: string, 
  oldStatusId?: string
): Promise<Startup | null> => {
  try {
    console.log(`updateStartupStatus called with id: ${id}, newStatusId: ${newStatusId}, oldStatusId: ${oldStatusId || 'unknown'}`);
    
    // Validar inputs para evitar erros de BD
    if (!id || typeof id !== 'string') {
      throw new Error('ID da startup inválido');
    }
    
    if (!newStatusId || typeof newStatusId !== 'string') {
      throw new Error('ID do status inválido');
    }
    
    // Validação do formato UUID
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidPattern.test(id)) {
      throw new Error(`Formato UUID inválido para ID da startup: ${id}`);
    }
    
    if (!uuidPattern.test(newStatusId)) {
      throw new Error(`Formato UUID inválido para ID do status: ${newStatusId}`);
    }
    
    // CRÍTICO: Verificação explícita que newStatusId não é null ou string vazia
    if (!newStatusId.trim()) {
      throw new Error(`ID do status não pode estar vazio`);
    }
    
    if (oldStatusId && !uuidPattern.test(oldStatusId)) {
      console.warn(`Formato UUID inválido para ID do status anterior: ${oldStatusId}. Prosseguindo sem rastrear o status anterior.`);
      oldStatusId = undefined;
    }
    
    console.log(`Atualizando startup ${id} de ${oldStatusId || 'desconhecido'} para ${newStatusId}`);
    
    // CRÍTICO: Verificar se newStatusId existe antes de prosseguir
    const { data: statusCheck, error: statusError } = await supabase
      .from('statuses')
      .select('id')
      .eq('id', newStatusId)
      .single();
      
    if (statusError || !statusCheck) {
      console.error('ID do status inválido, não existe no banco de dados:', newStatusId);
      toast.error(`Falha ao atualizar status: Status não existe`);
      return null;
    }
    
    // Verificar se a startup existe e obter seu status atual
    const { data: startupCheck, error: startupError } = await supabase
      .from('startups')
      .select('id, status_id')
      .eq('id', id)
      .single();
      
    if (startupError || !startupCheck) {
      console.error('Startup não existe:', id);
      toast.error(`Falha ao atualizar status: Startup não existe`);
      return null;
    }
    
    // Se oldStatusId não foi fornecido, obter da startup
    if (!oldStatusId && startupCheck.status_id) {
      oldStatusId = startupCheck.status_id;
      console.log(`Obtido oldStatusId do banco de dados: ${oldStatusId}`);
    }
    
    // Se o status não mudou, não fazer atualização
    if (startupCheck.status_id === newStatusId) {
      console.log('Status já está definido para este valor, pulando atualização');
      return startupCheck as Startup;
    }
    
    // NOVA ABORDAGEM: Atualizar diretamente com função RPC que evita problemas com triggers
    // Isso permite maior controle sobre como a atualização é processada
    const { data: updateResult, error: updateError } = await supabase
      .rpc('update_startup_status_safely', { 
        p_startup_id: id,
        p_new_status_id: newStatusId,
        p_old_status_id: oldStatusId || null
      });
    
    if (updateError) {
      console.error('Falha ao atualizar status via função RPC:', updateError);
      
      // Fallback: Usar o método anterior se a função RPC falhar
      console.log('Tentando método alternativo de atualização...');
      
      // Criar uma atualização mínima com apenas o campo status_id
      const rawUpdateData = { 
        status_id: newStatusId,
        isStatusUpdate: true  
      };
      
      // Fazer uma verificação de sanidade aqui para garantir que temos um status_id válido
      if (!rawUpdateData.status_id || typeof rawUpdateData.status_id !== 'string' || !uuidPattern.test(rawUpdateData.status_id)) {
        console.error('Dados de atualização inválidos: status_id inválido', rawUpdateData.status_id);
        throw new Error('ID do status inválido para atualização');
      }
      
      // Preparar dados para garantir que enviamos apenas campos válidos
      const updateData = prepareStartupData(rawUpdateData);
      
      // CRÍTICO: Garantir que nunca enviamos null para status_id
      if (!updateData.status_id || updateData.status_id === null || updateData.status_id === '') {
        console.error('Tentativa de atualizar com status_id nulo, abortando operação');
        throw new Error('Não é possível atualizar startup com status_id nulo');
      }
      
      // Verificação final para garantir que temos um status_id válido
      console.log('UPDATE DATA ANTES DO UPDATE:', updateData);
      
      // Atualizar apenas o campo status_id
      const { data, error } = await supabase
        .from('startups')
        .update(updateData)
        .eq('id', id)
        .select('*')
        .single();
      
      if (error) {
        console.error('Falha ao atualizar status da startup (método alternativo):', error);
        throw error;
      }
      
      console.log('Status da startup atualizado com sucesso (método alternativo):', data);
      return data as Startup;
    }
    
    console.log('Status da startup atualizado com sucesso via RPC:', updateResult);
    
    // Recuperar a startup atualizada
    const { data: updatedStartup, error: fetchError } = await supabase
      .from('startups')
      .select('*')
      .eq('id', id)
      .single();
      
    if (fetchError) {
      console.error('Falha ao recuperar startup após atualização:', fetchError);
      throw fetchError;
    }
    
    return updatedStartup as Startup;
  } catch (error: any) {
    console.error('Erro na função updateStartupStatus:', error);
    handleError(error, 'Falha ao atualizar status da startup');
    throw error;
  }
};
