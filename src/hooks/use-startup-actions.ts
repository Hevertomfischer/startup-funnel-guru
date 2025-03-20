
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Startup } from '@/types';
import { useStartupData } from './use-startup-data';
import { toast } from 'sonner';
import { useCreateStartupMutation, useUpdateStartupMutation } from './queries/startups';

export const useStartupActions = () => {
  const navigate = useNavigate();
  const { formattedStartups, statusesData } = useStartupData();
  
  // Initialize mutations
  const createStartupMutation = useCreateStartupMutation();
  const updateStartupMutation = useUpdateStartupMutation();
  
  // State for startup dialogs
  const [selectedStartup, setSelectedStartup] = useState<Startup | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState<boolean>(false);
  const [showEditDialog, setShowEditDialog] = useState<boolean>(false);
  
  // Handle opening the modal with different modes
  const handleModalOpen = (
    mode: 'new' | 'edit' | 'copy', 
    startupId?: string,
    startupCopy?: Startup
  ) => {
    if (mode === 'new') {
      setSelectedStartup(null);
      setShowCreateDialog(true);
    } else if (mode === 'edit' && startupId) {
      const startup = formattedStartups.find(s => s.id === startupId);
      if (startup) {
        setSelectedStartup(startup);
        setShowEditDialog(true);
      }
    } else if (mode === 'copy' && startupCopy) {
      setSelectedStartup(startupCopy);
      setShowCreateDialog(true);
    }
  };

  // Handle adding a new startup
  const handleAddStartup = (statusId: string) => {
    const defaultStartup: Partial<Startup> = {
      statusId,
      values: {}
    };
    setSelectedStartup(defaultStartup as Startup);
    setShowCreateDialog(true);
  };

  // Handle card click for startup details
  const handleCardClick = (startup: Startup) => {
    setSelectedStartup(startup);
    setShowEditDialog(true);
  };

  // Handle creating a startup
  const handleCreateStartup = (data: any) => {
    createStartupMutation.mutate(data, {
      onSuccess: () => {
        toast.success('Startup criada com sucesso');
        setShowCreateDialog(false);
      },
      onError: (error) => {
        toast.error(`Erro ao criar startup: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
      }
    });
  };

  // Handle updating a startup
  const handleUpdateStartup = (data: any) => {
    if (!selectedStartup) return;
    
    updateStartupMutation.mutate(
      { id: selectedStartup.id, startup: data },
      {
        onSuccess: () => {
          toast.success('Startup atualizada com sucesso');
          setShowEditDialog(false);
        },
        onError: (error) => {
          toast.error(`Erro ao atualizar startup: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
        }
      }
    );
  };

  // Handle opening the startup form
  const handleOpenCreateForm = () => {
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
    handleCreateStartup: handleOpenCreateForm,
    handleEditStartup,
    handleCopyStartup,
    handleStartupDetail,
    createStartupMutation,
    updateStartupMutation,
    selectedStartup,
    showCreateDialog,
    setShowCreateDialog,
    showEditDialog,
    setShowEditDialog,
    handleAddStartup,
    handleCardClick,
    handleSubmitCreateStartup: handleCreateStartup,
    handleUpdateStartup
  };
};
