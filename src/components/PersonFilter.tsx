import React, { ReactElement, useState } from 'react';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import BirthDateFilter from './filters/BirthDateFilter';
import CompanyFilter from './filters/CompanyFilter';
import { PersonregisterState } from '@/api/types/personregisterTypes';
import { mapPersonregisterToCompanyList } from '@/utils/personDataUtil';
import { useFilters } from '@/context/filters/FilterContext';
import { ActionType } from '@/context/filters/filterContextActions';
import { FristFilter } from '@/components/filters/FristFilter';
import { FristFilterOption } from '@/utils/hendelseFilteringUtils';

const texts = {
  panelTitle: 'Filter',
  trackingLabelCompanies: 'Filter - Virksomheter',
  trackingLabelDate: 'Filter - Fødselsdato',
};

interface PersonFilterProps {
  personregister: PersonregisterState;
}

export const PersonFilter = ({
  personregister,
}: PersonFilterProps): ReactElement => {
  const { filterState, dispatch: dispatchFilterAction } = useFilters();
  const [panelOpen, setPanelOpen] = useState(true);

  const togglePanel = () => {
    setPanelOpen(panelOpen);
  };

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

  return (
    <Ekspanderbartpanel
      apen={panelOpen}
      onClick={togglePanel}
      tittel={texts.panelTitle}
    >
      <div className="flex flex-col gap-4">
        <CompanyFilter
          selectedOptions={filterState.selectedOptions}
          selectedCompanies={filterState.selectedCompanies}
          options={mapPersonregisterToCompanyList(personregister)}
          onSelect={onCompanyChange}
        />
        <BirthDateFilter
          onSelect={onBirthDateChange}
          selectedDates={filterState.selectedBirthDates}
        />
        <FristFilter onChange={onFristFilterChange} />
      </div>
    </Ekspanderbartpanel>
  );
};
