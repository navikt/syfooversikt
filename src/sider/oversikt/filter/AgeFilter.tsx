import { Checkbox, CheckboxGroup } from '@navikt/ds-react';
import React from 'react';
import { AgeFilterOption } from '@/utils/hendelseFilteringUtils';
import * as Amplitude from '@/utils/amplitude';
import { EventType } from '@/utils/amplitude';
import { ActionType } from '@/context/filters/filterContextActions';
import { useFilters } from '@/context/filters/FilterContext';

const text = {
  legend: 'Alder',
  option: {
    underThirty: 'Under 30 år',
    overThirty: '30 år og eldre',
  },
};

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

export default function AgeFilter() {
  const { filterState, dispatch: dispatchFilterAction } = useFilters();
  const onAgeFilterChange = (ageFilters: AgeFilterOption[]) => {
    dispatchFilterAction({
      type: ActionType.SetSelectedAgeFilter,
      selectedAgeFilters: ageFilters,
    });
  };
  return (
    <CheckboxGroup
      legend={text.legend}
      onChange={(val: AgeFilterOption[]) => {
        onAgeFilterChange(val);
        logOptionSelectedEvent(val);
      }}
      value={filterState.selectedAgeFilters}
      size="small"
    >
      <Checkbox value={AgeFilterOption.BelowThirty}>
        {text.option.underThirty}
      </Checkbox>
      <Checkbox value={AgeFilterOption.ThirtyAndAbove}>
        {text.option.overThirty}
      </Checkbox>
    </CheckboxGroup>
  );
}
