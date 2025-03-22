
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PencilIcon, Trash2Icon, CalendarIcon, MapPin, Users } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface BoardMeetingCardProps {
  meeting: any;
  onEdit: (meeting: any) => void;
  onDelete: (id: string) => void;
}

const BoardMeetingCard: React.FC<BoardMeetingCardProps> = ({ meeting, onEdit, onDelete }) => {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'PP', { locale: ptBR });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <Card key={meeting.id} className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex justify-between">
          <div className="space-y-2 flex-1">
            <div className="flex items-center">
              <h4 className="font-medium">{meeting.title}</h4>
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <CalendarIcon className="h-4 w-4 mr-1" />
                <span>{formatDate(meeting.meeting_date)}</span>
              </div>
              
              {meeting.location && (
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{meeting.location}</span>
                </div>
              )}
              
              {meeting.attendees && meeting.attendees.length > 0 && (
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  <span>{meeting.attendees.length} participante(s)</span>
                </div>
              )}
            </div>
            
            {meeting.description && (
              <p className="text-sm line-clamp-2">{meeting.description}</p>
            )}
            
            {meeting.decisions && (
              <div>
                <h5 className="text-sm font-medium mt-2">Decisões:</h5>
                <p className="text-sm text-muted-foreground line-clamp-2">{meeting.decisions}</p>
              </div>
            )}
          </div>
          <div className="flex flex-col space-y-1 ml-4">
            <Button variant="ghost" size="icon" onClick={() => onEdit(meeting)}>
              <PencilIcon className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onDelete(meeting.id)}>
              <Trash2Icon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BoardMeetingCard;
