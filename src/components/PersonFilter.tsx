import React, { ReactElement, useState } from 'react';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import styled from 'styled-components';
import BirthDateFilter from './filters/BirthDateFilter';
import CompanyFilter from './filters/CompanyFilter';
import { PersonregisterState } from '@/api/types/personregisterTypes';
import { mapPersonregisterToCompanyList } from '@/utils/personDataUtil';
import { useFilters } from '@/context/filters/FilterContext';
import { ActionType } from '@/context/filters/filterContextActions';

const texts = {
  panelTitle: 'Filter',
  trackingLabelCompanies: 'Filter - Virksomheter',
  trackingLabelDate: 'Filter - Fødselsdato',
};

const SpacedFilters = styled.div`
  > * {
    margin-bottom: 1em;
  }
`;

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

  return (
    <Ekspanderbartpanel
      apen={panelOpen}
      onClick={togglePanel}
      tittel={texts.panelTitle}
    >
      <SpacedFilters>
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
      </SpacedFilters>
    </Ekspanderbartpanel>
  );
};
