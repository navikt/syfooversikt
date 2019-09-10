import React from 'react';
import { useState } from 'react';
import styled from 'styled-components';
import {
  Column,
  Row,
} from 'nav-frontend-grid';
import themes from '../styles/themes';
import { SortingType } from '../utils/hendelseFilteringUtils';

const tekster = {
  navn: 'Etternavn, Fornavn',
  fodselsnummer: 'Fødselsnummer',
  ident: 'NAV-ident',
  veileder: 'Veileder',
  overskriftBruker: 'Bruker',
  overskriftVeileder: 'Veileder',
};

export const OverskriftRad = styled(Row)`
  display: flex;
  align-items: center;
  padding: .5rem 0;
  border-top: 1px solid ${themes.color.navGra40};
  border-bottom: 1px solid ${themes.color.navGra40};
  font-weight: 700;
`;

const IngressRad = styled(Row)`
  display: flex;
  align-items: center;
  border-bottom: 2px solid ${themes.color.navGra40};
`;

const SortingButton = styled.p`
  cursor: pointer;
  color: ${themes.color.navBla};
  user-select: none;
  &:active() {
    background: black;
  }
`;

interface SortingRowProps {
  onSortClick(type: SortingType): void;
}

const Sorteringsrad = ({ onSortClick }: SortingRowProps) => {
  const [ currentSortingType, setCurrentSortingType ] = useState<SortingType>('NONE');
  return (
    <>
      <OverskriftRad className="">
        <Column xs={'1'}/>
        <Column xs={'5'}>{tekster.overskriftBruker}</Column>
        <Column xs={'4'}>{tekster.overskriftVeileder}</Column>
      </OverskriftRad>

      <IngressRad className="">
        <Column className="emptyColumn" xs={'1'} />
        <Column xs={'3'}>
          <SortingButton onClick={() => {
            const nextSortingType: SortingType = currentSortingType === 'NAME_ASC'
              ? 'NAME_DESC'
              : 'NAME_ASC';
            setCurrentSortingType(nextSortingType);
            onSortClick(nextSortingType);
          }}>
            <strong>{tekster.navn}</strong>
          </SortingButton>
        </Column>
        <Column xs={'2'}>{tekster.fodselsnummer}</Column>
        <Column xs={'2'}>{tekster.ident}</Column>
        <Column xs={'2'}>{tekster.veileder}</Column>
      </IngressRad>
    </>
  );
};

export default Sorteringsrad;
