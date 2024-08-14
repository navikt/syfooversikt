import { SortState } from '@navikt/ds-react';
import { StoreKey, useLocalStorageState } from '@/hooks/useLocalStorageState';

export type SortingKey =
  | 'NAME'
  | 'FNR'
  | 'COMPANY'
  | 'VEILEDER'
  | 'UKE'
  | 'DATO'
  | 'HENDELSE'
  | 'NONE';

export type SortDirection = SortState['direction'];

export interface Sorting extends SortState {
  orderBy: SortingKey;
  direction: SortDirection;
}

export interface SortColumn {
  sortKey: SortingKey;
  sortingText: string;
}

const columns: SortColumn[] = [
  {
    sortKey: 'NAME',
    sortingText: 'Navn',
  },
  {
    sortKey: 'FNR',
    sortingText: 'Fødselsnummer',
  },
  {
    sortKey: 'COMPANY',
    sortingText: 'Virksomhet',
  },
  {
    sortKey: 'VEILEDER',
    sortingText: 'Veileder',
  },
  {
    sortKey: 'UKE',
    sortingText: 'Sykefravær',
  },
  {
    sortKey: 'DATO',
    sortingText: 'Frist/Dato',
  },
  {
    sortKey: 'HENDELSE',
    sortingText: 'Hendelse',
  },
];

export const useSorting = () => {
  const [sorting, setSorting] = useLocalStorageState<Sorting>(
    StoreKey.SORTING,
    {
      orderBy: 'FNR',
      direction: 'ascending',
    }
  );

  return { columns, sorting, setSorting };
};
