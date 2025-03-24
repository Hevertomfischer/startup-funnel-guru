
export interface ValidationError {
  field: string;
  message: string;
}

export interface StartupPreview {
  data: Record<string, any>;
  errors: ValidationError[];
  selected: boolean;
}

export interface DataTransformer {
  transformAndValidateData: () => StartupPreview[];
  prepareStartupData: (data: Record<string, any>) => any;
}
