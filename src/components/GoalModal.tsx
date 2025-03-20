
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface GoalModalProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const GoalModal: React.FC<GoalModalProps> = ({ isOpen = false, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose?.()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Goal Tracking</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p>Goal tracking functionality will be implemented here.</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
