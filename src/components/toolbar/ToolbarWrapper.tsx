import React, { ReactElement, useState } from 'react';
import Toolbar from './Toolbar';
import { Label } from '@navikt/ds-react';
import { SortingType } from '@/hooks/useSorting';

const PAGINATED_NUMBER_OF_ITEMS = 50;

export interface ToolbarWrapperProps {
  alleMarkert: boolean;
  numberOfItemsTotal: number;
  buttonHandler: (veilederIdent: string) => void;
  checkAllHandler: (checked: boolean) => void;
  onPageChange: (startItem: number, endItem: number) => void;
  markertePersoner: string[];
  setSortingType: (sortingType: SortingType) => void;
}

interface PageInfoType {
  firstVisibleIndex: number;
  lastVisibleIndex: number;
}

const textPaginatedUsers = (
  pageInfo: PageInfoType,
  numberOfItemsTotal: number
) => {
  return `Viser ${pageInfo.firstVisibleIndex + 1}-${
    pageInfo.lastVisibleIndex
  } av ${numberOfItemsTotal} brukere.`;
};

const textMarkedUsers = (amount: number) => {
  return `${amount} markerte brukere.`;
};

const ToolbarWrapper = (props: ToolbarWrapperProps): ReactElement => {
  const [pageInfo, setPageInfo] = useState<PageInfoType>({
    firstVisibleIndex: 0,
    lastVisibleIndex: PAGINATED_NUMBER_OF_ITEMS,
  });

  return (
    <>
      <div className="px-1 py-2 flex flex-row gap-1">
        <Label size="small">
          {textPaginatedUsers(pageInfo, props.numberOfItemsTotal)}
        </Label>
        {props.markertePersoner.length > 0 && (
          <Label size="small">
            {textMarkedUsers(props.markertePersoner.length)}
          </Label>
        )}
      </div>
      <Toolbar {...props} setPageInfo={setPageInfo} />
    </>
  );
};

export default ToolbarWrapper;
