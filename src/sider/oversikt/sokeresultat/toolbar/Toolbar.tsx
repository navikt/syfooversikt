import TildelVeileder from './TildelVeileder';
import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import themes from '../../../../styles/themes';
import PaginationContainer, {
  PAGINATED_NUMBER_OF_ITEMS,
} from '@/sider/oversikt/sokeresultat/toolbar/PaginationContainer';
import TildelOppfolgingsenhetModal from '@/sider/oversikt/sokeresultat/toolbar/TildelOppfolgingsenhet/TildelOppfolgingsenhetModal';
import TildelOppfolgingsenhetButton from '@/sider/oversikt/sokeresultat/toolbar/TildelOppfolgingsenhet/TildelOppfolgingsenhetButton';
import { useGetFeatureToggles } from '@/data/unleash/unleashQueryHooks';
import PaginationLabel from '@/sider/oversikt/sokeresultat/toolbar/TildelOppfolgingsenhet/PaginationLabel';
import { Alert } from '@navikt/ds-react';

const ToolbarStyled = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${themes.color.white};
  position: sticky;
  top: 0;
  z-index: 2;
  border-radius: 4px;
  border: 1px solid ${themes.color.navGra20};
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
`;

export interface FeedbackNotification {
  type: 'success' | 'warning' | 'error';
  text: string;
}

export interface Props {
  isAllSelected: boolean;
  numberOfItemsTotal: number;
  checkAllHandler: (checked: boolean) => void;
  onPageChange: (startItem: number, endItem: number) => void;
  selectedPersoner: string[];
  setSelectedPersoner: (personer: string[]) => void;
}

export interface PageInfoType {
  firstVisibleIndex: number;
  lastVisibleIndex: number;
}

export default function Toolbar(props: Props) {
  const { toggles } = useGetFeatureToggles();
  const [pageInfo, setPageInfo] = useState<PageInfoType>({
    firstVisibleIndex: 0,
    lastVisibleIndex: PAGINATED_NUMBER_OF_ITEMS,
  });
  const [tableFeedbackNotification, setTableFeedbackNotification] = useState<
    FeedbackNotification | undefined
  >();
  const modalRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <PaginationLabel
        pageInfo={pageInfo}
        numberOfItemsTotal={props.numberOfItemsTotal}
        selectedPersoner={props.selectedPersoner}
      />
      <ToolbarStyled>
        <section className="flex flex-row items-center justify-between">
          <div className="flex items-center p-2 gap-2">
            <TildelVeileder
              selectedPersoner={props.selectedPersoner}
              handleSelectAll={props.checkAllHandler}
            />
            {toggles.isTildelOppfolgingsenhetEnabled && (
              <TildelOppfolgingsenhetButton
                modalRef={modalRef}
                selectedPersoner={props.selectedPersoner}
                setTableFeedbackNotification={setTableFeedbackNotification}
              />
            )}
            {toggles.isTildelOppfolgingsenhetEnabled && (
              <TildelOppfolgingsenhetModal
                ref={modalRef}
                selectedPersoner={props.selectedPersoner}
                setSelectedPersoner={props.setSelectedPersoner}
                setTableFeedbackNotification={setTableFeedbackNotification}
              />
            )}
          </div>
          <PaginationContainer
            numberOfItemsTotal={props.numberOfItemsTotal}
            onPageChange={props.onPageChange}
            setPageInfo={setPageInfo}
          />
        </section>
        {!!tableFeedbackNotification && (
          <Alert
            variant={tableFeedbackNotification.type}
            size="small"
            className="m-1"
          >
            {tableFeedbackNotification.text}
          </Alert>
        )}
      </ToolbarStyled>
    </>
  );
}
