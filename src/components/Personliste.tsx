import React, { ReactElement } from 'react';
import styled from 'styled-components';
import { EtikettInfo } from 'nav-frontend-etiketter';
import { Personrad } from './Personrad';
import { VeilederDTO } from '@/api/types/veiledereTypes';
import {
  PersonData,
  PersonregisterState,
} from '@/api/types/personregisterTypes';
import {
  getSortedEventsFromSortingType,
  SortingType,
} from '@/utils/hendelseFilteringUtils';
import { useVeiledereQuery } from '@/data/veiledereQueryHooks';
import { EmptyDrawer } from '@/components/EmptyDrawer/EmptyDrawer';

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

export const getVeilederComponent = (
  veiledere: VeilederDTO[],
  personData: PersonData
): ReactElement => {
  const tildeltVeilederIdent = personData.tildeltVeilederIdent;

  if (tildeltVeilederIdent) {
    const tildeltVeileder = veiledere.find(
      (v) => v.ident === tildeltVeilederIdent
    );
    if (!tildeltVeileder || !tildeltVeileder.fornavn) {
      return <VeilederNavn>{tildeltVeilederIdent}</VeilederNavn>;
    } else {
      return (
        <VeilederNavn>{`${tildeltVeileder.etternavn}, ${tildeltVeileder.fornavn}`}</VeilederNavn>
      );
    }
  }

  return <UfordeltBrukerEtikett />;
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
    return Object.fromEntries(
      Object.entries(register).slice(startItem, endItem + 1)
    );
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

  const personListe = Object.entries(paginatedPersonregister);

  if (!personListe.length) {
    return <EmptyDrawer />;
  }

  return (
    <>
      {personListe.map(([fnr, persondata], idx) => {
        return (
          <Personrad
            index={idx}
            key={idx}
            fnr={fnr}
            veilederName={getVeilederComponent(
              veiledereQuery.data || [],
              persondata
            )}
            personData={persondata}
            checkboxHandler={checkboxHandler}
            kryssAv={erMarkert(markertePersoner, fnr)}
          />
        );
      })}
    </>
  );
};

export default Personliste;
