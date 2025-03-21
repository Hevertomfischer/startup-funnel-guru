
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PaperclipIcon, X, Loader2 } from 'lucide-react';
import { FormItem, FormLabel } from '@/components/ui/form';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface FileItem {
  name: string;
  size: number;
  type: string;
  url: string;
}

interface AttachmentUploaderProps {
  attachments: FileItem[];
  onChange: (attachments: FileItem[]) => void;
  label?: string;
  bucketName?: string;
  folderPath?: string;
}

export const AttachmentUploader: React.FC<AttachmentUploaderProps> = ({
  attachments = [],
  onChange,
  label = "Anexos",
  bucketName = "startup-attachments",
  folderPath = ""
}) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    
    try {
      const fileItemsPromises = Array.from(files).map(async (file) => {
        // Generate a unique file name to avoid collisions
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        const filePath = folderPath ? `${folderPath}/${fileName}` : fileName;
        
        // Upload file to Supabase Storage
        const { data, error } = await supabase.storage
          .from(bucketName)
          .upload(filePath, file);
        
        if (error) throw error;
        
        // Get public URL for the uploaded file
        const { data: urlData } = supabase.storage
          .from(bucketName)
          .getPublicUrl(filePath);

        return {
          name: file.name,
          size: file.size,
          type: file.type,
          url: urlData.publicUrl
        };
      });
      
      const fileItems = await Promise.all(fileItemsPromises);
      onChange([...attachments, ...fileItems]);
      toast.success('Arquivos enviados com sucesso');
    } catch (error: any) {
      toast.error('Erro ao enviar arquivos', {
        description: error.message
      });
      console.error('Error uploading files:', error);
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
    onChange(updatedAttachments);
  };

  return (
    <div className="space-y-4">
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById(`file-upload-${label.replace(/\s+/g, '-').toLowerCase()}`)?.click()}
            disabled={isUploading}
            className="flex items-center gap-2"
          >
            {isUploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <PaperclipIcon className="h-4 w-4" />
            )}
            {isUploading ? 'Enviando...' : 'Anexar Arquivos'}
          </Button>
          <Input
            id={`file-upload-${label.replace(/\s+/g, '-').toLowerCase()}`}
            type="file"
            onChange={handleFileChange}
            multiple
            className="hidden"
            disabled={isUploading}
          />
        </div>
      </FormItem>

      {attachments.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Arquivos anexados</h4>
          <ul className="space-y-2">
            {attachments.map((file: FileItem, index: number) => (
              <li key={index} className="flex items-center justify-between rounded-md border p-2 text-sm">
                <div className="truncate">
                  <span className="font-medium">{file.name}</span>
                  <span className="ml-2 text-xs text-muted-foreground">
                    ({Math.round(file.size / 1024)} KB)
                  </span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeAttachment(index)}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Remover</span>
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
