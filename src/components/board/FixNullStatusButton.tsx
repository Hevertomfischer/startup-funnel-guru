
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { updateAllNullStatusToDeclined } from '@/services/scripts/update-null-status-startups';
import { useQueryClient } from '@tanstack/react-query';

const FixNullStatusButton = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const queryClient = useQueryClient();
  
  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      const result = await updateAllNullStatusToDeclined();
      console.log('Update completed:', result);
      
      // Invalidate queries to refresh the board
      queryClient.invalidateQueries({ queryKey: ['startups'] });
      
      // Also invalidate any specific status queries
      queryClient.invalidateQueries({ 
        queryKey: ['startups', 'status']
      });
    } catch (error) {
      console.error('Failed to update startups:', error);
    } finally {
      setIsUpdating(false);
    }
  };
  
  return (
    <Button 
      onClick={handleUpdate} 
      disabled={isUpdating}
      variant="outline"
      size="sm"
      className="ml-2"
    >
      {isUpdating ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Atualizando...
        </>
      ) : (
        'Corrigir Startups Sem Status'
      )}
    </Button>
  );
};

export default FixNullStatusButton;
