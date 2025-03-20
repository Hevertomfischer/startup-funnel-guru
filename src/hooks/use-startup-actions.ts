
import { useNavigate } from 'react-router-dom';
import { Startup } from '@/types';
import { useStartupData } from './use-startup-data';
import { toast } from 'sonner';

export const useStartupActions = () => {
  const navigate = useNavigate();
  const { handleModalOpen } = useStartupData();

  // Handle opening the startup form
  const handleCreateStartup = () => {
    handleModalOpen('new');
  };

  // Handle editing a startup
  const handleEditStartup = (startup: Startup) => {
    handleModalOpen('edit', startup.id);
  };

  // Handle viewing startup details
  const handleStartupDetail = (startup: Startup) => {
    // Store the startup in sessionStorage to access it on the detail page
    sessionStorage.setItem('selectedStartup', JSON.stringify(startup));
    toast.info(`Visualizando ${startup.values.Startup || 'startup'}`);
    // Navigate to a detail page (this could be implemented later)
    // For now, just open the edit modal
    handleEditStartup(startup);
  };

  // Handle copying a startup
  const handleCopyStartup = (startup: Startup) => {
    const startupCopy = {
      ...startup,
      values: {
        ...startup.values,
        Startup: `${startup.values.Startup || 'Startup'} (Cópia)`,
      },
    };
    handleModalOpen('copy', undefined, startupCopy);
  };

  return {
    handleCreateStartup,
    handleEditStartup,
    handleCopyStartup,
    handleStartupDetail
  };
};
