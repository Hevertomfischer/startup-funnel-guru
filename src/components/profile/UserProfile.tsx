
import { useAuth } from "@/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { UserRound, Mail, ShieldCheck } from "lucide-react";

export const UserProfile = () => {
  const { user, profile, isLoading, isAdmin } = useAuth();

  if (isLoading) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-semibold">Carregando perfil...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center space-y-4">
            <Skeleton className="h-24 w-24 rounded-full" />
            <div className="space-y-2 w-full">
              <Skeleton className="h-4 w-3/4 mx-auto" />
              <Skeleton className="h-4 w-1/2 mx-auto" />
            </div>
            <div className="space-y-2 w-full mt-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!user) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-semibold">Perfil não encontrado</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center">
            Você precisa estar autenticado para visualizar o perfil.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Get initials from email or full name
  const getInitials = () => {
    if (profile?.full_name) {
      return profile.full_name
        .split(' ')
        .map(name => name[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
    }
    return user.email?.substring(0, 2).toUpperCase() || 'U';
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold">Perfil do Usuário</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center space-y-4">
          {/* Avatar */}
          <Avatar className="h-24 w-24">
            <AvatarImage src={profile?.avatar_url || ''} alt="Foto de perfil" />
            <AvatarFallback className="text-xl">{getInitials()}</AvatarFallback>
          </Avatar>

          {/* Name */}
          <div className="text-center">
            <h3 className="text-lg font-medium">
              {profile?.full_name || 'Usuário'}
            </h3>
            <p className="text-muted-foreground">
              {isAdmin ? 'Administrador' : 'Investidor'}
            </p>
          </div>

          {/* Info Items */}
          <div className="w-full space-y-3 mt-4">
            <div className="flex items-center p-3 bg-accent/50 rounded-md">
              <UserRound className="h-5 w-5 mr-3 text-primary" />
              <div>
                <p className="text-sm font-medium">Nome</p>
                <p className="text-sm text-muted-foreground">
                  {profile?.full_name || 'Não informado'}
                </p>
              </div>
            </div>

            <div className="flex items-center p-3 bg-accent/50 rounded-md">
              <Mail className="h-5 w-5 mr-3 text-primary" />
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center p-3 bg-accent/50 rounded-md">
              <ShieldCheck className="h-5 w-5 mr-3 text-primary" />
              <div>
                <p className="text-sm font-medium">Tipo de Usuário</p>
                <p className="text-sm text-muted-foreground">
                  {isAdmin ? 'Administrador' : 'Investidor'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserProfile;
