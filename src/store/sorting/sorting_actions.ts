import { SortingType } from '../../utils/hendelseFilteringUtils';

export const enum SortingActionTypes {
  SORT_BRUKERE = 'SORT_BRUKERE',
}

export const sortBrukere = (sortingType: SortingType) => {
  return {
    type: SortingActionTypes.SORT_BRUKERE,
    sortingType,
  };
};
