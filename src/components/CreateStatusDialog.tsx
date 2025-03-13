
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
  DialogDescription,
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
import { createStatus } from '@/services/supabase';

const formSchema = z.object({
  name: z.string().min(1, 'Status name is required'),
  color: z.string().regex(/^#([0-9A-F]{3}){1,2}$/i, 'Must be a valid hex color')
});

type FormValues = z.infer<typeof formSchema>;

interface CreateStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusCreated: () => void;
}

export function CreateStatusDialog({ 
  open, 
  onOpenChange, 
  onStatusCreated 
}: CreateStatusDialogProps) {
  const { toast } = useToast();
  const [isCreating, setIsCreating] = React.useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      color: '#94a3b8'
    }
  });

  const onSubmit = async (data: FormValues) => {
    setIsCreating(true);
    
    try {
      const result = await createStatus({
        name: data.name,
        color: data.color
      });
      
      if (!result) throw new Error('Failed to create status');
      
      toast({
        title: "Status created",
        description: `New status "${data.name}" has been created.`
      });
      
      form.reset();
      onStatusCreated();
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating status:", error);
      toast({
        title: "Failed to create status",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Status</DialogTitle>
          <DialogDescription>
            Add a new status column to your startup pipeline.
          </DialogDescription>
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
                disabled={isCreating}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isCreating}>
                {isCreating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Status'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
