import React, { useState } from 'react';
import Personrad from './Personrad';
import Sorteringsrad from './Sorteringsrad';
import { PersonData, PersonregisterState } from '../store/personregister/personregisterTypes';
import { Veileder } from '../store/veiledere/veiledereTypes';
import styled from 'styled-components';
import { SortingType, getSortedEventsFromSortingType } from '../utils/hendelseFilteringUtils';
import { useSelector } from 'react-redux';
import { veilederEllerUfordelt } from '../utils/personDataUtil';
import { ApplicationState } from '../store';

interface PersonlisteProps {
  personregister: PersonregisterState;
  checkboxHandler: (fnr: string ) => void;
  markertePersoner: string[];
  veiledere: Veileder[];
}

const PersonlisteStyled = styled.section`
`;

const erMarkert = (markertePersoner: string[], fnr: string) => {
  return markertePersoner.findIndex((markertPerson: string) => {
    return markertPerson === fnr;
  }) !== -1;
};

const veilederForPerson = ((veiledere: Veileder[], person: PersonData) => {
  if (person.tildeltVeilederIdent) {
    return veiledere.find((veileder) => {
      return veileder.ident === person.tildeltVeilederIdent;
    });
  }
  return undefined;
});

const Personliste = (props: PersonlisteProps) => {
  const {
    personregister,
    checkboxHandler,
    markertePersoner,
    veiledere,
  } = props;

  const [ selectedSortingType, setSortingType ] = useState<SortingType>('NONE');
  const fnrListe = Object.keys(getSortedEventsFromSortingType(personregister, selectedSortingType));

  const isVeilederDataLoaded = useSelector((state: ApplicationState) => state.veiledere.hentet);

  return (<PersonlisteStyled>
    <Sorteringsrad  onSortClick={(type) => {
      setSortingType(type);
    }} />
    {
      fnrListe.map((fnr: string, idx: number) => {
        const veilederName = isVeilederDataLoaded
          ? veilederEllerUfordelt(veilederForPerson(veiledere, personregister[fnr]))
          : '';
        return (<Personrad
          index={idx}
          key={idx}
          fnr={fnr}
          veilederName={veilederName}
          personData={personregister[fnr]}
          checkboxHandler={checkboxHandler}
          kryssAv={erMarkert(markertePersoner, fnr)}
        />);
      })
    }
    </PersonlisteStyled>);
};

export default Personliste;
