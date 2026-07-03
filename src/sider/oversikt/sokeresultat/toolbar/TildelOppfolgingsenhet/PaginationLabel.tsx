import { Label } from "@navikt/ds-react";
import React from "react";
import { Pagination } from "@/hooks/usePagination";

interface Props {
  pagination: Pagination;
  numberOfItemsTotal: number;
  selectedPersoner: string[];
}

const textPaginatedUsers = (
  pagination: Pagination,
  numberOfItemsTotal: number,
) => {
  return `Viser ${pagination.startItem + 1}-${
    pagination.endItem
  } av ${numberOfItemsTotal} brukere.`;
};

const textSelectedPersoner = (amount: number) => {
  return `${amount} markerte brukere.`;
};

export default function PaginationLabel({
  pagination,
  numberOfItemsTotal,
  selectedPersoner,
}: Props) {
  return (
    <div className="px-1 py-2 flex justify-between items-center">
      <Label size="small">
        {textPaginatedUsers(pagination, numberOfItemsTotal)}
      </Label>
      {selectedPersoner.length > 0 && (
        <Label size="small">
          {textSelectedPersoner(selectedPersoner.length)}
        </Label>
      )}
    </div>
  );
}
