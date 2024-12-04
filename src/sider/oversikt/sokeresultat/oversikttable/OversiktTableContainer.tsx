import React from 'react';
import { useVeiledereQuery } from '@/data/veiledereQueryHooks';
import { PersonregisterState } from '@/api/types/personregisterTypes';
import { getSortedEventsFromSortingType } from '@/utils/hendelseFilteringUtils';
import { EmptyDrawer } from '@/sider/oversikt/sokeresultat/oversikttable/EmptyDrawer';
import { OversiktTable } from '@/sider/oversikt/sokeresultat/oversikttable/OversiktTable';
import { useSorting } from '@/hooks/useSorting';

interface Props {
  personregister: PersonregisterState;
  startItem: number;
  endItem: number;
  selectedRows: string[];
  setSelectedRows: (rows: string[]) => void;
}

export const OversiktTableContainer = ({
  personregister,
  startItem,
  endItem,
  selectedRows,
  setSelectedRows,
}: Props) => {
  const { sorting, setSorting } = useSorting();
  const veiledereQuery = useVeiledereQuery();
  const sortedPersonregister = getSortedEventsFromSortingType(
    personregister,
    veiledereQuery.data || [],
    sorting
  );
  const paginatedPersonregister = Object.fromEntries(
    Object.entries(sortedPersonregister).slice(startItem, endItem + 1)
  );
  const personListe = Object.entries(paginatedPersonregister);

  if (!personListe.length) {
    return <EmptyDrawer />;
  }

  return (
    <OversiktTable
      sorting={sorting}
      setSorting={setSorting}
      personListe={personListe}
      selectedRows={selectedRows}
      setSelectedRows={setSelectedRows}
    />
  );
};
