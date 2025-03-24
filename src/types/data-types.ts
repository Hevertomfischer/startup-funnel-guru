
export type DataType = 
  | 'shortText' 
  | 'longText' 
  | 'url' 
  | 'email' 
  | 'phone' 
  | 'number' 
  | 'date' 
  | 'monetary' 
  | 'attachment';

export interface Field {
  id: string;
  name: string;
  type: DataType;
  required?: boolean;
}
