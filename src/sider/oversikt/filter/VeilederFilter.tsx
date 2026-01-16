import React, { ReactElement, useState } from 'react';
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
import { useGetPersonstatusQuery } from '@/data/personoversiktHooks';
import { UNSAFE_Combobox } from '@navikt/ds-react';
import { ComboboxOption } from '@navikt/ds-react/cjs/form/combobox/types';

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

export default function VeilederFilter(): ReactElement {
  const veiledereQuery = useVeiledereQuery();
  const aktivVeilederQuery = useAktivVeilederQuery();
  const getPersonstatusQuery = useGetPersonstatusQuery();
  const { filterState, dispatch } = useFilters();
  const [selectedVeiledere, setSelectedVeiledere] = useState<string[]>(
    filterState.selectedVeilederIdents
  );

  function onVeilederidentsChange(veilederidents: string[]) {
    dispatch({
      type: ActionType.SetSelectedVeilederidents,
      selectedVeilederidents: veilederidents,
    });
  }

  function getVeiledereSorted(): VeilederDTO[] {
    const selectedVeiledereInFilter = veiledereQuery.data?.filter((veileder) =>
      filterState.selectedVeilederIdents.includes(veileder.ident)
    );
    const veiledereWithActiveOppgave = filterVeiledereWithActiveOppgave(
      veiledereQuery.data || [],
      getPersonstatusQuery.data
    );
    const allVeiledere = selectedVeiledereInFilter
      ? [
          ...new Set([
            ...selectedVeiledereInFilter,
            ...veiledereWithActiveOppgave,
          ]),
        ]
      : veiledereWithActiveOppgave;

    return sortVeiledereBySurnameAsc(
      allVeiledere,
      aktivVeilederQuery.data?.ident || ''
    );
  }

  const veiledereSorted = getVeiledereSorted();

  const selectedVeiledereOptions = veiledereSorted
    .filter((veileder) => selectedVeiledere.includes(veileder.ident))
    .map(toComboboxOption);

  function onToggleSelected(option: string, isSelected: boolean) {
    const updatedSelectedVeiledere = isSelected
      ? [...selectedVeiledere, option]
      : selectedVeiledere.filter((veileder) => veileder !== option);

    setSelectedVeiledere(updatedSelectedVeiledere);
    onVeilederidentsChange(updatedSelectedVeiledere);
  }

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
