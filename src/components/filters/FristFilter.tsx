import { CheckboxGroup, Checkbox } from '@navikt/ds-react';
import { FristFilterOption } from '@/utils/hendelseFilteringUtils';
import React from 'react';

const texts = {
  legend: 'Velg synlighet for frist',
  option: {
    past: 'Tidligere datoer',
    today: 'Dagens dato',
    future: 'Fremtidige datoer',
  },
};

interface Props {
  onChange(value: FristFilterOption[]): void;
}

export const FristFilter = ({ onChange }: Props) => {
  return (
    <CheckboxGroup
      legend={texts.legend}
      onChange={(val: FristFilterOption[]) => onChange(val)}
      size="small"
    >
      <Checkbox value={FristFilterOption.Past}>{texts.option.past}</Checkbox>
      <Checkbox value={FristFilterOption.Today}>{texts.option.today}</Checkbox>
      <Checkbox value={FristFilterOption.Future}>
        {texts.option.future}
      </Checkbox>
    </CheckboxGroup>
  );
};
