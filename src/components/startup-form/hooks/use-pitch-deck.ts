
import { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { addAttachment } from '@/services/attachment-service';

export interface PitchDeckFile {
  name: string;
  size: number;
  type: string;
  url: string;
  isPitchDeck: boolean;
}

export const usePitchDeck = () => {
  const { setValue, watch } = useFormContext();
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

  return {
    pitchDeck,
    isUploading,
    handleFileChange,
    removePitchDeck
  };
};
