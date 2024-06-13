import { SortState } from '@navikt/ds-react';

export type SortingKey =
  | 'NAME'
  | 'FNR'
  | 'COMPANY'
  | 'VEILEDER'
  | 'UKE'
  | 'DATO';
export type SortingOrder = 'ASC' | 'DESC';
export type SortingType = `${SortingKey}_${SortingOrder}` | 'NONE';

export interface SortColumn {
  sortKey: SortingKey;
  sortingText: string;
  sortingTypeAsc: SortingType;
  sortingTypeDesc: SortingType;
}

const columns: SortColumn[] = [
  {
    sortKey: 'NAME',
    sortingText: 'Navn',
    sortingTypeAsc: 'NAME_ASC',
    sortingTypeDesc: 'NAME_DESC',
  },
  {
    sortKey: 'FNR',
    sortingText: 'Fødselsnummer',
    sortingTypeAsc: 'FNR_ASC',
    sortingTypeDesc: 'FNR_DESC',
  },
  {
    sortKey: 'COMPANY',
    sortingText: 'Virksomhet',
    sortingTypeAsc: 'COMPANY_ASC',
    sortingTypeDesc: 'COMPANY_DESC',
  },
  {
    sortKey: 'VEILEDER',
    sortingText: 'Veileder',
    sortingTypeAsc: 'VEILEDER_ASC',
    sortingTypeDesc: 'VEILEDER_DESC',
  },
  {
    sortKey: 'UKE',
    sortingText: 'Sykefravær',
    sortingTypeAsc: 'UKE_ASC',
    sortingTypeDesc: 'UKE_DESC',
  },
  {
    sortKey: 'DATO',
    sortingText: 'Frist/Dato',
    sortingTypeAsc: 'DATO_ASC',
    sortingTypeDesc: 'DATO_DESC',
  },
];

const toSortState = (
  sortingType: SortingType
): (SortState & { orderBy: SortingKey }) | undefined => {
  switch (sortingType) {
    case 'NAME_ASC':
      return {
        orderBy: 'NAME',
        direction: 'ascending',
      };
    case 'NAME_DESC':
      return {
        orderBy: 'NAME',
        direction: 'descending',
      };
    case 'FNR_ASC':
      return {
        orderBy: 'FNR',
        direction: 'ascending',
      };
    case 'FNR_DESC':
      return {
        orderBy: 'FNR',
        direction: 'descending',
      };
    case 'COMPANY_ASC':
      return {
        orderBy: 'COMPANY',
        direction: 'ascending',
      };
    case 'COMPANY_DESC':
      return {
        orderBy: 'COMPANY',
        direction: 'descending',
      };
    case 'VEILEDER_ASC':
      return {
        orderBy: 'VEILEDER',
        direction: 'ascending',
      };
    case 'VEILEDER_DESC':
      return {
        orderBy: 'VEILEDER',
        direction: 'descending',
      };
    case 'UKE_ASC':
      return {
        orderBy: 'UKE',
        direction: 'ascending',
      };
    case 'UKE_DESC':
      return {
        orderBy: 'UKE',
        direction: 'descending',
      };
    case 'DATO_ASC':
      return {
        orderBy: 'DATO',
        direction: 'ascending',
      };
    case 'DATO_DESC':
      return {
        orderBy: 'DATO',
        direction: 'descending',
      };
    case 'NONE':
      return undefined;
  }
};

const toSortingType = (
  sortKey: SortingKey,
  currentDirection: SortState['direction']
): SortingType => {
  switch (currentDirection) {
    case 'ascending':
      return `${sortKey}_DESC`;
    case 'descending':
      return `${sortKey}_ASC`;
    case 'none':
      return 'NONE';
  }
};

export const useSorting = () => {
  return {
    columns,
    toSortState,
    toSortingType,
  };
};
