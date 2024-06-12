import React from 'react';
import { useVeiledereQuery } from '@/data/veiledereQueryHooks';
import { PersonregisterState } from '@/api/types/personregisterTypes';
import { getSortedEventsFromSortingType } from '@/utils/hendelseFilteringUtils';
import { EmptyDrawer } from '@/components/EmptyDrawer/EmptyDrawer';
import { NewOversiktTable } from '@/components/NewOversiktTable';
import { SortingType } from '@/hooks/useSorting';

interface Props {
  personregister: PersonregisterState;
  sortingType: SortingType;
  setSortingType: (sortingType: SortingType) => void;
  startItem: number;
  endItem: number;
  selectedRows: string[];
  setSelectedRows: (rows: string[]) => void;
}

export const NewOversikt = ({
  personregister,
  sortingType,
  setSortingType,
  startItem,
  endItem,
  selectedRows,
  setSelectedRows,
}: Props) => {
  const veiledereQuery = useVeiledereQuery();
  const sortedPersonregister = getSortedEventsFromSortingType(
    personregister,
    veiledereQuery.data || [],
    sortingType
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
      sortingType={sortingType}
      setSortingType={setSortingType}
      personListe={personListe}
      selectedRows={selectedRows}
      setSelectedRows={setSelectedRows}
    />
  );
};
