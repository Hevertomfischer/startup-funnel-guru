
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, Edit, Settings, Trash2 } from 'lucide-react';

interface TeamMemberCardProps {
  member: {
    id: string;
    name: string;
    role: string;
    email: string;
    avatar: string | null;
    initials: string;
    assigned_startups: number;
    permissions?: string;
  };
  onEditPermissions: (member: any) => void;
  onEdit: (member: any) => void;
  onRemove: (member: any) => void;
}

const TeamMemberCard = ({ member, onEditPermissions, onEdit, onRemove }: TeamMemberCardProps) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={member.avatar || ''} alt={member.name} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {member.initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-lg">{member.name}</CardTitle>
            <Badge variant="outline" className="mt-1">{member.role}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Email:</span>
            <span>{member.email}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Startups atribuídas:</span>
            <span className="font-medium">{member.assigned_startups}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Permissões:</span>
            <Badge 
              variant={member.permissions === 'admin' ? "default" : "secondary"}
              className="flex items-center gap-1"
            >
              <Shield className="h-3 w-3" />
              {member.permissions === 'admin' ? 'Administrador' : 'Somente leitura'}
            </Badge>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            <Button variant="outline" size="sm" className="gap-1" onClick={() => onEdit(member)}>
              <Edit className="h-3.5 w-3.5" />
              Editar
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-1 text-muted-foreground"
              onClick={() => onEditPermissions(member)}
            >
              <Settings className="h-3.5 w-3.5" />
              Permissões
            </Button>
            <Button 
              variant="destructive" 
              size="sm" 
              className="col-span-2 gap-1"
              onClick={() => onRemove(member)}
            >
              <Trash2 className="h-3.5 w-3.5" />
              Remover
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamMemberCard;
