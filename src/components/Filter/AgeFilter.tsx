import { Checkbox, CheckboxGroup } from '@navikt/ds-react';
import React from 'react';
import { AgeFilterOption } from '@/utils/hendelseFilteringUtils';
import * as Amplitude from '@/utils/amplitude';
import { EventType } from '@/utils/amplitude';

const text = {
  legend: 'Alder',
  option: {
    underThirty: 't.o.m. 30 år',
    overThirty: 'Over 30 år',
  },
};

interface Props {
  onChange(value: AgeFilterOption[]): void;

  selectedAgeFilters: AgeFilterOption[];
}

function logOptionSelectedEvent(option: AgeFilterOption[]) {
  Amplitude.logEvent({
    type: EventType.OptionSelected,
    data: {
      url: window.location.href,
      tekst: 'Aldersfilter endret',
      option: option.toString(),
    },
  });
}

export function AgeFilter({ onChange, selectedAgeFilters }: Props) {
  return (
    <CheckboxGroup
      legend={text.legend}
      onChange={(val: AgeFilterOption[]) => {
        onChange(val);
        logOptionSelectedEvent(val);
      }}
      value={selectedAgeFilters}
      size="small"
    >
      <Checkbox value={AgeFilterOption.ThirtyAndUnder}>
        {text.option.underThirty}
      </Checkbox>
      <Checkbox value={AgeFilterOption.OverThirty}>
        {text.option.overThirty}
      </Checkbox>
    </CheckboxGroup>
  );
}
