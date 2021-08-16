import React, { ReactElement, useState } from 'react';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import {
  updateBirthDateFilter,
  updateCompaniesFilter,
} from '@/store/filters/filter_actions';
import BirthDateFilter from './filters/BirthDateFilter';
import CompanyFilter from './filters/CompanyFilter';
import { PersonregisterState } from '@/store/personregister/personregisterTypes';
import { ApplicationState } from '@/store';
import countFilterAction, {
  CounterFilterActionTypes,
} from '../metrics/countFilterAction';
import { mapPersonregisterToCompanyList } from '@/utils/personDataUtil';

const texts = {
  panelTitle: 'Filter',
};

const SpacedFilters = styled.div`
  > * {
    margin-bottom: 1em;
  }
`;

interface PersonFilterProps {
  personregister: PersonregisterState;
}

export const PersonFilter = (props: PersonFilterProps): ReactElement => {
  const [panelOpen, setPanelOpen] = useState(true);
  const dispatch = useDispatch();

  const { personregister } = props;

  const togglePanel = () => {
    setPanelOpen(panelOpen);
  };

  const onBirthDateChange = (birthDates: string[]) => {
    countFilterAction(CounterFilterActionTypes.BIRTHDAY_FILTER).next();
    dispatch(updateBirthDateFilter(birthDates));
  };

  const onCompanyChange = (companies: string[]) => {
    countFilterAction(CounterFilterActionTypes.COMPANY_FILTER).next();
    dispatch(updateCompaniesFilter(companies));
  };

  const filters = useSelector((state: ApplicationState) => state.filters);

  return (
    <Ekspanderbartpanel
      apen={panelOpen}
      onClick={togglePanel}
      tittel={texts.panelTitle}
    >
      <SpacedFilters>
        <CompanyFilter
          selectedOptions={filters.selectedCompanies}
          options={mapPersonregisterToCompanyList(personregister)}
          onSelect={onCompanyChange}
        />
        <BirthDateFilter
          onSelect={onBirthDateChange}
          selectedDates={filters.selectedBirthDates}
        />
      </SpacedFilters>
    </Ekspanderbartpanel>
  );
};
