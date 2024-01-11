import { CheckboxGroup, Checkbox } from '@navikt/ds-react';
import { FristFilterOption } from '@/utils/hendelseFilteringUtils';
import React from 'react';
import * as Amplitude from '@/utils/amplitude';
import { EventType } from '@/utils/amplitude';

const texts = {
  legend: 'Frist',
  option: {
    past: 'Før dagens dato',
    today: 'Dagens dato',
    future: 'Fremtidige datoer',
  },
};

interface Props {
  onChange(value: FristFilterOption[]): void;

  selectedFristFilters: FristFilterOption[];
}

function logOptionSelectedEvent(option: FristFilterOption[]) {
  Amplitude.logEvent({
    type: EventType.OptionSelected,
    data: {
      url: window.location.href,
      tekst: 'Fristfilter endret',
      option: option.toString(),
    },
  });
}

export const FristFilter = ({ onChange, selectedFristFilters }: Props) => {
  return (
    <CheckboxGroup
      legend={texts.legend}
      onChange={(val: FristFilterOption[]) => {
        onChange(val);
        logOptionSelectedEvent(val);
      }}
      value={selectedFristFilters}
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
