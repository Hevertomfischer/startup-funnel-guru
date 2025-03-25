
import { updateNullStatusStartups } from '../startup/status-service';

/**
 * This script updates all startups with null status to the "Declinada" status
 */
export const updateAllNullStatusToDeclined = async () => {
  try {
    // Known ID for "Declinada" status
    const declinadaStatusId = '6af507f5-3878-4387-ad7c-fa070f4ba6e8';
    
    console.log('Running script to update all null status startups to Declinada...');
    
    const result = await updateNullStatusStartups(declinadaStatusId);
    
    console.log('Script completed!');
    console.log(`Updated ${result.updated} startups`);
    
    if (result.errors.length > 0) {
      console.error(`Encountered ${result.errors.length} errors during update`);
    }
    
    return result;
  } catch (error) {
    console.error('Script failed:', error);
    throw error;
  }
};
