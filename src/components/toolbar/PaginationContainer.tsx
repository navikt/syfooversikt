import Pagination from '../PaginationRow';
import React from 'react';
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

const PaginationContainer = (props: PaginationContainerProps) => {
  const {
    numberOfItemsPerPage,
    setNumberOfItemsPerPage,
    numberOfItemsTotal,
    shouldShowTogglePagination,
  } = props;

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
      <Pagination
        numberOfItems={numberOfItemsTotal}
        startPage={0}
        maxNumberPerPage={numberOfItemsPerPage}
        onPageChange={(start, end, pageNumber) => {
          props.setPageInfo({
            firstVisibleIndex: start,
            lastVisibleIndex: end,
          });
          props.onPageChange(start, end);
        }}
      />
    </Wrapper>
  );
};

export default PaginationContainer;
