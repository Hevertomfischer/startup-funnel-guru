
export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size?: number;
  uploadedAt: string;
  startup_id?: string;
  related_id?: string;
  related_type?: 'kpi' | 'board_meeting' | 'startup';
  isPitchDeck?: boolean;
}
