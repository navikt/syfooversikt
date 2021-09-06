import PaginationRow from '../PaginationRow';
import React, { ReactElement, useCallback } from 'react';
import styled from 'styled-components';
import themes from '../../styles/themes';
import {
  getTogglePaginationText,
  onTogglePaginationClick,
} from '../utils/toolbar';

const TogglePagination = styled.p`
  cursor: pointer;
  margin-right: 0.7em;
  color: ${themes.color.navBla};
  :hover {
    border-bottom: 1px solid ${themes.color.navGra40};
  }
`;

const Wrapper = styled.div`
  display: inline-flex;
  flex-direction: row;
  align-items: center;
`;

interface PaginationContainerProps {
  numberOfItemsPerPage: number;
  numberOfItemsTotal: number;
  setNumberOfItemsPerPage: (n: number) => void;
  setPageInfo: (indices: {
    firstVisibleIndex: number;
    lastVisibleIndex: number;
  }) => void;
  onPageChange: (start: number, end: number) => void;
  shouldShowTogglePagination: boolean;
}

const PaginationContainer = ({
  numberOfItemsPerPage,
  setNumberOfItemsPerPage,
  numberOfItemsTotal,
  shouldShowTogglePagination,
  setPageInfo,
  onPageChange,
}: PaginationContainerProps): ReactElement => {
  const pageChangeCallback = useCallback(
    (start: number, end: number) => {
      setPageInfo({
        firstVisibleIndex: start,
        lastVisibleIndex: end,
      });
      onPageChange(start, end);
    },
    [onPageChange, setPageInfo]
  );

  return (
    <Wrapper>
      {shouldShowTogglePagination && (
        <TogglePagination
          onClick={() => {
            onTogglePaginationClick(
              numberOfItemsPerPage,
              setNumberOfItemsPerPage,
              numberOfItemsTotal
            );
          }}
        >
          {getTogglePaginationText(numberOfItemsPerPage, numberOfItemsTotal)}
        </TogglePagination>
      )}
      <PaginationRow
        numberOfItems={numberOfItemsTotal}
        startPage={0}
        maxNumberPerPage={numberOfItemsPerPage}
        onPageChange={pageChangeCallback}
      />
    </Wrapper>
  );
};

export default PaginationContainer;
