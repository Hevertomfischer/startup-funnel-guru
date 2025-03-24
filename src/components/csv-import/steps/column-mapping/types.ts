
import { CSVData, ColumnMapping } from '../../CSVImportStepper';

export interface StartupField {
  value: string;
  label: string;
  required: boolean;
  description: string;
}

export interface MappingTableProps {
  csvData: CSVData;
  columnMapping: ColumnMapping;
  onMappingChange: (csvHeader: string, startupField: string | null) => void;
  startupFields: StartupField[];
}

export interface HeaderSectionProps {
  autoMappedCount: number;
  totalHeaders: number;
}

export interface ValidationErrorProps {
  error: string | null;
}
