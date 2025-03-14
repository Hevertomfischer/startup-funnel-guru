
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter
} from '@/components/ui/dialog';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { updateStatus } from '@/services/status-service';

const formSchema = z.object({
  name: z.string().min(1, 'Status name is required'),
  color: z.string().regex(/^#([0-9A-F]{3}){1,2}$/i, 'Must be a valid hex color')
});

type FormValues = z.infer<typeof formSchema>;

interface RenameStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusUpdated: () => void;
  status: { id: string; name: string; color: string } | null;
}

export function RenameStatusDialog({ 
  open, 
  onOpenChange, 
  onStatusUpdated,
  status
}: RenameStatusDialogProps) {
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = React.useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: status?.name || '',
      color: status?.color || '#94a3b8'
    }
  });

  // Update form when status changes
  React.useEffect(() => {
    if (status) {
      form.reset({
        name: status.name,
        color: status.color
      });
    }
  }, [status, form]);

  const onSubmit = async (data: FormValues) => {
    if (!status?.id) return;
    
    setIsUpdating(true);
    
    try {
      const result = await updateStatus(status.id, {
        name: data.name,
        color: data.color
      });
      
      if (!result) throw new Error('Failed to update status');
      
      toast({
        title: "Status updated",
        description: `The status has been renamed to "${data.name}".`
      });
      
      onStatusUpdated();
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Failed to update status",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Rename Status</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Due Diligence" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status Color</FormLabel>
                  <div className="flex items-center gap-2">
                    <Input 
                      type="color" 
                      {...field} 
                      className="w-12 h-10 p-1 cursor-pointer" 
                    />
                    <Input
                      type="text"
                      {...field}
                      placeholder="#94a3b8"
                      className="flex-1"
                    />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isUpdating}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Status'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
