
export interface Status {
  id: string;
  name: string;
  color: string;
  position?: number;
}

export interface Column {
  id: string;
  title: string;
  startupIds: string[];
  position?: number;
}

export interface Board {
  columns: Column[];
}
