import React from 'react';
import {
  PersonregisterData,
  PersonregisterState,
} from '@/api/types/personregisterTypes';
import { toPersonData } from '@/utils/toPersondata';
import { PersonFilter } from '@/sider/oversikt/filter/PersonFilter';
import Sokeresultat from '@/sider/oversikt/sokeresultat/Sokeresultat';
import { TekstFilter } from '@/sider/oversikt/filter/TekstFilter';
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

interface Props {
  personoversiktData: PersonOversiktStatusDTO[];
  personregisterData: PersonregisterData[];
}

export default function Oversikt({
  personoversiktData,
  personregisterData,
}: Props) {
  const aktivVeilederQuery = useAktivVeilederQuery();
  const { filterState } = useFilters();
  const { selectedTab } = useTabType();

  const personData: PersonregisterState = toPersonData(
    personoversiktData,
    personregisterData
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
        <TekstFilter />
        {selectedTab === TabType.ENHETENS_OVERSIKT && (
          <UfordelteBrukereFilter persondata={personData} />
        )}
        <HendelseFilter personRegister={allEvents.value} />

        <PersonFilter personregister={personData} />
        <ClearFiltersButton />
      </Box>

      <Sokeresultat allEvents={allEvents} />
    </div>
  );
}
