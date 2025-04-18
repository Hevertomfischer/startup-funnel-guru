
import React from 'react';
import { MapPin, Link2, FileText } from 'lucide-react';
import { Startup } from '@/types/startup';

interface ContactInfoProps {
  startup: Startup;
  onPitchDeckLinkClick: (e: React.MouseEvent) => void;
}

export const ContactInfo: React.FC<ContactInfoProps> = ({ startup, onPitchDeckLinkClick }) => {
  const pitchDeckUrl = startup.pitchDeck?.url;
  const hasLocation = startup.values['Cidade'] || startup.values['Estado'];
  const hasWebsite = startup.values['Site da Startup'];
  
  if (!hasLocation && !hasWebsite && !pitchDeckUrl) return null;
  
  return (
    <>
      {/* Location */}
      {hasLocation && (
        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
          <MapPin className="h-3 w-3" />
          <span>
            {[startup.values['Cidade'], startup.values['Estado']]
              .filter(Boolean)
              .join(', ')}
          </span>
        </div>
      )}
      
      {/* Website */}
      {hasWebsite && (
        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
          <Link2 className="h-3 w-3" />
          <a 
            href={startup.values['Site da Startup']} 
            className="truncate hover:text-primary"
            onClick={(e) => e.stopPropagation()}
            target="_blank" 
            rel="noopener noreferrer"
          >
            {startup.values['Site da Startup'].replace(/^https?:\/\//, '')}
          </a>
        </div>
      )}
      
      {/* PitchDeck */}
      {pitchDeckUrl && (
        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
          <FileText className="h-3 w-3 text-amber-500" />
          <a 
            href="#" 
            className="truncate hover:text-amber-500 flex items-center"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onPitchDeckLinkClick(e);
            }}
          >
            <span className="mr-1.5">{startup.pitchDeck?.name || 'Visualizar Pitch Deck'}</span>
            <span className="h-4 w-4 inline-flex items-center justify-center bg-amber-500 text-white rounded-sm">
              <FileText className="h-2.5 w-2.5" />
            </span>
          </a>
        </div>
      )}
    </>
  );
};
