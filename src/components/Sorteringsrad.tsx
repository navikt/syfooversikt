import React from 'react';
import { useState } from 'react';
import styled from 'styled-components';
import {
  Column,
  Row,
} from 'nav-frontend-grid';
import themes from '../styles/themes';
import { SortingType } from '../utils/hendelseFilteringUtils';
import Chevron from 'nav-frontend-chevron';

const tekster = {
  navn: 'Etternavn, Fornavn',
  fodselsnummer: 'Fødselsnummer',
  ident: 'NAV-ident',
  veileder: 'Veileder',
  overskriftBruker: 'Bruker',
  overskriftVeileder: 'Veileder',
  virksomhet: 'Virksomhet',
};
const RowStyled = styled(Row)`
  margin-left: 0px !important;
  margin-right: 0px !important;
`;

export const OverskriftRad = styled(RowStyled)`
  display: flex;
  align-items: center;
  /* padding: .5rem 0; */
  border-top: 1px solid ${themes.color.navGra20};
  border-bottom: 1px solid ${themes.color.navGra20};
  font-weight: 700;
`;

const IngressRad = styled(RowStyled)`
  display: flex;
  align-items: center;
  border-bottom: 1px solid ${themes.color.navGra40};
`;

const GrayChevron = styled(Chevron)`
  margin-left: 0.25em;
  color: #3E3832;
`;

export const SortingButton = styled.p`
  cursor: pointer;
  color: ${themes.color.navBla};
  user-select: none;
`;

export const FlexColumn = styled(Column)`
  margin: 0px;
  display: flex;
  align-items: center;
  white-space: nowrap;
  text-overflow: ellipsis;
  /* overflow: hidden; */
  @media (max-width: 960px) {
    ${GrayChevron} {
      display: none;
    }
  }
`;

interface SortingRowProps {
  onSortClick(type: SortingType): void;
}

const Sorteringsrad = ({ onSortClick }: SortingRowProps) => {
  const [ currentSortingType, setCurrentSortingType ] = useState<SortingType>('NONE');

  const onSortingButtonClicked = (sortingTypeAsc: SortingType, sortingTypeDesc: SortingType) => {
    const nextSortingType: SortingType = currentSortingType === sortingTypeAsc
              ? sortingTypeDesc
              : sortingTypeAsc;
    setCurrentSortingType(nextSortingType);
    onSortClick(nextSortingType);
  };

  const chevronType = currentSortingType === 'NAME_ASC'
    ? 'opp'
    : 'ned';
  return (
    <>
      <IngressRad>
        <Column className="emptyColumn" xs={'1'} />
        <FlexColumn xs={'3'}>
        <SortingButton onClick={() => onSortingButtonClicked('COMPANY_ASC', 'COMPANY_DESC')}>
            <strong>Etternavn</strong>
          </SortingButton>
          <p>, Fornavn</p>
          <GrayChevron type={chevronType} />
        </FlexColumn>
        <Column xs={'2'}>
          <SortingButton onClick={() => onSortingButtonClicked('FNR_ASC', 'FNR_DESC')}>
            <strong>{tekster.fodselsnummer}</strong>
          </SortingButton>
        </Column>
        <Column xs={'2'}>
          <SortingButton onClick={() => onSortingButtonClicked('COMPANY_ASC', 'COMPANY_DESC')}>
            <strong>{tekster.virksomhet}</strong>
          </SortingButton>
        </Column>
        <Column xs={'2'}>{tekster.veileder}</Column>
        <Column xs={'2'} />
      </IngressRad>
    </>
  );
};

export default Sorteringsrad;
