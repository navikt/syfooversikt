import { useState } from "react";

export const PAGINATED_NUMBER_OF_ITEMS = 50;

export interface Pagination {
  page: number;
  setPage: (page: number) => void;
  numberOfItemsPerPage: number;
  numberOfPages: number;
  /** 0-based index of the first visible item. */
  startItem: number;
  /** 0-based, exclusive end index of the visible items (e.g. for use with `Array.slice`). */
  endItem: number;
  allItemsVisible: boolean;
  showToggleAllItems: boolean;
  toggleShowAllItems: () => void;
}

/**
 * Owns pagination state (current page and page size) and derives the
 * visible item range for a list of `numberOfItemsTotal` items. Lives above
 * both the pagination controls (`PaginationContainer`) and the table so a
 * parent can also programmatically jump to the page containing a given item.
 */
export function usePagination(numberOfItemsTotal: number): Pagination {
  const [numberOfItemsPerPage, setNumberOfItemsPerPage] = useState(
    PAGINATED_NUMBER_OF_ITEMS,
  );
  const [page, setPage] = useState(1);

  const numberOfPages =
    numberOfItemsTotal < numberOfItemsPerPage
      ? 1
      : Math.ceil(numberOfItemsTotal / numberOfItemsPerPage);
  const allItemsVisible = numberOfItemsPerPage === numberOfItemsTotal;
  const showToggleAllItems = numberOfItemsTotal > PAGINATED_NUMBER_OF_ITEMS;

  const startItem = Math.min(
    (page - 1) * numberOfItemsPerPage,
    numberOfItemsTotal,
  );
  const endItem = allItemsVisible
    ? numberOfItemsTotal
    : Math.min(page * numberOfItemsPerPage, numberOfItemsTotal);

  function toggleShowAllItems() {
    if (allItemsVisible) {
      setNumberOfItemsPerPage(PAGINATED_NUMBER_OF_ITEMS);
    } else {
      setNumberOfItemsPerPage(numberOfItemsTotal);
      setPage(1);
    }
  }

  return {
    page,
    setPage,
    numberOfItemsPerPage,
    numberOfPages,
    startItem,
    endItem,
    allItemsVisible,
    showToggleAllItems,
    toggleShowAllItems,
  };
}
