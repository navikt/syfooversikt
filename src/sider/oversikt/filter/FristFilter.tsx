import { Checkbox, CheckboxGroup } from '@navikt/ds-react';
import { FristFilterOption } from '@/utils/hendelseFilteringUtils';
import React from 'react';
import * as Amplitude from '@/utils/amplitude';
import { EventType } from '@/utils/amplitude';
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

export default function FristFilter() {
  const { filterState, dispatch: dispatchFilterAction } = useFilters();
  const onFristFilterChange = (fristFilters: FristFilterOption[]) => {
    dispatchFilterAction({
      type: ActionType.SetSelectedFristFilter,
      selectedFristFilters: fristFilters,
    });
  };

  return (
    <CheckboxGroup
      legend={texts.legend}
      onChange={(val: FristFilterOption[]) => {
        onFristFilterChange(val);
        logOptionSelectedEvent(val);
      }}
      value={filterState.selectedFristFilters}
      size="small"
    >
      <Checkbox value={FristFilterOption.Past}>{texts.option.past}</Checkbox>
      <Checkbox value={FristFilterOption.Today}>{texts.option.today}</Checkbox>
      <Checkbox value={FristFilterOption.Future}>
        {texts.option.future}
      </Checkbox>
    </CheckboxGroup>
  );
}
