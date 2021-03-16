import React, { ReactElement } from 'react';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import ChevronKnapp from './ChevronKnapp';
import themes from '../styles/themes';
import Clickable from './toolbar/Clickable';

const PaginationItems = styled.div`
  display: flex;
  flex-direction: row;
  justify-items: center;
  justify-content: space-between;
`;

interface PaginationProps {
  startPage?: number;
  numberOfItems: number;
  maxNumberPerPage: number;
  onPageChange(start: number, end: number, pageNumber: number): void;
}

const Element = styled.div`
  display: flex;
  justify-content: center;
  border-left: 2px solid ${themes.color.navGra40};
  width: 2.5em;
`;

const PaginationRow = ({
  numberOfItems,
  startPage = 0,
  maxNumberPerPage,
  onPageChange,
}: PaginationProps): ReactElement => {
  const getNumberOfPages = () => {
    if (numberOfItems === maxNumberPerPage) {
      return 0;
    }
    return Math.floor(numberOfItems / maxNumberPerPage);
  };
  const [currentPage, setCurrentPage] = useState(startPage);

  useEffect(() => {
    setCurrentPage(0);
  }, [numberOfItems, maxNumberPerPage]);

  useEffect(() => {
    const chunk = getCurrentChunk();
    onPageChange(chunk.start, chunk.end, currentPage);
  }, [numberOfItems, currentPage, maxNumberPerPage]);

  const onNextClick = () => {
    const nextPage = Math.min(currentPage + 1, getNumberOfPages());
    if (nextPage > currentPage) {
      setCurrentPage(nextPage);
    }
  };

  const onPreviousClick = () => {
    setCurrentPage(Math.max(currentPage - 1, 0));
  };

  const getCurrentChunk = () => {
    const start = Math.min(currentPage * maxNumberPerPage, numberOfItems);
    const end = Math.min(
      (currentPage + 1) * maxNumberPerPage - 1,
      numberOfItems
    );
    return {
      start,
      end,
    };
  };

  return (
    <PaginationItems>
      <Element>
        <ChevronKnapp
          disabled={currentPage === 0}
          type="venstre"
          onClick={onPreviousClick}
        />
      </Element>
      {currentPage !== getNumberOfPages() && (
        <Element>
          <Clickable
            index={currentPage}
            setPage={setCurrentPage}
            currentPage={currentPage}
          />
        </Element>
      )}
      <Element>
        <Clickable
          index={getNumberOfPages()}
          setPage={setCurrentPage}
          currentPage={currentPage}
        />
      </Element>
      <Element>
        <ChevronKnapp
          disabled={currentPage === getNumberOfPages()}
          type="høyre"
          onClick={onNextClick}
        />
      </Element>
    </PaginationItems>
  );
};

export default PaginationRow;
