
import { supabase, handleError } from './base-service';
import { toast } from 'sonner';

// Buscar histórico de alterações de uma startup
export const getStartupHistory = async (startupId: string) => {
  try {
    const { data, error } = await supabase
      .from('startup_history')
      .select(`
        id,
        startup_id,
        field_name,
        old_value,
        new_value,
        changed_by,
        created_at,
        profiles:changed_by(full_name, email)
      `)
      .eq('startup_id', startupId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error: any) {
    handleError(error, 'Falha ao buscar histórico de alterações');
    return [];
  }
};

// Buscar histórico de status de uma startup
export const getStartupStatusHistory = async (startupId: string) => {
  try {
    // Buscar histórico de status com nome do status, especificando as colunas para evitar ambiguidade
    const { data, error } = await supabase
      .from('startup_status_history')
      .select(`
        id,
        startup_id,
        status_id,
        previous_status_id,
        entered_at,
        exited_at,
        duration_seconds,
        statuses!status_id(name, color),
        previous_statuses:statuses!previous_status_id(name, color)
      `)
      .eq('startup_id', startupId)
      .order('entered_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error: any) {
    handleError(error, 'Falha ao buscar histórico de status');
    return [];
  }
};

// Calcular tempo total em cada coluna
export const getTimeInEachColumn = async (startupId: string) => {
  try {
    // Buscar estatísticas agrupadas por status
    const { data, error } = await supabase
      .from('startup_status_history')
      .select(`
        status_id,
        statuses!status_id(name, color)
      `)
      .eq('startup_id', startupId)
      .order('entered_at', { ascending: true });
    
    if (error) throw error;
    
    // Se não houver dados, retorne um array vazio
    if (!data || data.length === 0) return [];
    
    // Processar dados para calcular o tempo total por status
    const statusTimes: Record<string, { 
      statusId: string, 
      name: string, 
      color: string, 
      totalTimeSeconds: number,
      events: number
    }> = {};
    
    // Consultar novamente para obter todos os registros com duração
    const { data: historyData, error: historyError } = await supabase
      .from('startup_status_history')
      .select('*')
      .eq('startup_id', startupId)
      .order('entered_at', { ascending: true });
    
    if (historyError) throw historyError;
    
    historyData?.forEach(record => {
      const statusId = record.status_id;
      
      if (!statusTimes[statusId]) {
        const statusInfo = data.find(d => d.status_id === statusId)?.statuses;
        statusTimes[statusId] = {
          statusId,
          name: statusInfo?.name || 'Desconhecido',
          color: statusInfo?.color || '#cccccc',
          totalTimeSeconds: 0,
          events: 0
        };
      }
      
      // Adicionar duração ao total (se disponível)
      if (record.duration_seconds) {
        statusTimes[statusId].totalTimeSeconds += record.duration_seconds;
        statusTimes[statusId].events += 1;
      } else if (record.entered_at && !record.exited_at) {
        // Para registros ainda ativos, calcular duração até agora
        const enteredAt = new Date(record.entered_at).getTime();
        const now = new Date().getTime();
        const durationSeconds = Math.floor((now - enteredAt) / 1000);
        
        statusTimes[statusId].totalTimeSeconds += durationSeconds;
        statusTimes[statusId].events += 1;
      }
    });
    
    return Object.values(statusTimes);
  } catch (error: any) {
    handleError(error, 'Falha ao calcular tempo em cada coluna');
    return [];
  }
};
