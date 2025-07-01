import React, { ReactElement } from 'react';
import { useFilters } from '@/context/filters/FilterContext';
import { ActionType } from '@/context/filters/filterContextActions';
import { TextField } from '@navikt/ds-react';

const texts = {
  label: 'Sykmeldt',
  placeholder: 'Filtrer på navn eller fødselsnummer',
};

export default function SykmeldtFilter(): ReactElement {
  const { filterState, dispatch: dispatchFilterAction } = useFilters();

  return (
    <TextField
      size="small"
      label={texts.label}
      value={filterState.tekstFilter}
      placeholder={texts.placeholder}
      onChange={(e) => {
        dispatchFilterAction({
          type: ActionType.SetTekstFilter,
          tekstFilter: e.target.value,
        });
      }}
    />
  );
}
