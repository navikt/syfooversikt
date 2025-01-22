import React, { useEffect, useState } from 'react';
import { VeilederArbeidstaker } from '@/api/types/veilederArbeidstakerTypes';
import ToolbarWrapper from './toolbar/ToolbarWrapper';
import { useTildelVeileder } from '@/data/veiledereQueryHooks';
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

interface Props {
  allEvents: Filterable<PersonregisterState>;
}

const lagListe = (
  markertePersoner: string[],
  veilederIdent: string
): VeilederArbeidstaker[] => {
  return markertePersoner.map((fnr: string) => ({
    veilederIdent,
    fnr,
  }));
};

export default function Sokeresultat({ allEvents }: Props) {
  const tildelVeileder = useTildelVeileder();
  const { filterState } = useFilters();
  const { selectedTab } = useTabType();

  const [markertePersoner, setMarkertePersoner] = useState<string[]>([]);
  const [startItem, setStartItem] = useState(0);
  const [endItem, setEndItem] = useState(0);

  useEffect(() => {
    setMarkertePersoner([]);
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
    setMarkertePersoner(checked ? allFnr : []);
  };

  const buttonHandler = (veilederIdent: string): void => {
    const veilederArbeidstakerListe = lagListe(markertePersoner, veilederIdent);

    tildelVeileder.mutate(veilederArbeidstakerListe);
  };

  const onPageChange = (startItem: number, endItem: number): void => {
    setStartItem(startItem);
    setEndItem(endItem);
  };

  return (
    <div className="flex-[3]">
      <ToolbarWrapper
        numberOfItemsTotal={allFnr.length}
        onPageChange={onPageChange}
        alleMarkert={allFnr.length === markertePersoner.length}
        buttonHandler={buttonHandler}
        checkAllHandler={checkAllHandler}
        markertePersoner={markertePersoner}
      />
      <OversiktTableContainer
        personregister={filteredEvents.value}
        startItem={startItem}
        endItem={endItem}
        selectedRows={markertePersoner}
        setSelectedRows={setMarkertePersoner}
      />
    </div>
  );
}
