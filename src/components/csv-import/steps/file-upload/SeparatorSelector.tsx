
import React from 'react';

interface SeparatorSelectorProps {
  separator: string;
  onSeparatorChange: (separator: string) => void;
}

export const SeparatorSelector: React.FC<SeparatorSelectorProps> = ({ 
  separator, 
  onSeparatorChange 
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onSeparatorChange(e.target.value);
  };

  return (
    <div className="flex items-center space-x-2">
      <label htmlFor="separator" className="text-sm font-medium">
        Separador CSV:
      </label>
      <select
        id="separator"
        value={separator}
        onChange={handleChange}
        className="rounded-md border border-input bg-background px-3 py-1 text-sm"
      >
        <option value=";">Ponto e vírgula (;)</option>
        <option value=",">Vírgula (,)</option>
        <option value="\t">Tab</option>
      </select>
    </div>
  );
};
