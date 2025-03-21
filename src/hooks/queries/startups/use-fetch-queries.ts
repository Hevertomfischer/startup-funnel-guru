
import { 
  useStartupsQuery,
  useStartupQuery,
  useStartupsByStatusQuery
} from './query-functions';

import { checkDatabaseTables } from './query-helpers';

// Re-export all query hooks for convenience
export {
  useStartupsQuery,
  useStartupQuery,
  useStartupsByStatusQuery
};

// Export helper functions
export { checkDatabaseTables };
