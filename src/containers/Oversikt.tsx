import React from 'react';
import {
  PersonregisterData,
  PersonregisterState,
} from '@/api/types/personregisterTypes';
import { toPersonData } from '@/utils/toPersondata';
import { PersonFilter } from '@/components/Filter/PersonFilter';
import Sokeresultat from '@/components/Sokeresultat';
import styled from 'styled-components';
import { TekstFilter } from '@/components/filters/TekstFilter';
import { HendelseTypeFilter } from '@/components/HendelseTypeFilter';
import { ClearFiltersButton } from '@/components/filters/ClearFiltersButton';
import {
  Filterable,
  filterEventsOnVeileder,
} from '@/utils/hendelseFilteringUtils';
import { OverviewTabType } from '@/konstanter';
import { PersonOversiktStatusDTO } from '@/api/types/personoversiktTypes';
import { useFilters } from '@/context/filters/FilterContext';
import { useTabType } from '@/context/tab/TabTypeContext';
import { useAktivVeilederQuery } from '@/data/veiledereQueryHooks';

const SokeresultatFiltre = styled.div`
  margin-right: 1rem;
  width: 18em;
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
  personoversiktData: PersonOversiktStatusDTO[];
  personregisterData: PersonregisterData[];
}

export const Oversikt = ({
  personoversiktData,
  personregisterData,
}: OversiktProps) => {
  const aktivVeilederQuery = useAktivVeilederQuery();
  const { filterState } = useFilters();
  const { tabType } = useTabType();

  const personData: PersonregisterState = toPersonData(
    personoversiktData,
    personregisterData
  );

  const eventFilterValue =
    tabType === OverviewTabType.MY_OVERVIEW
      ? [aktivVeilederQuery.data?.ident || '']
      : filterState.selectedVeilederIdents;

  const allEvents = new Filterable<PersonregisterState>(
    personData
  ).applyFilter((personData) =>
    filterEventsOnVeileder(personData, eventFilterValue)
  );

  return (
    <OversiktContainerInnhold>
      <SokeresultatFiltre>
        <ClearFiltersButton />
        <TekstFilter />
        <HendelseTypeFilter personRegister={allEvents.value} />

        <PersonFilter personregister={personData} />
      </SokeresultatFiltre>

      <Sokeresultat allEvents={allEvents} />
    </OversiktContainerInnhold>
  );
};
