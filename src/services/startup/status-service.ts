
/**
 * This file has been refactored into smaller, more maintainable components.
 * It now serves as a compatibility layer to maintain existing imports.
 */
import { updateStartupStatus } from './status/update-service';
import { updateNullStatusStartups } from './status/batch-update';

export {
  updateStartupStatus,
  updateNullStatusStartups
};
