import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { EtikettInfo } from 'nav-frontend-etiketter';
import { Personrad } from './Personrad';
import { Veileder } from '@/store/veiledere/veiledereTypes';
import { veilederEllerNull } from '@/utils/personDataUtil';
import { ApplicationState } from '@/store';
import {
  PersonData,
  PersonregisterState,
} from '@/store/personregister/personregisterTypes';
import { getSortedEventsFromSortingType } from '@/utils/hendelseFilteringUtils';

interface PersonlisteProps {
  personregister: PersonregisterState;
  checkboxHandler: (fnr: string) => void;
  markertePersoner: string[];
  veiledere: Veileder[];
  startItem: number;
  endItem: number;
}

export const VeilederNavn = styled.label`
  text-overflow: ellipsis;
  overflow: hidden;
`;

const EtikettFokusStyled = styled(EtikettInfo)`
  padding: 2px 4px !important;
  background: rgb(224, 245, 251) !important;
  border-radius: 4px !important;
  border: 1px solid rgb(102, 203, 236);
`;

const UfordeltBrukerEtikett = () => (
  <EtikettFokusStyled>Ufordelt bruker</EtikettFokusStyled>
);

const erMarkert = (markertePersoner: string[], fnr: string) => {
  return (
    markertePersoner.findIndex((markertPerson: string) => {
      return markertPerson === fnr;
    }) !== -1
  );
};

const veilederForPerson = (veiledere: Veileder[], person: PersonData) => {
  if (person.tildeltVeilederIdent) {
    return veiledere.find((veileder) => {
      return veileder.ident === person.tildeltVeilederIdent;
    });
  }
  return undefined;
};

export const getVeilederComponent = (
  veiledere: Veileder[],
  personData: PersonData
): ReactElement => {
  const veilederName = veilederEllerNull(
    veilederForPerson(veiledere, personData)
  );
  return veilederName === null ? (
    <UfordeltBrukerEtikett />
  ) : (
    <VeilederNavn>{veilederName}</VeilederNavn>
  );
};

const Personliste = (props: PersonlisteProps): ReactElement => {
  const {
    personregister,
    checkboxHandler,
    markertePersoner,
    veiledere,
  } = props;

  const paginatePersonregister = (
    register: PersonregisterState,
    startItem: number,
    endItem: number
  ) => {
    const allFnr = Object.keys(register);
    return allFnr
      .slice(startItem, endItem + 1)
      .reduce((slicedPersonregister, fnr) => {
        slicedPersonregister[fnr] = personregister[fnr];
        return slicedPersonregister;
      }, {} as PersonregisterState);
  };

  const brukerSorting = useSelector((state: ApplicationState) => state.sorting);

  const sortedPersonregister = getSortedEventsFromSortingType(
    personregister,
    veiledere,
    brukerSorting.sortingType
  );
  const paginatedPersonregister = paginatePersonregister(
    sortedPersonregister,
    props.startItem,
    props.endItem
  );

  const fnrListe = Object.keys(paginatedPersonregister);

  const isVeilederDataLoaded = useSelector((state: ApplicationState) => {
    const aktivEnhet = state.veilederenheter.aktivEnhetId;
    if (aktivEnhet && state.veiledere[aktivEnhet]) {
      return state.veiledere[aktivEnhet].hentet;
    }
    return false;
  });

  return (
    <>
      {fnrListe.map((fnr: string, idx: number) => {
        return (
          <Personrad
            index={idx}
            key={idx}
            fnr={fnr}
            veilederName={
              isVeilederDataLoaded ? (
                getVeilederComponent(veiledere, personregister[fnr])
              ) : (
                <div />
              )
            }
            personData={personregister[fnr]}
            checkboxHandler={checkboxHandler}
            kryssAv={erMarkert(markertePersoner, fnr)}
          />
        );
      })}
    </>
  );
};

export default Personliste;
