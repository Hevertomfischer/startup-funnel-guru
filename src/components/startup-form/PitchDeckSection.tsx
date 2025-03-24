
import React, { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { FormItem, FormLabel } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PaperclipIcon, Upload, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { addAttachment } from '@/services/attachment-service';

interface FileItem {
  name: string;
  size: number;
  type: string;
  url: string;
  isPitchDeck?: boolean;
}

export const PitchDeckSection = () => {
  const { setValue, watch, getValues } = useFormContext();
  const [isUploading, setIsUploading] = useState(false);
  const pitchDeck = watch('pitchDeck');
  const startup = watch();

  // Log the pitchDeck value for debugging
  useEffect(() => {
    console.log('Current pitchDeck value in form:', pitchDeck);
  }, [pitchDeck]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    
    try {
      // Get the selected file
      const file = files[0];
      
      // Generate a unique file name to avoid collisions
      const fileExt = file.name.split('.').pop();
      const fileName = `pitch_deck_${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      
      console.log('Uploading pitch deck:', file.name, 'as', fileName);
      
      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from('startup-attachments')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (error) {
        console.error('Error uploading pitch deck to storage:', error);
        throw error;
      }
      
      console.log('Pitch deck uploaded successfully to storage:', data);
      
      // Get public URL for the uploaded file
      const { data: urlData } = supabase.storage
        .from('startup-attachments')
        .getPublicUrl(fileName);

      console.log('Generated public URL for pitch deck:', urlData.publicUrl);

      // Set the pitch deck data
      const pitchDeckData = {
        name: file.name,
        size: file.size,
        type: file.type,
        url: urlData.publicUrl,
        isPitchDeck: true
      };
      
      console.log('Setting pitch deck data in form:', pitchDeckData);
      setValue('pitchDeck', pitchDeckData);
      
      // If editing an existing startup, also save to the attachments table
      if (startup.id) {
        const attachmentData = {
          startup_id: startup.id,
          name: file.name,
          url: urlData.publicUrl,
          type: file.type,
          size: file.size,
          isPitchDeck: true
        };
        
        console.log('Adding pitch deck as attachment to database:', attachmentData);
        
        const result = await addAttachment(attachmentData);
        if (result) {
          console.log('Pitch deck added to attachments table:', result);
        }
      }
      
      toast.success('Pitch deck carregado com sucesso');
    } catch (error: any) {
      console.error('Error uploading pitch deck:', error);
      toast.error('Erro ao carregar pitch deck', {
        description: error.message
      });
    } finally {
      setIsUploading(false);
      // Clear the input
      if (e.target) {
        e.target.value = '';
      }
    }
  };

  const removePitchDeck = () => {
    console.log('Removing pitch deck from form');
    setValue('pitchDeck', null);
  };

  return (
    <div className="space-y-4">
      <FormItem>
        <FormLabel>Pitch Deck</FormLabel>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById('pitch-deck-upload')?.click()}
            disabled={isUploading}
            className="flex items-center gap-2"
          >
            {isUploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            {isUploading ? 'Carregando...' : 'Carregar Pitch Deck'}
          </Button>
          <Input
            id="pitch-deck-upload"
            type="file"
            onChange={handleFileChange}
            accept=".pdf,.ppt,.pptx,.key,.odp"
            className="hidden"
            disabled={isUploading}
          />
        </div>
      </FormItem>

      {pitchDeck && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Pitch Deck Carregado</h4>
          <div className="flex items-center justify-between rounded-md border p-2 text-sm">
            <div className="truncate">
              <span className="font-medium">{pitchDeck.name}</span>
              <span className="ml-2 text-xs text-muted-foreground">
                ({Math.round(pitchDeck.size / 1024)} KB)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => window.open(pitchDeck.url, '_blank')}
                className="h-8 px-2"
              >
                Visualizar
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={removePitchDeck}
                className="h-8 px-2 text-destructive hover:text-destructive"
              >
                Remover
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
