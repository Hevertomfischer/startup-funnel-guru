
import React from 'react';
import { Upload, File } from 'lucide-react';

interface FileDropzoneProps {
  file: File | null;
  onClick: () => void;
}

export const FileDropzone: React.FC<FileDropzoneProps> = ({ file, onClick }) => {
  return (
    <div 
      className="border-2 border-dashed rounded-lg p-12 text-center hover:bg-muted/50 transition cursor-pointer"
      onClick={onClick}
    >
      {file ? (
        <div className="space-y-2">
          <File className="mx-auto h-12 w-12 text-primary" />
          <p className="font-medium">{file.name}</p>
          <p className="text-sm text-muted-foreground">
            {(file.size / 1024).toFixed(2)} KB
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="font-medium">Clique para selecionar um arquivo</p>
          <p className="text-sm text-muted-foreground">
            ou arraste e solte um arquivo CSV aqui
          </p>
        </div>
      )}
    </div>
  );
};
