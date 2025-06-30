import React, { ReactElement } from 'react';
import { useFilters } from '@/context/filters/FilterContext';
import { ActionType } from '@/context/filters/filterContextActions';
import { TextField } from '@navikt/ds-react';

const texts = {
  undertittel: 'Navn / Fødselsnummer',
};

export default function SykmeldtNavnFnrFilter(): ReactElement {
  const { filterState, dispatch: dispatchFilterAction } = useFilters();

  return (
    <TextField
      size="small"
      label={texts.undertittel}
      value={filterState.tekstFilter}
      onChange={(e) => {
        dispatchFilterAction({
          type: ActionType.SetTekstFilter,
          tekstFilter: e.target.value,
        });
      }}
    />
  );
}
