import React, { ReactElement, ReactNode, useState } from 'react';
import styled from 'styled-components';
import { Column } from 'nav-frontend-grid';
import themes from '../styles/themes';
import { SortingType } from '@/utils/hendelseFilteringUtils';
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

export const GrayChevron = styled(Chevron)`
  margin-left: 0.25em;
  color: #3e3832;
`;

interface SortingButtonProps {
  sortert: boolean;
}

export const SortingButton = styled.p<SortingButtonProps>`
  cursor: pointer;
  color: ${themes.color.navBla};
  user-select: none;
  font-weight: ${(props) => (props.sortert ? 'bold' : 'none')};
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

type XsType =
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | '10'
  | '11'
  | '12';

interface ColumnItem {
  sortingText: string;
  extraText: ReactNode;
  sortingTypeAsc: SortingType;
  sortingTypeDesc: SortingType;
  xs: XsType;
}

interface SortingRowProps {
  onSortClick(type: SortingType): void;
}

const Sorteringsrad = ({ onSortClick }: SortingRowProps): ReactElement => {
  const [currentSortingType, setCurrentSortingType] = useState<SortingType>(
    'FNR_ASC'
  );

  const onSortingButtonClicked = (
    sortingTypeAsc: SortingType,
    sortingTypeDesc: SortingType
  ) => {
    const nextSortingType: SortingType =
      currentSortingType === sortingTypeAsc ? sortingTypeDesc : sortingTypeAsc;
    setCurrentSortingType(nextSortingType);
    onSortClick(nextSortingType);
  };

  const chevronType = (
    sortingTypeAsc: SortingType,
    sortingTypeDesc: SortingType
  ) => {
    if (currentSortingType === sortingTypeAsc) {
      return 'opp';
    } else if (currentSortingType === sortingTypeDesc) {
      return 'ned';
    } else return undefined;
  };

  const isSorted = (
    sortingTypeAsc: SortingType,
    sortingTypeDesc: SortingType
  ) => {
    return (
      currentSortingType === sortingTypeAsc ||
      currentSortingType === sortingTypeDesc
    );
  };

  const columns: ColumnItem[] = [
    {
      sortingText: 'Etternavn',
      extraText: <p>, Fornavn</p>,
      sortingTypeAsc: 'NAME_ASC',
      sortingTypeDesc: 'NAME_DESC',
      xs: '3',
    },
    {
      sortingText: tekster.fodselsnummer,
      extraText: null,
      sortingTypeAsc: 'FNR_ASC',
      sortingTypeDesc: 'FNR_DESC',
      xs: '2',
    },
    {
      sortingText: tekster.virksomhet,
      extraText: null,
      sortingTypeAsc: 'COMPANY_ASC',
      sortingTypeDesc: 'COMPANY_DESC',
      xs: '2',
    },
    {
      sortingText: tekster.veileder,
      extraText: null,
      sortingTypeAsc: 'VEILEDER_ASC',
      sortingTypeDesc: 'VEILEDER_DESC',
      xs: '2',
    },
  ];

  return (
    <>
      {columns.map((col, index) => {
        return (
          <FlexColumn key={index} xs={col.xs}>
            <SortingButton
              onClick={() =>
                onSortingButtonClicked(col.sortingTypeAsc, col.sortingTypeDesc)
              }
              sortert={isSorted(col.sortingTypeAsc, col.sortingTypeDesc)}
            >
              {col.sortingText}
            </SortingButton>
            {col.extraText}

            {isSorted(col.sortingTypeAsc, col.sortingTypeDesc) && (
              <GrayChevron
                type={chevronType(col.sortingTypeAsc, col.sortingTypeDesc)}
              />
            )}
          </FlexColumn>
        );
      })}
    </>
  );
};

export default Sorteringsrad;
