import React, { useEffect, useState } from 'react';
import { PersonregisterState } from '@/api/types/personregisterTypes';
import {
  Filterable,
  filterHendelser,
  filterOnAge,
  filterOnBirthDates,
  filterOnCompany,
  filterOnDato,
  filterOnFodselsnummerOrName,
  getSortedEventsFromSortingType,
} from '@/utils/hendelseFilteringUtils';
import { useFilters } from '@/context/filters/FilterContext';
import { TabType, useTabType } from '@/hooks/useTabType';
import { filterUfordelteBrukere } from '@/sider/oversikt/filter/UfordelteBrukereFilter';
import Toolbar from '@/sider/oversikt/sokeresultat/toolbar/Toolbar';
import OversiktTable from '@/sider/oversikt/sokeresultat/oversikttable/OversiktTable';
import { useSorting } from '@/hooks/useSorting';
import { useVeiledereQuery } from '@/data/veiledereQueryHooks';
import EmptyDrawer from '@/sider/oversikt/sokeresultat/oversikttable/EmptyDrawer';

interface Props {
  allEvents: Filterable<PersonregisterState>;
}

export default function Sokeresultat({ allEvents }: Props) {
  const { filterState } = useFilters();
  const { selectedTab } = useTabType();
  const { sorting, setSorting } = useSorting();
  const veiledereQuery = useVeiledereQuery();

  const [selectedPersoner, setSelectedPersoner] = useState<string[]>([]);
  const [startItem, setStartItem] = useState(0);
  const [endItem, setEndItem] = useState(0);

  useEffect(() => {
    setSelectedPersoner([]);
  }, [selectedTab]);

  let filteredEvents = allEvents
    .applyFilter((v) => filterOnCompany(v, filterState.selectedCompanies))
    .applyFilter((v) => filterOnBirthDates(v, filterState.selectedBirthDates))
    .applyFilter((v) => filterOnDato(v, filterState.selectedFristFilters))
    .applyFilter((v) => filterOnAge(v, filterState.selectedAgeFilters))
    .applyFilter((v) => filterHendelser(v, filterState.selectedHendelseType))
    .applyFilter((v) =>
      filterOnFodselsnummerOrName(v, filterState.tekstFilter)
    );

  if (selectedTab === TabType.ENHETENS_OVERSIKT) {
    filteredEvents = filteredEvents.applyFilter((v) =>
      filterUfordelteBrukere(v, filterState.isUfordelteBrukereFilter)
    );
  }

  const allFnr = Object.keys(filteredEvents.value);

  const checkAllHandler = (checked: boolean): void => {
    setSelectedPersoner(checked ? allFnr : []);
  };

  const onPageChange = (startItem: number, endItem: number): void => {
    setStartItem(startItem);
    setEndItem(endItem);
  };

  const sortedPersonregister = getSortedEventsFromSortingType(
    filteredEvents.value,
    veiledereQuery.data || [],
    sorting
  );
  const paginatedPersonregister = Object.fromEntries(
    Object.entries(sortedPersonregister).slice(startItem, endItem + 1)
  );
  const personListe = Object.entries(paginatedPersonregister);

  return (
    <div className="flex-[3]">
      <Toolbar
        numberOfItemsTotal={allFnr.length}
        onPageChange={onPageChange}
        isAllSelected={allFnr.length === selectedPersoner.length}
        checkAllHandler={checkAllHandler}
        selectedPersoner={selectedPersoner}
        setSelectedPersoner={setSelectedPersoner}
      />

      {!personListe.length ? (
        <EmptyDrawer />
      ) : (
        <OversiktTable
          sorting={sorting}
          setSorting={setSorting}
          personListe={personListe}
          selectedRows={selectedPersoner}
          setSelectedRows={setSelectedPersoner}
        />
      )}
    </div>
  );
}
