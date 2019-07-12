import React from 'react';
import { Container } from 'nav-frontend-grid';
import Personrad from './Personrad';
import Sorteringsrad from './Sorteringsrad';
import { PersonregisterState } from '../store/personregister/personregisterTypes';

interface PersonlisteProps {
  personregister: PersonregisterState;
  checkboxHandler: (fnr: string ) => void;
  markertePersoner: string[];
  checkAllHandler: (checked: boolean) => void;
}

const erMarkert = (markertePersoner: string[], fnr: string) => {
  return markertePersoner.findIndex((markertPerson: string) => {
    return markertPerson === fnr;
  }) !== -1;
};

const Personliste = (props: PersonlisteProps) => {
  const {
    personregister,
    checkboxHandler,
    markertePersoner,
    checkAllHandler,
  } = props;
  const fnrListe = Object.keys(personregister);
  return (<Container className="personliste">
    <Sorteringsrad checkAllHandler={checkAllHandler} />
    {
      fnrListe.map((fnr: string, idx: number) => {
        return (<Personrad
          key={idx}
          fnr={fnr}
          personData={personregister[fnr]}
          checkboxHandler={checkboxHandler}
          kryssAv={erMarkert(markertePersoner, fnr)}
        />);
      })
    }
  </Container>);
};

export default Personliste;
