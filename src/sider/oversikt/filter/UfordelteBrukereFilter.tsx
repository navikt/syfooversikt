import { Checkbox } from '@navikt/ds-react';
import React from 'react';
import { ActionType } from '@/context/filters/filterContextActions';
import { useFilters } from '@/context/filters/FilterContext';
import { PersonregisterState } from '@/api/types/personregisterTypes';

const text = {
  label: 'Ufordelte brukere',
};

export function filterUfordelteBrukere(
  personregister: PersonregisterState,
  isUfordelteBrukereFilter: boolean
): PersonregisterState {
  if (!isUfordelteBrukereFilter) return personregister;

  const filtered = Object.entries(personregister).filter(([, personData]) => {
    return !personData.tildeltVeilederIdent;
  });
  return Object.fromEntries(filtered);
}

function numberOfUfordelteBrukere(personregister: PersonregisterState): number {
  return Object.values(personregister).filter(
    (personData) => !personData.tildeltVeilederIdent
  ).length;
}

interface Props {
  persondata: PersonregisterState;
}

export default function UfordelteBrukereFilter({ persondata }: Props) {
  const { filterState, dispatch: dispatchFilterAction } = useFilters();

  function onChange() {
    dispatchFilterAction({
      type: ActionType.SetFilterUfordelteBrukere,
      isUfordelteBrukereFilter: !filterState.isUfordelteBrukereFilter,
    });
  }

  return (
    <Checkbox
      checked={filterState.isUfordelteBrukereFilter}
      onChange={() => onChange()}
      size="small"
    >
      {text.label} <strong>({numberOfUfordelteBrukere(persondata)})</strong>
    </Checkbox>
  );
}
