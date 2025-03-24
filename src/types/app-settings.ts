
export type ViewMode = 'board' | 'list';

export interface AppSettings {
  currentView: ViewMode;
  activeStatusFilter?: string[];
  activeLabelFilter?: string[];
  searchTerm?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}
