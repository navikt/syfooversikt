import React from 'react';
import {
  PersonregisterData,
  PersonregisterState,
} from '@/api/types/personregisterTypes';
import { toPersonData } from '@/utils/toPersondata';
import { PersonFilter } from '@/components/PersonFilter';
import Sokeresultat from '@/components/Sokeresultat';
import styled from 'styled-components';
import { TekstFilter } from '@/components/filters/TekstFilter';
import { HendelseTypeFilter } from '@/components/HendelseTypeFilter';
import { ClearFiltersButton } from '@/components/filters/ClearFiltersButton';
import {
  Filterable,
  filterEventsOnVeileder,
} from '@/utils/hendelseFilteringUtils';
import { VeilederinfoDTO } from '@/api/types/veilederinfoTypes';
import { OverviewTabType } from '@/konstanter';
import { PersonoversiktStatus } from '@/api/types/personoversiktTypes';
import { useFilters } from '@/context/filters/FilterContext';
import { useTabType } from '@/context/tab/TabTypeContext';
import AlertStripe from 'nav-frontend-alertstriper';

const tekster = {
  hentetIngenPersoner: 'Det er ingen personer knyttet til enhet med hendelser',
};

const SokeresultatFiltre = styled.div`
  margin-right: 2rem;
  width: 18em;
`;

export const AlertStripeWithSpacing = styled(AlertStripe)`
  margin-bottom: 1rem;
  margin-top: 1rem;
`;

const OversiktContainerInnhold = styled.div`
  display: flex;
  flex-direction: row;

  @media (max-width: 960px) {
    ${SokeresultatFiltre} {
      flex: 1;
      width: auto;
      margin-right: 0;
      margin-bottom: 4em;
    }
  }
`;

interface OversiktProps {
  personoversiktData: PersonoversiktStatus[];
  personregisterData: PersonregisterData[];
  aktivVeilederData: VeilederinfoDTO;
}

export const Oversikt = ({
  personoversiktData,
  personregisterData,
  aktivVeilederData,
}: OversiktProps) => {
  const { filterState } = useFilters();
  const { tabType } = useTabType();

  const personData: PersonregisterState = toPersonData(
    personoversiktData,
    personregisterData
  );

  const eventFilterValue =
    tabType === OverviewTabType.MY_OVERVIEW
      ? [aktivVeilederData.ident]
      : filterState.selectedVeilederIdents;

  const allEvents = new Filterable<PersonregisterState>(
    personData
  ).applyFilter((personData) =>
    filterEventsOnVeileder(personData, eventFilterValue)
  );

  return (
    <div>
      {Object.keys(allEvents.value).length === 0 && (
        <AlertStripeWithSpacing type={'advarsel'}>
          {tekster.hentetIngenPersoner}
        </AlertStripeWithSpacing>
      )}
      <OversiktContainerInnhold>
        <SokeresultatFiltre>
          <ClearFiltersButton />
          <TekstFilter />
          <HendelseTypeFilter personRegister={allEvents.value} />

          <PersonFilter personregister={personData} />
        </SokeresultatFiltre>
        <Sokeresultat allEvents={allEvents} />
      </OversiktContainerInnhold>
    </div>
  );
};
