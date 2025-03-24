
import React from 'react';
import { FormItem, FormLabel } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, Loader2 } from 'lucide-react';
import { usePitchDeck } from './hooks/use-pitch-deck';
import { PitchDeckDisplay } from './components/PitchDeckDisplay';

export const PitchDeckSection = () => {
  const { pitchDeck, isUploading, handleFileChange, removePitchDeck } = usePitchDeck();

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
        <PitchDeckDisplay 
          pitchDeck={pitchDeck} 
          onRemove={removePitchDeck} 
        />
      )}
    </div>
  );
};
