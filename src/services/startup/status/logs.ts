
/**
 * Centralized logging for status updates
 */
export const logStatusUpdateStart = (
  id: string, 
  newStatusId: string, 
  oldStatusId?: string
): void => {
  console.log(`updateStartupStatus called with id: ${id}, newStatusId: ${newStatusId}, oldStatusId: ${oldStatusId || 'unknown'}`);
  
  // Log initial values before any modifications
  console.log('INITIAL VALUES BEFORE MODIFICATION:');
  console.log('- id:', id, typeof id);
  console.log('- newStatusId:', newStatusId, typeof newStatusId);
  console.log('- oldStatusId:', oldStatusId, typeof oldStatusId);
};

/**
 * Log status verification
 */
export const logStatusVerification = (statusName: string, statusId: string): void => {
  console.log(`Status verificado e existe: ${statusName} (${statusId})`);
};

/**
 * Log startup verification
 */
export const logStartupVerification = (
  startupName: string, 
  startupId: string, 
  currentStatusId?: string
): void => {
  console.log(`Startup verificada: ${startupName} (${startupId}), status atual: ${currentStatusId || 'nenhum'}`);
};

/**
 * Log update attempt
 */
export const logUpdateAttempt = (method: string, params: any): void => {
  console.log(`Tentando update via ${method} com parâmetros:`, params);
};

/**
 * Log successful update
 */
export const logUpdateSuccess = (method: string, result: any): void => {
  console.log(`Status da startup atualizado com sucesso via ${method}:`, result);
};

/**
 * Log update failure
 */
export const logUpdateFailure = (method: string, error: any): void => {
  console.error(`Falha ao atualizar status via ${method}:`, error);
};
