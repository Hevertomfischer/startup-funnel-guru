
import React from 'react';
import { Status } from '@/types';
import { CreateStatusDialog } from '@/components/CreateStatusDialog';
import { RenameStatusDialog } from '@/components/RenameStatusDialog';
import StartupDialog from '@/components/StartupDialog';

interface BoardDialogsProps {
  showCreateStatusDialog: boolean;
  setShowCreateStatusDialog: (show: boolean) => void;
  statusToEdit: Status | null;
  setStatusToEdit: (status: Status | null) => void;
  showCreateDialog: boolean;
  setShowCreateDialog: (show: boolean) => void;
  showEditDialog: boolean;
  setShowEditDialog: (show: boolean) => void;
  selectedStartup: any;
  statuses: Status[];
  handleStatusCreated: () => void;
  handleStatusUpdated: () => void;
  handleCreateStartup: (data: any) => void;
  handleUpdateStartup: (data: any) => void;
  createStartupMutation: any;
  updateStartupMutation: any;
}

const BoardDialogs: React.FC<BoardDialogsProps> = ({
  showCreateStatusDialog,
  setShowCreateStatusDialog,
  statusToEdit,
  setStatusToEdit,
  showCreateDialog,
  setShowCreateDialog,
  showEditDialog,
  setShowEditDialog,
  selectedStartup,
  statuses,
  handleStatusCreated,
  handleStatusUpdated,
  handleCreateStartup,
  handleUpdateStartup,
  createStartupMutation,
  updateStartupMutation
}) => {
  return (
    <>
      {/* Create Status Dialog */}
      <CreateStatusDialog
        open={showCreateStatusDialog}
        onOpenChange={setShowCreateStatusDialog}
        onStatusCreated={handleStatusCreated}
      />

      {/* Rename Status Dialog */}
      <RenameStatusDialog
        open={!!statusToEdit}
        onOpenChange={(open) => {
          if (!open) setStatusToEdit(null);
        }}
        onStatusUpdated={handleStatusUpdated}
        status={statusToEdit}
      />

      {/* Create Startup Dialog */}
      <StartupDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        title="Add New Startup"
        startup={selectedStartup}
        statuses={statuses}
        onSubmit={handleCreateStartup}
        isSubmitting={createStartupMutation.isPending}
      />

      {/* Edit Startup Dialog */}
      <StartupDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        title="Edit Startup"
        startup={selectedStartup}
        statuses={statuses}
        onSubmit={handleUpdateStartup}
        isSubmitting={updateStartupMutation.isPending}
      />
    </>
  );
};

export default BoardDialogs;
