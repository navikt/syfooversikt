import React, { ReactElement } from 'react';
import styled from 'styled-components';
import { EtikettInfo } from 'nav-frontend-etiketter';
import { Personrad } from './Personrad';
import { Veileder } from '@/api/types/veiledereTypes';
import { veilederEllerNull } from '@/utils/personDataUtil';
import {
  PersonData,
  PersonregisterState,
} from '@/api/types/personregisterTypes';
import {
  getSortedEventsFromSortingType,
  SortingType,
} from '@/utils/hendelseFilteringUtils';
import { useVeiledereQuery } from '@/data/veiledereQueryHooks';

interface PersonlisteProps {
  personregister: PersonregisterState;
  checkboxHandler: (fnr: string) => void;
  markertePersoner: string[];
  startItem: number;
  endItem: number;
  sortingType: SortingType;
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

const Personliste = ({
  personregister,
  checkboxHandler,
  markertePersoner,
  startItem,
  endItem,
  sortingType,
}: PersonlisteProps): ReactElement => {
  const veiledereQuery = useVeiledereQuery();

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

  const sortedPersonregister = getSortedEventsFromSortingType(
    personregister,
    veiledereQuery.data || [],
    sortingType
  );
  const paginatedPersonregister = paginatePersonregister(
    sortedPersonregister,
    startItem,
    endItem
  );

  const fnrListe = Object.keys(paginatedPersonregister);

  return (
    <>
      {fnrListe.map((fnr: string, idx: number) => {
        return (
          <Personrad
            index={idx}
            key={idx}
            fnr={fnr}
            veilederName={getVeilederComponent(
              veiledereQuery.data || [],
              personregister[fnr]
            )}
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
