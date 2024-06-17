import React from 'react';
import { useVeiledereQuery } from '@/data/veiledereQueryHooks';
import { PersonregisterState } from '@/api/types/personregisterTypes';
import { getSortedEventsFromSortingType } from '@/utils/hendelseFilteringUtils';
import { EmptyDrawer } from '@/components/EmptyDrawer/EmptyDrawer';
import { NewOversiktTable } from '@/components/NewOversiktTable';
import { useSorting } from '@/hooks/useSorting';

interface Props {
  personregister: PersonregisterState;
  startItem: number;
  endItem: number;
  selectedRows: string[];
  setSelectedRows: (rows: string[]) => void;
}

export const NewOversikt = ({
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
    <NewOversiktTable
      sorting={sorting}
      setSorting={setSorting}
      personListe={personListe}
      selectedRows={selectedRows}
      setSelectedRows={setSelectedRows}
    />
  );
};
