
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
import { useTeamMembersQuery, useCreateTeamMemberMutation, useUpdateTeamMemberMutation, useDeleteTeamMemberMutation } from '@/hooks/use-team-members';
import { TeamMember } from '@/services/team-member-service';

const Team = () => {
  const [openMemberDialog, setOpenMemberDialog] = useState(false);
  const [openPermissionsDialog, setOpenPermissionsDialog] = useState(false);
  const [openRemoveDialog, setOpenRemoveDialog] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  
  // Queries and mutations
  const teamMembersQuery = useTeamMembersQuery();
  const createTeamMemberMutation = useCreateTeamMemberMutation();
  const updateTeamMemberMutation = useUpdateTeamMemberMutation();
  const deleteTeamMemberMutation = useDeleteTeamMemberMutation();

  const teamMembers = teamMembersQuery.data || [];
  const isLoading = teamMembersQuery.isLoading;
  
  const handleAddMember = () => {
    setSelectedMember(null);
    setOpenMemberDialog(true);
  };

  const handleEditMember = (member: TeamMember) => {
    setSelectedMember(member);
    setOpenMemberDialog(true);
  };

  const handleEditPermissions = (member: TeamMember) => {
    setSelectedMember(member);
    setOpenPermissionsDialog(true);
  };

  const handleRemoveMember = (member: TeamMember) => {
    setSelectedMember(member);
    setOpenRemoveDialog(true);
  };

  const handleSaveMember = (data: any) => {
    if (data.id) {
      // Atualizar membro existente
      updateTeamMemberMutation.mutate({
        id: data.id, 
        teamMember: data
      });
    } else {
      // Adicionar novo membro
      createTeamMemberMutation.mutate({
        name: data.name,
        email: data.email,
        role: data.role,
        avatar: null,
        initials: data.name.split(' ').map((n: string) => n[0]).join('').toUpperCase(),
        assigned_startups: 0,
        permissions: data.permissions || 'read_only'
      }, {
        onSuccess: () => {
          setOpenMemberDialog(false);
          toast.success(`${data.name} foi adicionado à equipe`);
          teamMembersQuery.refetch();
        },
        onError: (error) => {
          console.error('Error creating team member:', error);
          toast.error('Erro ao adicionar membro');
        }
      });
    }
  };

  const handleSavePermissions = (memberId: string, permissions: string) => {
    updateTeamMemberMutation.mutate({
      id: memberId, 
      teamMember: { permissions }
    }, {
      onSuccess: () => {
        setOpenPermissionsDialog(false);
        toast.success('Permissões atualizadas com sucesso');
        teamMembersQuery.refetch();
      }
    });
  };

  const confirmRemoveMember = () => {
    if (selectedMember) {
      deleteTeamMemberMutation.mutate(selectedMember.id, {
        onSuccess: () => {
          setOpenRemoveDialog(false);
          toast.success(`${selectedMember.name} foi removido da equipe`);
          teamMembersQuery.refetch();
        },
        onError: (error) => {
          console.error('Error deleting team member:', error);
          toast.error('Erro ao remover membro');
        }
      });
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
      
      {isLoading ? (
        <div className="flex justify-center p-8">
          <p>Carregando membros da equipe...</p>
        </div>
      ) : teamMembers.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center p-8 text-center">
            <p className="text-muted-foreground mb-4">Nenhum membro da equipe encontrado</p>
            <Button onClick={handleAddMember} size="sm">
              Adicionar seu primeiro membro
            </Button>
          </CardContent>
        </Card>
      ) : (
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
      )}

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
            <Button 
              variant="destructive" 
              onClick={confirmRemoveMember}
              disabled={deleteTeamMemberMutation.isPending}
            >
              {deleteTeamMemberMutation.isPending ? 'Removendo...' : 'Remover'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Team;
