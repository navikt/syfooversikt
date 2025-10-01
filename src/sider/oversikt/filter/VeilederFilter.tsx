import React, { ReactElement, useEffect } from 'react';
import { VeilederDTO } from '@/api/types/veiledereTypes';
import {
  filterVeiledereWithActiveOppgave,
  sortVeiledereBySurnameAsc,
} from '@/utils/veiledereUtils';
import {
  useAktivVeilederQuery,
  useVeiledereQuery,
} from '@/data/veiledereQueryHooks';
import { useFilters } from '@/context/filters/FilterContext';
import { ActionType } from '@/context/filters/filterContextActions';
import { usePersonoversiktQuery } from '@/data/personoversiktHooks';
import { UNSAFE_Combobox } from '@navikt/ds-react';
import { ComboboxOption } from '@navikt/ds-react/cjs/form/combobox/types';
import { useAktivEnhet } from '@/context/aktivEnhet/AktivEnhetContext';

const text = {
  searchVeileder: 'Veiledere',
  searchVeilederPlaceholder: 'Velg veiledere',
};

function veilederLabel(veileder: VeilederDTO): string {
  return veileder.fornavn === ''
    ? veileder.ident
    : `${veileder.etternavn}, ${veileder.fornavn}`;
}

function toComboboxOption(veileder: VeilederDTO): ComboboxOption {
  return {
    label: veilederLabel(veileder),
    value: veileder.ident,
  };
}

let lastAktivEnhet: string | undefined;

export default function VeilederFilter(): ReactElement {
  const veiledereQuery = useVeiledereQuery();
  const aktivVeilederQuery = useAktivVeilederQuery();
  const personoversiktQuery = usePersonoversiktQuery();
  const { filterState, dispatch } = useFilters();
  const { aktivEnhet } = useAktivEnhet();

  const veiledereSorted = sortVeiledereBySurnameAsc(
    filterVeiledereWithActiveOppgave(
      veiledereQuery.data || [],
      personoversiktQuery.data
    ),
    aktivVeilederQuery.data?.ident || ''
  );

  useEffect(() => {
    const enhetChanged = lastAktivEnhet && lastAktivEnhet !== aktivEnhet;
    lastAktivEnhet = aktivEnhet;

    if (enhetChanged) {
      if (filterState.selectedVeilederIdents.length > 0) {
        dispatch({
          type: ActionType.SetSelectedVeilederIdents,
          selectedVeilederIdents: [],
        });
      }
      return;
    }

    if (filterState.selectedVeilederIdents.length > 0) {
      const availableIdents = new Set(veiledereSorted.map((v) => v.ident));
      const anyStillAvailable = filterState.selectedVeilederIdents.some((id) =>
        availableIdents.has(id)
      );
      if (!anyStillAvailable) {
        dispatch({
          type: ActionType.SetSelectedVeilederIdents,
          selectedVeilederIdents: [],
        });
      }
    }
  }, [
    aktivEnhet,
    veiledereSorted,
    filterState.selectedVeilederIdents,
    dispatch,
  ]);

  function onToggleSelected(option: string, isSelected: boolean) {
    const current = filterState.selectedVeilederIdents;
    const updatedSelectedVeiledere = isSelected
      ? [...current, option]
      : current.filter((veileder) => veileder !== option);

    dispatch({
      type: ActionType.SetSelectedVeilederIdents,
      selectedVeilederIdents: updatedSelectedVeiledere,
    });
  }

  const selectedVeiledereOptions = veiledereSorted
    .filter((veileder) =>
      filterState.selectedVeilederIdents.includes(veileder.ident)
    )
    .map(toComboboxOption);

  return (
    <UNSAFE_Combobox
      label={text.searchVeileder}
      options={veiledereSorted.map(toComboboxOption)}
      size="small"
      isMultiSelect
      placeholder={text.searchVeilederPlaceholder}
      onToggleSelected={onToggleSelected}
      selectedOptions={selectedVeiledereOptions}
    />
  );
}
