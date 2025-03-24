
import React, { useEffect } from 'react';
import { FormItem, FormLabel } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PaperclipIcon, Loader2 } from 'lucide-react';
import { useAttachments } from './hooks/use-attachments';
import { AttachmentList } from './components/AttachmentList';

export const AttachmentSection = () => {
  const { attachments, isUploading, handleFileChange, removeAttachment } = useAttachments();

  // Debug log to check attachments
  useEffect(() => {
    console.log('Current attachments in form:', attachments);
  }, [attachments]);

  return (
    <div className="space-y-4">
      <FormItem>
        <FormLabel>Anexos</FormLabel>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById('file-upload')?.click()}
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
            id="file-upload"
            type="file"
            onChange={handleFileChange}
            multiple
            className="hidden"
            disabled={isUploading}
          />
        </div>
      </FormItem>

      <AttachmentList 
        attachments={attachments} 
        onRemoveAttachment={removeAttachment} 
      />
    </div>
  );
};
