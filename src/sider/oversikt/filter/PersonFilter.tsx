import React, { ReactElement } from 'react';
import BirthDateFilter from './BirthDateFilter';
import CompanyFilter from './CompanyFilter';
import { PersonregisterState } from '@/api/types/personregisterTypes';
import { mapPersonregisterToCompanyList } from '@/utils/personDataUtil';
import { useFilters } from '@/context/filters/FilterContext';
import { ActionType } from '@/context/filters/filterContextActions';
import { FristFilter } from '@/sider/oversikt/filter/FristFilter';
import {
  AgeFilterOption,
  FristFilterOption,
} from '@/utils/hendelseFilteringUtils';
import { AgeFilter } from '@/sider/oversikt/filter/AgeFilter';
import { VStack } from '@navikt/ds-react';

interface PersonFilterProps {
  personregister: PersonregisterState;
}

export const PersonFilter = ({
  personregister,
}: PersonFilterProps): ReactElement => {
  const { filterState, dispatch: dispatchFilterAction } = useFilters();

  const onBirthDateChange = (birthDates: string[]) => {
    dispatchFilterAction({
      type: ActionType.SetSelectedBirthDates,
      selectedBirthDates: birthDates,
    });
  };

  const onCompanyChange = (companies: string[]) => {
    dispatchFilterAction({
      type: ActionType.SetSelectedCompanies,
      selectedCompanies: companies,
    });
  };

  const onFristFilterChange = (fristFilters: FristFilterOption[]) => {
    dispatchFilterAction({
      type: ActionType.SetSelectedFristFilter,
      selectedFristFilters: fristFilters,
    });
  };

  const onAgeFilterChange = (ageFilters: AgeFilterOption[]) => {
    dispatchFilterAction({
      type: ActionType.SetSelectedAgeFilter,
      selectedAgeFilters: ageFilters,
    });
  };

  return (
    <VStack className="gap-4">
      <CompanyFilter
        selectedCompanies={filterState.selectedCompanies}
        options={mapPersonregisterToCompanyList(personregister)}
        onSelect={onCompanyChange}
      />
      <BirthDateFilter
        onSelect={onBirthDateChange}
        selectedDates={filterState.selectedBirthDates}
      />
      <AgeFilter
        onChange={onAgeFilterChange}
        selectedAgeFilters={filterState.selectedAgeFilters}
      />
      <FristFilter
        onChange={onFristFilterChange}
        selectedFristFilters={filterState.selectedFristFilters}
      />
    </VStack>
  );
};
