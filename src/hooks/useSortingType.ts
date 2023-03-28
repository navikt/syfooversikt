import { SortingType } from '@/utils/hendelseFilteringUtils';
import { useSearchParams } from 'react-router-dom';

enum SearchParamKey {
  SORT = 'sortBy',
}

export const useSortingType = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const sortingType = (searchParams.get(SearchParamKey.SORT) ||
    'FNR_ASC') as SortingType;
  const setSortingType = (type: SortingType) => {
    searchParams.set(SearchParamKey.SORT, type);
    setSearchParams(searchParams);
  };

  return { sortingType, setSortingType };
};
