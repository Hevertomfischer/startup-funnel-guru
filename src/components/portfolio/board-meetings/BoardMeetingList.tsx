
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import BoardMeetingCard from './BoardMeetingCard';

interface BoardMeetingListProps {
  meetings: any[];
  onEdit: (meeting: any) => void;
  onDelete: (id: string) => void;
}

const BoardMeetingList: React.FC<BoardMeetingListProps> = ({ meetings, onEdit, onDelete }) => {
  return (
    <ScrollArea className="h-[400px]">
      <div className="space-y-4">
        {meetings.map((meeting) => (
          <BoardMeetingCard 
            key={meeting.id}
            meeting={meeting}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </ScrollArea>
  );
};

export default BoardMeetingList;
