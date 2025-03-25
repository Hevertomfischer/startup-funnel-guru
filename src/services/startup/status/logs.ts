
/**
 * Logs the start of a status update operation with detailed information
 */
export const logStatusUpdateStart = (
  id: string, 
  newStatusId: string, 
  oldStatusId?: string
): void => {
  console.log('==== STATUS UPDATE OPERATION STARTED ====');
  console.log(`Startup ID: ${id}`);
  console.log(`New Status ID: ${newStatusId}`);
  console.log(`Old Status ID: ${oldStatusId || 'unknown/null'}`);
  console.log('========================================');
};

/**
 * Logs a specific update attempt with detailed information
 */
export const logUpdateAttempt = (
  method: string,
  params: any
): void => {
  console.log(`Attempting update via ${method}`);
  console.log('Parameters:', params);
};

/**
 * Logs a successful update with detailed information
 */
export const logUpdateSuccess = (
  method: string,
  result: any
): void => {
  console.log(`Update successful via ${method}`);
  console.log('Result:', result);
};

/**
 * Logs a failed update with detailed information
 */
export const logUpdateFailure = (
  method: string,
  error: any
): void => {
  console.error(`Update failed via ${method}`);
  console.error('Error:', error);
};

/**
 * Logs the result of a batch update operation
 */
export const logBatchUpdateResult = (
  updated: number,
  total: number,
  errors: any[]
): void => {
  console.log('==== BATCH STATUS UPDATE COMPLETED ====');
  console.log(`Updated ${updated} out of ${total} startups`);
  
  if (errors.length > 0) {
    console.error(`Encountered ${errors.length} errors:`);
    errors.forEach((error, index) => {
      console.error(`Error ${index + 1}:`, error);
    });
  } else {
    console.log('No errors encountered');
  }
  console.log('========================================');
};
