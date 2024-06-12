import React, { ReactElement } from 'react';
import styled from 'styled-components';
import { Column } from 'nav-frontend-grid';
import themes from '../styles/themes';
import Chevron from 'nav-frontend-chevron';
import { StoreKey, useLocalStorageState } from '@/hooks/useLocalStorageState';
import { SortColumn, SortingType, useSorting } from '@/hooks/useSorting';

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

interface SortingRowProps {
  onSortClick(type: SortingType): void;
}

const Sorteringsrad = ({ onSortClick }: SortingRowProps): ReactElement => {
  const [
    currentSortingType,
    setCurrentSortingType,
  ] = useLocalStorageState<SortingType>(StoreKey.SORT, 'FNR_ASC');
  const { columns } = useSorting();

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

  const xsType = (col: SortColumn) => {
    switch (col.sortKey) {
      case 'NAME':
        return '2';
      case 'FNR':
        return '2';
      case 'COMPANY':
        return '2';
      case 'VEILEDER':
        return '2';
      case 'UKE':
        return '1';
      case 'DATO':
        return '1';
    }
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

  return (
    <>
      {columns.map((col, index) => {
        return (
          <FlexColumn key={index} xs={xsType(col)}>
            <SortingButton
              onClick={() =>
                onSortingButtonClicked(col.sortingTypeAsc, col.sortingTypeDesc)
              }
              sortert={isSorted(col.sortingTypeAsc, col.sortingTypeDesc)}
            >
              {col.sortingText}
            </SortingButton>
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
