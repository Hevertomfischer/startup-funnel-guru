
/**
 * Utility functions for processing numeric fields in startup data
 */

/**
 * Processes a value that should be a number, handling various input types
 * @param value Any value that should be converted to a number
 * @returns A number or null if the value is invalid or empty
 */
export const processNumericField = (value: any): number | null => {
  if (value === undefined || value === null) return null;
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    if (value === '') return null;
    const number = Number(value);
    return isNaN(number) ? null : number;
  }
  return null;
};

/**
 * Processes all numeric fields in startup data
 * @param startupData The startup data object containing fields to process
 * @returns A new object with all numeric fields processed
 */
export const processStartupNumericFields = (startupData: any): any => {
  return {
    ...startupData,
    mrr: processNumericField(startupData.mrr),
    client_count: processNumericField(startupData.client_count),
    accumulated_revenue_current_year: processNumericField(startupData.accumulated_revenue_current_year),
    total_revenue_last_year: processNumericField(startupData.total_revenue_last_year),
    total_revenue_previous_year: processNumericField(startupData.total_revenue_previous_year),
    partner_count: processNumericField(startupData.partner_count),
    tam: processNumericField(startupData.tam),
    sam: processNumericField(startupData.sam),
    som: processNumericField(startupData.som)
  };
};
