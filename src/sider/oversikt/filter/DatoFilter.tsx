import { Checkbox, CheckboxGroup } from '@navikt/ds-react';
import { DatoFilterOption } from '@/utils/hendelseFilteringUtils';
import React from 'react';
import { ActionType } from '@/context/filters/filterContextActions';
import { useFilters } from '@/context/filters/FilterContext';

const texts = {
  legend: 'Dato',
  option: {
    past: 'Før dagens dato',
    today: 'Dagens dato',
    future: 'Fremtidige datoer',
  },
};

export default function DatoFilter() {
  const { filterState, dispatch: dispatchFilterAction } = useFilters();
  const onDatoFilterChange = (datoFilters: DatoFilterOption[]) => {
    dispatchFilterAction({
      type: ActionType.SetSelectedDatoFilter,
      selectedDatoFilters: datoFilters,
    });
  };

  return (
    <CheckboxGroup
      legend={texts.legend}
      onChange={(val: DatoFilterOption[]) => onDatoFilterChange(val)}
      value={filterState.selectedFristFilters}
      size="small"
    >
      <Checkbox value={DatoFilterOption.Past}>{texts.option.past}</Checkbox>
      <Checkbox value={DatoFilterOption.Today}>{texts.option.today}</Checkbox>
      <Checkbox value={DatoFilterOption.Future}>{texts.option.future}</Checkbox>
    </CheckboxGroup>
  );
}
