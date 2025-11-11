import { Checkbox, CheckboxGroup } from '@navikt/ds-react';
import React from 'react';
import { AgeFilterOption } from '@/utils/hendelseFilteringUtils';
import { ActionType } from '@/context/filters/filterContextActions';
import { useFilters } from '@/context/filters/FilterContext';

const text = {
  legend: 'Alder',
  option: {
    underThirty: 'Under 30 år',
    overThirty: '30 år og eldre',
  },
};

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
      onChange={(val: AgeFilterOption[]) => onAgeFilterChange(val)}
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
