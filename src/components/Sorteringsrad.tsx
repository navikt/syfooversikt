import React, { ReactElement, ReactNode } from 'react';
import styled from 'styled-components';
import { Column } from 'nav-frontend-grid';
import themes from '../styles/themes';
import { SortingType } from '@/utils/hendelseFilteringUtils';
import Chevron from 'nav-frontend-chevron';
import { useSortingType } from '@/hooks/useSortingType';

const tekster = {
  navn: 'Etternavn, Fornavn',
  fodselsnummer: 'Fødselsnummer',
  ident: 'NAV-ident',
  veileder: 'Veileder',
  overskriftBruker: 'Bruker',
  overskriftVeileder: 'Veileder',
  virksomhet: 'Virksomhet',
  varighetSykefravar: 'Varighet sykefravær',
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

const Sorteringsrad = (): ReactElement => {
  const { sortingType, setSortingType } = useSortingType();

  const onSortingButtonClicked = (
    sortingTypeAsc: SortingType,
    sortingTypeDesc: SortingType
  ) => {
    const nextSortingType: SortingType =
      sortingType === sortingTypeAsc ? sortingTypeDesc : sortingTypeAsc;
    setSortingType(nextSortingType);
  };

  const chevronType = (
    sortingTypeAsc: SortingType,
    sortingTypeDesc: SortingType
  ) => {
    if (sortingType === sortingTypeAsc) {
      return 'opp';
    } else if (sortingType === sortingTypeDesc) {
      return 'ned';
    } else return undefined;
  };

  const isSorted = (
    sortingTypeAsc: SortingType,
    sortingTypeDesc: SortingType
  ) => {
    return sortingType === sortingTypeAsc || sortingType === sortingTypeDesc;
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
    {
      sortingText: tekster.varighetSykefravar,
      extraText: null,
      sortingTypeAsc: 'UKE_ASC',
      sortingTypeDesc: 'UKE_DESC',
      xs: '1',
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
