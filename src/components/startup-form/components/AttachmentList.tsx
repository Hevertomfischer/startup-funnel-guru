
import React from 'react';
import { AttachmentItem } from './AttachmentItem';
import { FileItem } from '../hooks/use-attachments';

interface AttachmentListProps {
  attachments: FileItem[];
  onRemoveAttachment: (index: number) => void;
}

export const AttachmentList: React.FC<AttachmentListProps> = ({ 
  attachments, 
  onRemoveAttachment 
}) => {
  if (!attachments || attachments.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium">Arquivos anexados</h4>
      <ul className="space-y-2">
        {attachments.map((file, index) => (
          <AttachmentItem 
            key={index} 
            file={file} 
            index={index} 
            onRemove={onRemoveAttachment} 
          />
        ))}
      </ul>
    </div>
  );
};
