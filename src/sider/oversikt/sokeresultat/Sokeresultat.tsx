import React, { useEffect, useState } from 'react';
import { VeilederArbeidstaker } from '@/api/types/veilederArbeidstakerTypes';
import ToolbarWrapper from './toolbar/ToolbarWrapper';
import { useTildelVeileder } from '@/data/veiledereQueryHooks';
import { PersonregisterState } from '@/api/types/personregisterTypes';
import {
  Filterable,
  filterOnAge,
  filterOnBirthDates,
  filterOnCompany,
  filterOnFodselsnummerOrName,
  filterOnFrist,
  filterOnPersonregister,
} from '@/utils/hendelseFilteringUtils';
import { useFilters } from '@/context/filters/FilterContext';
import { OversiktTableContainer } from '@/sider/oversikt/sokeresultat/oversikttable/OversiktTableContainer';
import { TabType, useTabType } from '@/hooks/useTabType';

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

  const selectedHendelsetypeFilter =
    selectedTab === TabType.MIN_OVERSIKT
      ? {
          ...filterState.selectedHendelseType,
          ufordeltBruker: false,
        }
      : filterState.selectedHendelseType;

  const filteredEvents = allEvents
    .applyFilter((v) => filterOnCompany(v, filterState.selectedCompanies))
    .applyFilter((v) => filterOnBirthDates(v, filterState.selectedBirthDates))
    .applyFilter((v) => filterOnFrist(v, filterState.selectedFristFilters))
    .applyFilter((v) => filterOnAge(v, filterState.selectedAgeFilters))
    .applyFilter((v) => filterOnPersonregister(v, selectedHendelsetypeFilter))
    .applyFilter((v) =>
      filterOnFodselsnummerOrName(v, filterState.tekstFilter)
    );

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
