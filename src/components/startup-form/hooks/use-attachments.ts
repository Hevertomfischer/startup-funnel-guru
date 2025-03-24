
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { addAttachment } from '@/services/attachment-service';

export interface FileItem {
  name: string;
  size: number;
  type: string;
  url: string;
  isPitchDeck?: boolean;
}

export const useAttachments = () => {
  const { setValue, watch } = useFormContext();
  const [isUploading, setIsUploading] = useState(false);
  const attachments = watch('attachments') || [];
  const startup = watch();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    
    try {
      const fileItemsPromises = Array.from(files).map(async (file) => {
        // Generate a unique file name to avoid collisions
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;
        
        console.log('Uploading attachment:', file.name, 'as', filePath);
        
        // Upload file to Supabase Storage
        const { data, error } = await supabase.storage
          .from('startup-attachments')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });
        
        if (error) {
          console.error('Error uploading file to Supabase:', error);
          throw error;
        }
        
        console.log('File uploaded successfully:', data);
        
        // Get public URL for the uploaded file
        const { data: urlData } = supabase.storage
          .from('startup-attachments')
          .getPublicUrl(filePath);

        console.log('Generated public URL:', urlData.publicUrl);

        // Check if it looks like a pitch deck based on file type and name
        const isPitchDeck = (
          (file.type.includes('presentation') || file.type.includes('pdf')) && 
          (file.name.toLowerCase().includes('pitch') || file.name.toLowerCase().includes('deck'))
        );

        const fileItem = {
          name: file.name,
          size: file.size,
          type: file.type,
          url: urlData.publicUrl,
          isPitchDeck: isPitchDeck
        };
        
        // If editing an existing startup, also save to the attachments table
        if (startup.id) {
          const attachmentData = {
            startup_id: startup.id,
            name: file.name,
            url: urlData.publicUrl,
            type: file.type,
            size: file.size,
            isPitchDeck: isPitchDeck
          };
          
          console.log('Adding attachment to database:', attachmentData);
          
          const result = await addAttachment(attachmentData);
          if (result) {
            console.log('Attachment added to database:', result);
          }
        }
        
        return fileItem;
      });
      
      const fileItems = await Promise.all(fileItemsPromises);
      console.log('Setting new attachments in form:', [...attachments, ...fileItems]);
      setValue('attachments', [...attachments, ...fileItems]);
      toast.success('Arquivos enviados com sucesso');
    } catch (error: any) {
      console.error('Error uploading files:', error);
      toast.error('Erro ao enviar arquivos', {
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

  const removeAttachment = (index: number) => {
    const updatedAttachments = [...attachments];
    updatedAttachments.splice(index, 1);
    setValue('attachments', updatedAttachments);
  };

  return {
    attachments,
    isUploading,
    handleFileChange,
    removeAttachment
  };
};
