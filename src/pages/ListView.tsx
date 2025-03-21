
import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useStartupData } from '@/hooks/use-startup-data';
import { useStartupList } from '@/hooks/use-startup-list';
import { useStartupActions } from '@/hooks/use-startup-actions';
import ListViewHeader from '@/components/list-view/ListViewHeader';
import StartupTable from '@/components/list-view/StartupTable';
import StartupDialog from '@/components/StartupDialog';
import { useDeleteStartupMutation } from '@/hooks/use-supabase-query';

const ListView = () => {
  const { toast } = useToast();
  const deleteStartupMutation = useDeleteStartupMutation();
  const [editStartup, setEditStartup] = useState<any>(null);
  const [showEditDialog, setShowEditDialog] = useState<boolean>(false);
  
  // Get startup data
  const {
    formattedStartups,
    statusesData,
    isLoadingStartups,
    isLoadingStatuses,
    isErrorStartups,
  } = useStartupData();
  
  // Set up sorting and filtering
  const {
    searchTerm,
    setSearchTerm,
    sortField,
    sortDirection,
    sortedStartups,
    handleSort,
  } = useStartupList(formattedStartups);
  
  // Get startup actions (update functionality)
  const { updateStartupMutation } = useStartupActions();
  
  const handleRowClick = (startup) => {
    setEditStartup(startup);
    setShowEditDialog(true);
  };

  const handleUpdateStartup = (data) => {
    updateStartupMutation.mutate(
      { id: editStartup.id, startup: data },
      {
        onSuccess: () => {
          toast({
            title: "Startup atualizada",
            description: `${data.name} foi atualizada com sucesso`,
          });
          setShowEditDialog(false);
        },
        onError: (error) => {
          toast({
            title: "Erro",
            description: `Falha ao atualizar startup: ${error.message}`,
            variant: "destructive",
          });
        }
      }
    );
  };

  const handleDeleteStartup = (startupId) => {
    if (!startupId) return;
    
    deleteStartupMutation.mutate(startupId, {
      onSuccess: () => {
        toast({
          title: "Startup deleted",
          description: "The startup has been successfully deleted",
        });
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: `Failed to delete startup: ${error.message}`,
          variant: "destructive",
        });
      }
    });
  };
  
  // Loading state
  if (isLoadingStartups || isLoadingStatuses) {
    return (
      <div className="h-[calc(100vh-4rem)] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Loading startups...</span>
      </div>
    );
  }

  // Error state
  if (isErrorStartups) {
    return (
      <div className="h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-destructive">Failed to load startups</h2>
          <p className="text-muted-foreground mt-2">Please try again later</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      <ListViewHeader 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        startups={sortedStartups}
      />
      
      <div className="flex-1 overflow-auto p-4">
        <StartupTable
          startups={sortedStartups}
          statusesData={statusesData}
          sortField={sortField}
          sortDirection={sortDirection}
          handleSort={handleSort}
          handleRowClick={handleRowClick}
          handleDeleteStartup={handleDeleteStartup}
          searchTerm={searchTerm}
        />
      </div>

      {statusesData && (
        <StartupDialog
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          title="Editar Startup"
          startup={editStartup}
          statuses={statusesData}
          onSubmit={handleUpdateStartup}
          isSubmitting={updateStartupMutation.isPending}
        />
      )}
    </div>
  );
};

export default ListView;
