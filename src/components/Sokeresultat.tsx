import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { VeilederArbeidstaker } from '@/api/types/veilederArbeidstakerTypes';
import Personliste from './Personliste';
import ToolbarWrapper from './toolbar/ToolbarWrapper';
import { useTildelVeileder } from '@/data/veiledereQueryHooks';
import { PersonregisterState } from '@/api/types/personregisterTypes';
import {
  Filterable,
  filterOnBirthDates,
  filterOnCompany,
  filtrerPaaFodselsnummerEllerNavn,
  filtrerPersonregister,
  SortingType,
} from '@/utils/hendelseFilteringUtils';
import { useFilters } from '@/context/filters/FilterContext';
import { useTabType } from '@/context/tab/TabTypeContext';
import { useAktivEnhet } from '@/context/aktivEnhet/AktivEnhetContext';

interface SokeresultatProps {
  allEvents: Filterable<PersonregisterState>;
}

const lagListe = (
  markertePersoner: string[],
  veilederIdent: string,
  enhet: string
): VeilederArbeidstaker[] => {
  return markertePersoner.map((fnr: string) => ({
    veilederIdent,
    fnr,
    enhet,
  }));
};

const SokeresultatContainer = styled.div`
  flex: 3;
`;

const Sokeresultat = ({ allEvents }: SokeresultatProps) => {
  const { aktivEnhet } = useAktivEnhet();
  const tildelVeileder = useTildelVeileder();
  const { filterState } = useFilters();
  const { tabType } = useTabType();

  const [markertePersoner, setMarkertePersoner] = useState<string[]>([]);
  const [startItem, setStartItem] = useState(0);
  const [endItem, setEndItem] = useState(0);
  const [sortingType, setSortingType] = useState<SortingType>('FNR_ASC');

  useEffect(() => {
    setMarkertePersoner([]);
  }, [tabType]);

  const filteredEvents = allEvents
    .applyFilter((v) => filterOnCompany(v, filterState.selectedCompanies))
    .applyFilter((v) => filterOnBirthDates(v, filterState.selectedBirthDates))
    .applyFilter((v) =>
      filtrerPersonregister(v, filterState.selectedHendelseType)
    )
    .applyFilter((v) =>
      filtrerPaaFodselsnummerEllerNavn(v, filterState.tekstFilter)
    );

  const allFnr = Object.keys(filteredEvents.value);

  const checkboxHandler = (fnr: string): void => {
    const fnrIndex = markertePersoner.indexOf(fnr);
    const personIsMarked = fnrIndex !== -1;

    if (personIsMarked) {
      setMarkertePersoner(markertePersoner.filter((p) => p !== fnr));
    } else {
      setMarkertePersoner([...markertePersoner, fnr]);
    }
  };

  const checkAllHandler = (checked: boolean): void => {
    setMarkertePersoner(checked ? allFnr : []);
  };

  const buttonHandler = (veilederIdent: string): void => {
    const veilederArbeidstakerListe = lagListe(
      markertePersoner,
      veilederIdent,
      aktivEnhet || ''
    );

    tildelVeileder.mutate(veilederArbeidstakerListe);
  };

  const onPageChange = (startItem: number, endItem: number): void => {
    setStartItem(startItem);
    setEndItem(endItem);
  };

  return (
    <SokeresultatContainer>
      <ToolbarWrapper
        numberOfItemsTotal={allFnr.length}
        onPageChange={onPageChange}
        alleMarkert={allFnr.length === markertePersoner.length}
        buttonHandler={buttonHandler}
        checkAllHandler={checkAllHandler}
        markertePersoner={markertePersoner}
        setSortingType={setSortingType}
      />
      <Personliste
        personregister={filteredEvents.value}
        startItem={startItem}
        endItem={endItem}
        checkboxHandler={checkboxHandler}
        markertePersoner={markertePersoner}
        sortingType={sortingType}
      />
    </SokeresultatContainer>
  );
};

export default Sokeresultat;
