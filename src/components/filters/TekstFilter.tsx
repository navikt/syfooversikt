import React, { ReactElement } from 'react';
import { Input } from 'nav-frontend-skjema';
import Panel from 'nav-frontend-paneler';
import { Undertittel } from 'nav-frontend-typografi';
import { useFilters } from '@/context/filters/FilterContext';
import { ActionType } from '@/context/filters/filterContextActions';

const texts = {
  undertittel: 'Navn / Fødselsnummer',
  placeholder: 'Søk på navn eller fødselsnummer',
};

export const TekstFilter = (): ReactElement => {
  const { filterState, dispatch: dispatchFilterAction } = useFilters();

  return (
    <div className="mb-4">
      <Panel>
        <Input
          label={<Undertittel>{texts.undertittel}</Undertittel>}
          placeholder={texts.placeholder}
          value={filterState.tekstFilter}
          onChange={(e) => {
            dispatchFilterAction({
              type: ActionType.SetTekstFilter,
              tekstFilter: e.target.value,
            });
          }}
        />
      </Panel>
    </div>
  );
};
