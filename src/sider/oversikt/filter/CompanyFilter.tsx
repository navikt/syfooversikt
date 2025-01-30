import React, { ReactElement } from 'react';
import { UNSAFE_Combobox } from '@navikt/ds-react';

const texts = {
  title: 'Virksomheter',
  placeholder: 'Velg virksomheter',
};

interface CompantyFilterProps {
  options: string[];
  selectedCompanies: string[];

  onSelect(arrayOfCompanies: string[]): void;
}

const CompanyFilter = ({
  options,
  selectedCompanies,
  onSelect,
}: CompantyFilterProps): ReactElement => {
  const onOptionSelected = (option: string, isSelected: boolean) => {
    if (isSelected) {
      onSelect([...selectedCompanies, option]);
    } else {
      onSelect(selectedCompanies.filter((o) => o !== option));
    }
  };

  return (
    <UNSAFE_Combobox
      isMultiSelect
      size="small"
      label={texts.title}
      placeholder={selectedCompanies.length > 0 ? undefined : texts.placeholder}
      options={options.sort()}
      selectedOptions={selectedCompanies}
      onToggleSelected={onOptionSelected}
    />
  );
};

export default CompanyFilter;
