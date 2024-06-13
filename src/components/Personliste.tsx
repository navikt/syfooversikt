import React, { ReactElement } from 'react';
import { Personrad } from './Personrad';
import { PersonregisterState } from '@/api/types/personregisterTypes';
import { getSortedEventsFromSortingType } from '@/utils/hendelseFilteringUtils';
import { useVeiledereQuery } from '@/data/veiledereQueryHooks';
import { EmptyDrawer } from '@/components/EmptyDrawer/EmptyDrawer';
import { VeilederColumn } from '@/components/VeilederColumn';
import { SortingType } from '@/hooks/useSorting';

interface PersonlisteProps {
  personregister: PersonregisterState;
  checkboxHandler: (fnr: string) => void;
  markertePersoner: string[];
  startItem: number;
  endItem: number;
  sortingType: SortingType;
}

const erMarkert = (markertePersoner: string[], fnr: string) => {
  return (
    markertePersoner.findIndex((markertPerson: string) => {
      return markertPerson === fnr;
    }) !== -1
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
            veilederName={<VeilederColumn personData={persondata} />}
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
