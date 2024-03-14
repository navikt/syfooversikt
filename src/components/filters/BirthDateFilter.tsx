import React, { ReactElement } from 'react';
import { UNSAFE_Combobox } from '@navikt/ds-react';

const allDates = new Array(71)
  .fill(1)
  .map((currentNumber, index) => currentNumber + index);

const options: string[] = allDates.map((date) =>
  date.toString().padStart(2, '0')
);

const texts = {
  title: 'Fødselsdato',
  placeholder: 'Velg datoer',
};

interface BirthDateFilterProps {
  selectedDates: string[];

  onSelect(value: string[]): void;
}

const BirthDateFilter = ({
  onSelect,
  selectedDates,
}: BirthDateFilterProps): ReactElement => {
  const onOptionSelected = (option: string, isSelected: boolean) => {
    if (isSelected) {
      onSelect([...selectedDates, option]);
    } else {
      onSelect(selectedDates.filter((o) => o !== option));
    }
  };

  return (
    <UNSAFE_Combobox
      isMultiSelect
      size="small"
      label={texts.title}
      description={texts.placeholder}
      options={options}
      selectedOptions={selectedDates}
      onToggleSelected={onOptionSelected}
    />
  );
};

export default BirthDateFilter;
