
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import TeamMemberCard from '@/components/team/TeamMemberCard';
import TeamMemberDialog from '@/components/team/TeamMemberDialog';
import TeamMemberPermissionsDialog from '@/components/team/TeamMemberPermissionsDialog';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';

// Dados iniciais para demonstração
const initialTeamMembers = [
  {
    id: '1',
    name: 'Ana Silva',
    role: 'Investment Partner',
    email: 'ana@scventures.com',
    avatar: null,
    initials: 'AS',
    assignedStartups: 12,
    permissions: 'admin'
  },
  {
    id: '2',
    name: 'Carlos Mendes',
    role: 'Managing Partner',
    email: 'carlos@scventures.com',
    avatar: null,
    initials: 'CM',
    assignedStartups: 8,
    permissions: 'admin'
  },
  {
    id: '3',
    name: 'Juliana Costa',
    role: 'Analyst',
    email: 'juliana@scventures.com',
    avatar: null,
    initials: 'JC',
    assignedStartups: 15,
    permissions: 'read_only'
  },
  {
    id: '4',
    name: 'Rafael Santos',
    role: 'Venture Partner',
    email: 'rafael@scventures.com',
    avatar: null,
    initials: 'RS',
    assignedStartups: 6,
    permissions: 'read_only'
  },
  {
    id: '5',
    name: 'Mariana Oliveira',
    role: 'Investment Associate',
    email: 'mariana@scventures.com',
    avatar: null,
    initials: 'MO',
    assignedStartups: 10,
    permissions: 'read_only'
  }
];

const Team = () => {
  const [teamMembers, setTeamMembers] = useState(initialTeamMembers);
  const [openMemberDialog, setOpenMemberDialog] = useState(false);
  const [openPermissionsDialog, setOpenPermissionsDialog] = useState(false);
  const [openRemoveDialog, setOpenRemoveDialog] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any>(null);

  const handleAddMember = () => {
    setSelectedMember(null);
    setOpenMemberDialog(true);
  };

  const handleEditMember = (member: any) => {
    setSelectedMember(member);
    setOpenMemberDialog(true);
  };

  const handleEditPermissions = (member: any) => {
    setSelectedMember(member);
    setOpenPermissionsDialog(true);
  };

  const handleRemoveMember = (member: any) => {
    setSelectedMember(member);
    setOpenRemoveDialog(true);
  };

  const handleSaveMember = (data: any) => {
    if (data.id) {
      // Atualizar membro existente
      setTeamMembers(prevMembers => 
        prevMembers.map(member => 
          member.id === data.id ? { ...member, ...data } : member
        )
      );
    } else {
      // Adicionar novo membro
      const newMember = {
        ...data,
        id: `${teamMembers.length + 1}`,
        avatar: null,
        initials: data.name.split(' ').map((n: string) => n[0]).join('').toUpperCase(),
        assignedStartups: 0
      };
      setTeamMembers([...teamMembers, newMember]);
    }
  };

  const handleSavePermissions = (memberId: string, permissions: string) => {
    setTeamMembers(prevMembers => 
      prevMembers.map(member => 
        member.id === memberId ? { ...member, permissions } : member
      )
    );
  };

  const confirmRemoveMember = () => {
    if (selectedMember) {
      setTeamMembers(prevMembers => 
        prevMembers.filter(member => member.id !== selectedMember.id)
      );
      setOpenRemoveDialog(false);
      toast.success(`${selectedMember.name} foi removido da equipe`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Equipe</h1>
          <p className="text-muted-foreground">Gerencie membros da equipe e permissões de acesso</p>
        </div>
        <Button className="flex items-center gap-2" onClick={handleAddMember}>
          <PlusCircle className="h-4 w-4" />
          Adicionar Membro
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teamMembers.map(member => (
          <TeamMemberCard 
            key={member.id} 
            member={member} 
            onEditPermissions={handleEditPermissions}
            onEdit={handleEditMember}
            onRemove={handleRemoveMember}
          />
        ))}
      </div>

      {/* Diálogo para adicionar/editar membros */}
      <TeamMemberDialog 
        open={openMemberDialog}
        onOpenChange={setOpenMemberDialog}
        member={selectedMember}
        onSave={handleSaveMember}
      />

      {/* Diálogo para editar permissões */}
      {selectedMember && (
        <TeamMemberPermissionsDialog
          open={openPermissionsDialog}
          onOpenChange={setOpenPermissionsDialog}
          member={selectedMember}
          onSave={handleSavePermissions}
        />
      )}

      {/* Diálogo de confirmação para remover membro */}
      <Dialog open={openRemoveDialog} onOpenChange={setOpenRemoveDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Remover membro da equipe</DialogTitle>
            <DialogDescription>
              {selectedMember && `Tem certeza que deseja remover ${selectedMember.name} da equipe? Esta ação não pode ser desfeita.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setOpenRemoveDialog(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmRemoveMember}>
              Remover
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Team;
