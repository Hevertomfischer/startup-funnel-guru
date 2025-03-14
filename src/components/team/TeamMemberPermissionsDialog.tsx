
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface TeamMemberPermissionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: {
    id: string;
    name: string;
    role: string;
    permissions?: string;
  };
  onSave: (memberId: string, permissions: string) => void;
}

const TeamMemberPermissionsDialog = ({
  open,
  onOpenChange,
  member,
  onSave,
}: TeamMemberPermissionsDialogProps) => {
  const [selectedPermission, setSelectedPermission] = React.useState(
    member.permissions || 'read_only'
  );

  const handleSave = () => {
    onSave(member.id, selectedPermission);
    onOpenChange(false);
    toast.success('Permissões atualizadas com sucesso', {
      description: `${member.name} agora tem permissões de ${selectedPermission === 'admin' ? 'administrador' : 'somente leitura'}`
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Definir permissões</DialogTitle>
          <DialogDescription>
            Defina o nível de permissão para {member.name}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <RadioGroup
            value={selectedPermission}
            onValueChange={setSelectedPermission}
            className="space-y-3"
          >
            <div className="flex items-start space-x-3 space-y-0 rounded-md border p-3">
              <RadioGroupItem value="admin" id="admin" />
              <div className="space-y-1 leading-none">
                <Label htmlFor="admin" className="font-medium">
                  Administrador
                </Label>
                <p className="text-sm text-muted-foreground">
                  Acesso total - pode visualizar, criar, editar e excluir todos os recursos
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3 space-y-0 rounded-md border p-3">
              <RadioGroupItem value="read_only" id="read_only" />
              <div className="space-y-1 leading-none">
                <Label htmlFor="read_only" className="font-medium">
                  Somente leitura
                </Label>
                <p className="text-sm text-muted-foreground">
                  Acesso limitado - pode apenas visualizar recursos, sem fazer alterações
                </p>
              </div>
            </div>
          </RadioGroup>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>Salvar alterações</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TeamMemberPermissionsDialog;
