import React, { ReactElement } from 'react';
import { Input } from 'nav-frontend-skjema';
import Panel from 'nav-frontend-paneler';
import { Undertittel } from 'nav-frontend-typografi';
import styled from 'styled-components';
import { useFilters } from '@/context/filters/FilterContext';
import { ActionType } from '@/context/filters/filterContextActions';
import { trackOnClick } from '@/amplitude/amplitude';

const FilterContainer = styled.div`
  margin-bottom: 1rem;
`;

const texts = {
  undertittel: 'Navn / Fødselsnummer',
  placeholder: 'Søk på navn eller fødselsnummer',
};

export const TekstFilter = (): ReactElement => {
  const { filterState, dispatch: dispatchFilterAction } = useFilters();

  return (
    <FilterContainer>
      <Panel>
        <Input
          label={<Undertittel>{texts.undertittel}</Undertittel>}
          placeholder={texts.placeholder}
          onBlur={() => trackOnClick(texts.placeholder)}
          value={filterState.tekstFilter}
          onChange={(e) => {
            dispatchFilterAction({
              type: ActionType.SetTekstFilter,
              tekstFilter: e.target.value,
            });
          }}
        />
      </Panel>
    </FilterContainer>
  );
};
