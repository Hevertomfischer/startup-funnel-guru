
import React from 'react';
import { FormSection } from './FormSection';
import { UseFormReturn } from 'react-hook-form';
import { StartupFormValues } from './schema';
import { SectorSelect } from './market/SectorSelect';
import { BusinessModelSelect } from './market/BusinessModelSelect';
import { MarketTypeSelect } from './market/MarketTypeSelect';
import { MarketSizeInputs } from './market/MarketSizeInputs';

export const MarketSection = ({
  form,
}: {
  form: UseFormReturn<StartupFormValues>;
}) => {
  return (
    <FormSection title="Mercado">
      <div className="grid gap-4 md:grid-cols-2">
        <SectorSelect form={form} />
        <BusinessModelSelect form={form} />
        <MarketTypeSelect form={form} />
        <MarketSizeInputs form={form} />
      </div>
    </FormSection>
  );
};
