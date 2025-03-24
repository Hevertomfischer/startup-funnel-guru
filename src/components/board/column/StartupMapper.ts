
import { Startup } from '@/types';

export const mapStartupToCardFormat = (startup: any): Startup => {
  // Check if the startup has a pitchdeck in attachments
  let pitchDeck;
  const attachments = startup.attachments || [];
  
  if (Array.isArray(attachments) && attachments.length > 0) {
    // Look for a pitch deck in the attachments
    pitchDeck = attachments.find(
      (att: any) => 
        att.isPitchDeck === true || 
        (att.name && (
          att.name.toLowerCase().includes('pitch') || 
          att.name.toLowerCase().includes('deck')
        ))
    );
  }
  
  // If the startup already has a pitch_deck property, use that
  if (startup.pitch_deck && startup.pitch_deck.url) {
    pitchDeck = startup.pitch_deck;
  }
  
  // Log what we found for debugging
  if (pitchDeck) {
    console.log(`Found pitch deck for startup ${startup.id}:`, pitchDeck);
  }
  
  return {
    id: startup.id,
    createdAt: startup.created_at ? startup.created_at : new Date().toISOString(),
    updatedAt: startup.updated_at ? startup.updated_at : new Date().toISOString(),
    statusId: startup.status_id || '',
    values: {
      Startup: startup.name,
      'Problema que Resolve': startup.problem_solved,
      Setor: startup.sector,
      'Modelo de Negócio': startup.business_model,
      'Site da Startup': startup.website,
      MRR: startup.mrr,
      'Quantidade de Clientes': startup.client_count,
      'Cidade': startup.city,
      'Estado': startup.state
    },
    labels: [],
    priority: startup.priority as 'low' | 'medium' | 'high',
    assignedTo: startup.assigned_to,
    dueDate: startup.due_date,
    timeTracking: startup.time_tracking,
    attachments: startup.attachments || [],
    pitchDeck: pitchDeck ? {
      name: pitchDeck.name || 'Pitch Deck',
      url: pitchDeck.url,
      size: pitchDeck.size || 0,
      type: pitchDeck.type || 'application/pdf',
      isPitchDeck: true
    } : undefined
  };
};
