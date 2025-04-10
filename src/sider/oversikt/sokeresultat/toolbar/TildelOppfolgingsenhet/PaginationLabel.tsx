import { Label } from '@navikt/ds-react';
import React from 'react';
import { PageInfoType } from '@/sider/oversikt/sokeresultat/toolbar/Toolbar';

interface Props {
  pageInfo: PageInfoType;
  numberOfItemsTotal: number;
  selectedPersoner: string[];
}

const textPaginatedUsers = (
  pageInfo: PageInfoType,
  numberOfItemsTotal: number
) => {
  return `Viser ${pageInfo.firstVisibleIndex + 1}-${
    pageInfo.lastVisibleIndex
  } av ${numberOfItemsTotal} brukere.`;
};

const textSelectedPersoner = (amount: number) => {
  return `${amount} markerte brukere.`;
};

export default function PaginationLabel({
  pageInfo,
  numberOfItemsTotal,
  selectedPersoner,
}: Props) {
  return (
    <div className="px-1 py-2 flex justify-between items-center">
      <Label size="small">
        {textPaginatedUsers(pageInfo, numberOfItemsTotal)}
      </Label>
      {selectedPersoner.length > 0 && (
        <Label size="small">
          {textSelectedPersoner(selectedPersoner.length)}
        </Label>
      )}
    </div>
  );
}
