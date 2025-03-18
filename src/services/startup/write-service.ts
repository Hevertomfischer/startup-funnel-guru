
// Refactored: This file now just re-exports the functionality from smaller modules
import { createStartup } from './create-service';
import { updateStartup } from './update-service';
import { updateStartupStatus } from './status-service';

export {
  createStartup,
  updateStartup,
  updateStartupStatus
};
