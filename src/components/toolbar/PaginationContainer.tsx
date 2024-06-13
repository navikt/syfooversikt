import React, { ReactElement, useEffect, useState } from 'react';
import { Pagination, Switch } from '@navikt/ds-react';

export const PAGINATED_NUMBER_OF_ITEMS = 50;

interface PaginationContainerProps {
  numberOfItemsTotal: number;
  setPageInfo: (indices: {
    firstVisibleIndex: number;
    lastVisibleIndex: number;
  }) => void;
  onPageChange: (start: number, end: number) => void;
}

const PaginationContainer = ({
  numberOfItemsTotal,
  setPageInfo,
  onPageChange,
}: PaginationContainerProps): ReactElement => {
  const [numberOfItemsPerPage, setNumberOfItemsPerPage] = useState(
    PAGINATED_NUMBER_OF_ITEMS
  );
  const [page, setPage] = useState(1);
  const numberOfPages =
    numberOfItemsTotal < numberOfItemsPerPage
      ? 1
      : Math.ceil(numberOfItemsTotal / numberOfItemsPerPage);
  const allItemsVisible = numberOfItemsPerPage === numberOfItemsTotal;
  const showToggleAllItems = numberOfItemsTotal > PAGINATED_NUMBER_OF_ITEMS;

  useEffect(() => {
    const start = Math.min(
      (page - 1) * numberOfItemsPerPage,
      numberOfItemsTotal
    );
    const end = allItemsVisible
      ? numberOfItemsTotal
      : Math.min(page * numberOfItemsPerPage - 1, numberOfItemsTotal);

    setPageInfo({
      firstVisibleIndex: start,
      lastVisibleIndex: end,
    });
    onPageChange(start, end);
  }, [
    allItemsVisible,
    numberOfItemsPerPage,
    numberOfItemsTotal,
    onPageChange,
    page,
    setPageInfo,
  ]);

  const handleToggleShowAll = () => {
    if (allItemsVisible) {
      setNumberOfItemsPerPage(PAGINATED_NUMBER_OF_ITEMS);
    } else {
      setNumberOfItemsPerPage(numberOfItemsTotal);
      setPage(1);
    }
  };

  return (
    <div className="flex flex-row items-center gap-6">
      <Pagination
        page={page}
        count={numberOfPages}
        onPageChange={setPage}
        size="small"
      />
      {showToggleAllItems && (
        <Switch
          size="small"
          checked={allItemsVisible}
          onChange={handleToggleShowAll}
        >
          Vis alle
        </Switch>
      )}
    </div>
  );
};

export default PaginationContainer;
