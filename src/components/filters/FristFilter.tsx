import { Select } from '@navikt/ds-react';
import { FristFilterOption } from '@/utils/hendelseFilteringUtils';
import React from 'react';

const texts = {
  label: 'Frist',
  option: {
    noChoice: 'Velg visningsalternativ',
    todayOrPast: 'I dag og tidligere datoer',
    future: 'Fremtidige datoer',
  },
};

interface Props {
  onSelect(value?: FristFilterOption): void;

  selectedFilterOption?: FristFilterOption;
}

export const FristFilter = ({ onSelect, selectedFilterOption }: Props) => {
  return (
    <Select
      label="Frist"
      value={selectedFilterOption}
      onChange={(event) => {
        if (event.target.value === '') {
          onSelect();
        } else {
          onSelect(event.target.value as FristFilterOption);
        }
      }}
    >
      <option value="">{texts.option.noChoice}</option>
      <option value={FristFilterOption.TodayOrPast}>
        {texts.option.todayOrPast}
      </option>
      <option value={FristFilterOption.Future}>{texts.option.future}</option>
    </Select>
  );
};
