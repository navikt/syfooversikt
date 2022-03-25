import React, { ReactElement } from 'react';
import Select from 'react-select';
import { ValueType } from 'react-select/src/types';
import { FilterTitle } from '../FilterTitle';

const allDates = new Array(31)
  .fill(1)
  .map((currentNumber, index) => currentNumber + index);

const texts = {
  title: 'Fødselsdato',
  placeholder: 'Velg datoer',
};

interface DateOption {
  value: string;
  label: string;
}

const selectableOptions: DateOption[] = allDates.map((v: number) => {
  const paddedValue = v.toString().padStart(2, '0');
  return { value: paddedValue, label: paddedValue };
});

interface BirthDateFilterProps {
  selectedDates: string[];

  onSelect(value: string[]): void;
}

const BirthDateFilter = ({
  onSelect,
  selectedDates,
}: BirthDateFilterProps): ReactElement => {
  const selectedOptions = selectedDates.map(
    (v) => ({ label: v, value: v } as DateOption)
  );

  return (
    <div>
      <FilterTitle>{texts.title}</FilterTitle>
      <Select
        placeholder={texts.placeholder}
        options={selectableOptions}
        isMulti
        value={selectedOptions}
        closeMenuOnSelect={false}
        onChange={(v: ValueType<DateOption, boolean>) => {
          const arrayOfSelectedOptions = (v as DateOption[]) || [];
          const arrayOfStrings =
            arrayOfSelectedOptions.map((option) => option.value) || [];
          onSelect(arrayOfStrings);
        }}
      />
    </div>
  );
};

export default BirthDateFilter;
