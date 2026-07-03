import React, { ReactElement } from "react";
import { Pagination, Switch } from "@navikt/ds-react";
import { Pagination as PaginationState } from "@/hooks/usePagination";

interface PaginationContainerProps {
  pagination: PaginationState;
}

const PaginationContainer = ({
  pagination,
}: PaginationContainerProps): ReactElement => {
  const {
    page,
    setPage,
    numberOfPages,
    allItemsVisible,
    showToggleAllItems,
    toggleShowAllItems,
  } = pagination;

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
          onChange={toggleShowAllItems}
        >
          Vis alle
        </Switch>
      )}
    </div>
  );
};

export default PaginationContainer;
