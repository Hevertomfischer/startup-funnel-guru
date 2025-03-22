
import React from 'react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PlusCircle } from 'lucide-react';
import { 
  BoardMeetingEmptyState,
  BoardMeetingList,
  BoardMeetingForm,
  useBoardMeetings
} from './board-meetings';

interface PortfolioBoardMeetingsSectionProps {
  startupId: string;
  portfolio: any;
}

const PortfolioBoardMeetingsSection: React.FC<PortfolioBoardMeetingsSectionProps> = ({ startupId, portfolio }) => {
  const {
    form,
    openDialog,
    setOpenDialog,
    isEditing,
    boardMeetings,
    isLoadingMeetings,
    openNewMeetingDialog,
    openEditMeetingDialog,
    onSubmit,
    handleDeleteMeeting
  } = useBoardMeetings(startupId, portfolio);
  
  if (isLoadingMeetings) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <div className="grid grid-cols-1 gap-4">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Reuniões de Conselho</h3>
        <Button onClick={openNewMeetingDialog} size="sm">
          <PlusCircle className="h-4 w-4 mr-2" />
          Agendar Reunião
        </Button>
      </div>
      
      {boardMeetings.length === 0 ? (
        <BoardMeetingEmptyState onAddClick={openNewMeetingDialog} />
      ) : (
        <BoardMeetingList 
          meetings={boardMeetings}
          onEdit={openEditMeetingDialog}
          onDelete={handleDeleteMeeting}
        />
      )}
      
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Editar Reunião' : 'Agendar Nova Reunião'}</DialogTitle>
          </DialogHeader>
          
          <BoardMeetingForm
            form={form}
            onSubmit={onSubmit}
            onCancel={() => setOpenDialog(false)}
            isEditing={isEditing}
            startupId={startupId}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PortfolioBoardMeetingsSection;
