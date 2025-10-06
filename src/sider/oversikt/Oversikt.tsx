import React from 'react';
import {
  PersonregisterState,
  PersonSkjermingskode,
  toPersonData,
} from '@/api/types/personregisterTypes';
import Sokeresultat from '@/sider/oversikt/sokeresultat/Sokeresultat';
import SykmeldtFilter from '@/sider/oversikt/filter/SykmeldtFilter';
import { ClearFiltersButton } from '@/sider/oversikt/filter/ClearFiltersButton';
import {
  Filterable,
  filterEventsOnVeileder,
} from '@/utils/hendelseFilteringUtils';
import { PersonOversiktStatusDTO } from '@/api/types/personoversiktTypes';
import { useFilters } from '@/context/filters/FilterContext';
import { useAktivVeilederQuery } from '@/data/veiledereQueryHooks';
import HendelseFilter from '@/sider/oversikt/filter/HendelseFilter';
import { Box } from '@navikt/ds-react';
import { TabType, useTabType } from '@/hooks/useTabType';
import UfordelteBrukereFilter from '@/sider/oversikt/filter/UfordelteBrukereFilter';
import VeilederFilter from '@/sider/oversikt/filter/VeilederFilter';
import CompanyFilter from '@/sider/oversikt/filter/CompanyFilter';
import BirthDateFilter from '@/sider/oversikt/filter/BirthDateFilter';
import AgeFilter from '@/sider/oversikt/filter/AgeFilter';
import FristFilter from '@/sider/oversikt/filter/FristFilter';

interface Props {
  personoversiktData: PersonOversiktStatusDTO[];
  personSkjermingskode: PersonSkjermingskode[];
}

export default function Oversikt({
  personoversiktData,
  personSkjermingskode,
}: Props) {
  const aktivVeilederQuery = useAktivVeilederQuery();
  const { filterState } = useFilters();
  const { selectedTab } = useTabType();

  const personData: PersonregisterState = toPersonData(
    personoversiktData,
    personSkjermingskode
  );

  const eventFilterValue =
    selectedTab === TabType.MIN_OVERSIKT
      ? [aktivVeilederQuery.data?.ident || '']
      : filterState.selectedVeilederIdents;

  const allEvents = new Filterable<PersonregisterState>(
    personData
  ).applyFilter((personData) =>
    filterEventsOnVeileder(personData, eventFilterValue)
  );

  return (
    <div className="flex flex-row">
      <Box
        borderRadius="medium"
        background="surface-default"
        borderColor="border-strong"
        padding="4"
        borderWidth="1"
        className="mb-4 flex flex-col gap-4 mr-4 w-[18rem] h-fit"
      >
        <SykmeldtFilter />
        {selectedTab === TabType.ENHETENS_OVERSIKT && <VeilederFilter />}
        {selectedTab === TabType.ENHETENS_OVERSIKT && (
          <UfordelteBrukereFilter persondata={personData} />
        )}
        <HendelseFilter personRegister={allEvents.value} />
        <CompanyFilter persondata={personData} />
        <BirthDateFilter />
        <AgeFilter />
        <FristFilter />
        <ClearFiltersButton />
      </Box>

      <Sokeresultat allEvents={allEvents} />
    </div>
  );
}
