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
import { usePersonoversiktQuery } from '@/data/personoversiktHooks';
import { UNSAFE_Combobox } from '@navikt/ds-react';

const text = {
  searchVeileder: 'Veiledere',
  searchVeilederPlaceholder: 'Velg veiledere',
};

export default function VeilederFilter(): ReactElement {
  const veiledereQuery = useVeiledereQuery();
  const aktivVeilederQuery = useAktivVeilederQuery();
  const personoversiktQuery = usePersonoversiktQuery();
  const [selectedVeiledere, setSelectedVeiledere] = useState<string[]>([]);
  const { dispatch } = useFilters();

  function onVeilederIdentsChange(veilederIdents: string[]) {
    dispatch({
      type: ActionType.SetSelectedVeilederIdents,
      selectedVeilederIdents: veilederIdents,
    });
  }

  const veiledereSorted = sortVeiledereBySurnameAsc(
    filterVeiledereWithActiveOppgave(
      veiledereQuery.data || [],
      personoversiktQuery.data
    ),
    aktivVeilederQuery.data?.ident || ''
  );

  function veilederLabel(veileder: VeilederDTO): string {
    return veileder.fornavn === ''
      ? veileder.ident
      : `${veileder.etternavn}, ${veileder.fornavn}`;
  }

  function onToggleSelected(option: string, isSelected: boolean) {
    const updatedSelectedVeiledere = isSelected
      ? [...selectedVeiledere, option]
      : selectedVeiledere.filter((veileder) => veileder !== option);

    setSelectedVeiledere(updatedSelectedVeiledere);
    onVeilederIdentsChange(updatedSelectedVeiledere);
  }

  return (
    <UNSAFE_Combobox
      label={text.searchVeileder}
      options={veiledereSorted.map((veileder) => ({
        label: veilederLabel(veileder),
        value: veileder.ident,
      }))}
      size="small"
      isMultiSelect
      placeholder={text.searchVeilederPlaceholder}
      onToggleSelected={onToggleSelected}
    />
  );
}
