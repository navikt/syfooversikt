import { SortingType } from '../../utils/hendelseFilteringUtils';

export enum SortingActionTypes {
  SORT_BRUKERE = 'SORT_BRUKERE',
}

export interface SortBrukereAction {
  type: SortingActionTypes.SORT_BRUKERE;
  sortingType: SortingType;
}

export const sortBrukere = (sortingType: SortingType): SortBrukereAction => ({
  type: SortingActionTypes.SORT_BRUKERE,
  sortingType,
});
