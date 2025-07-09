import React, { ReactElement } from 'react';
import { UNSAFE_Combobox } from '@navikt/ds-react';
import { useFilters } from '@/context/filters/FilterContext';
import { ActionType } from '@/context/filters/filterContextActions';

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

export default function BirthDateFilter(): ReactElement {
  const { filterState, dispatch: dispatchFilterAction } = useFilters();
  const onBirthDateChange = (birthDates: string[]) => {
    dispatchFilterAction({
      type: ActionType.SetSelectedBirthDates,
      selectedBirthDates: birthDates,
    });
  };
  const selectedDates = filterState.selectedBirthDates;
  const onOptionSelected = (option: string, isSelected: boolean) => {
    if (isSelected) {
      onBirthDateChange([...selectedDates, option]);
    } else {
      onBirthDateChange(selectedDates.filter((o) => o !== option));
    }
  };

  return (
    <UNSAFE_Combobox
      isMultiSelect
      size="small"
      label={texts.title}
      placeholder={selectedDates.length > 0 ? undefined : texts.placeholder}
      options={options}
      selectedOptions={selectedDates}
      onToggleSelected={onOptionSelected}
    />
  );
}
