import React, { ReactElement, useState } from 'react';
import styled from 'styled-components';
import Toolbar from './Toolbar';

const PAGINATED_NUMBER_OF_ITEMS = 50;

export interface ToolbarWrapperProps {
  alleMarkert: boolean;
  numberOfItemsTotal: number;
  buttonHandler: (veilederIdent: string) => void;
  checkAllHandler: (checked: boolean) => void;
  onPageChange: (startItem: number, endItem: number) => void;
  markertePersoner: string[];
}

const InfoText = styled.div`
  display: flex;
  flex-direction: row;
  font-size: 1em;
  font-weight: bold;
  padding: 0.25em;
  padding-bottom: 0.5em;
  box-sizing: border-box;
  border: 2px solid transparent;
  > :not(:first-child) {
    margin-left: 0.5em;
  }
`;

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
      <InfoText>
        <div>{textPaginatedUsers(pageInfo, props.numberOfItemsTotal)}</div>
        {props.markertePersoner.length > 0 && (
          <div>{textMarkedUsers(props.markertePersoner.length)}</div>
        )}
      </InfoText>
      <Toolbar {...props} setPageInfo={setPageInfo} />
    </>
  );
};

export default ToolbarWrapper;
