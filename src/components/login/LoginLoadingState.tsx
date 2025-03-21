
import { Skeleton } from '@/components/ui/skeleton';

export function LoginLoadingState() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="text-center">
        <Skeleton className="h-12 w-12 rounded-full mx-auto mb-4" />
        <Skeleton className="h-4 w-48 mx-auto mb-2" />
        <Skeleton className="h-3 w-32 mx-auto" />
        <p className="text-muted-foreground mt-4">Verificando autenticação...</p>
      </div>
    </div>
  );
}
