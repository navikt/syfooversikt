import React, { useEffect, useState } from 'react';
import { PersonregisterState } from '@/api/types/personregisterTypes';
import {
  Filterable,
  filterHendelser,
  filterOnAge,
  filterOnBirthDates,
  filterOnCompany,
  filterOnFodselsnummerOrName,
  filterOnFrist,
} from '@/utils/hendelseFilteringUtils';
import { useFilters } from '@/context/filters/FilterContext';
import { OversiktTableContainer } from '@/sider/oversikt/sokeresultat/oversikttable/OversiktTableContainer';
import { TabType, useTabType } from '@/hooks/useTabType';
import { filterUfordelteBrukere } from '@/sider/oversikt/filter/UfordelteBrukereFilter';
import Toolbar from '@/sider/oversikt/sokeresultat/toolbar/Toolbar';

interface Props {
  allEvents: Filterable<PersonregisterState>;
}

export default function Sokeresultat({ allEvents }: Props) {
  const { filterState } = useFilters();
  const { selectedTab } = useTabType();

  const [selectedPersoner, setSelectedPersoner] = useState<string[]>([]);
  const [startItem, setStartItem] = useState(0);
  const [endItem, setEndItem] = useState(0);

  useEffect(() => {
    setSelectedPersoner([]);
  }, [selectedTab]);

  let filteredEvents = allEvents
    .applyFilter((v) => filterOnCompany(v, filterState.selectedCompanies))
    .applyFilter((v) => filterOnBirthDates(v, filterState.selectedBirthDates))
    .applyFilter((v) => filterOnFrist(v, filterState.selectedFristFilters))
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

      <OversiktTableContainer
        personregister={filteredEvents.value}
        startItem={startItem}
        endItem={endItem}
        selectedRows={selectedPersoner}
        setSelectedRows={setSelectedPersoner}
      />
    </div>
  );
}
