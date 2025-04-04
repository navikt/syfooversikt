import React, { ReactElement, useState } from 'react';
import Toolbar from './Toolbar';
import { Label } from '@navikt/ds-react';
import { PAGINATED_NUMBER_OF_ITEMS } from '@/sider/oversikt/sokeresultat/toolbar/PaginationContainer';

export interface ToolbarWrapperProps {
  isAllSelected: boolean;
  numberOfItemsTotal: number;
  checkAllHandler: (checked: boolean) => void;
  onPageChange: (startItem: number, endItem: number) => void;
  selectedPersoner: string[];
  setSelectedPersoner: (personer: string[]) => void;
  setTableActionError: (error: string) => void;
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

const textSelectedPersoner = (amount: number) => {
  return `${amount} markerte brukere.`;
};

export default function ToolbarWrapper(
  props: ToolbarWrapperProps
): ReactElement {
  const [pageInfo, setPageInfo] = useState<PageInfoType>({
    firstVisibleIndex: 0,
    lastVisibleIndex: PAGINATED_NUMBER_OF_ITEMS,
  });

  return (
    <>
      <div className="px-1 py-2 flex justify-between items-center">
        <Label size="small">
          {textPaginatedUsers(pageInfo, props.numberOfItemsTotal)}
        </Label>
        {props.selectedPersoner.length > 0 && (
          <Label size="small">
            {textSelectedPersoner(props.selectedPersoner.length)}
          </Label>
        )}
      </div>
      <Toolbar {...props} setPageInfo={setPageInfo} />
    </>
  );
}
