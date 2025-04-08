import TildelVeileder from './TildelVeileder';
import SearchVeileder from './SearchVeileder';
import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import themes from '../../../../styles/themes';
import PaginationContainer, {
  PAGINATED_NUMBER_OF_ITEMS,
} from '@/sider/oversikt/sokeresultat/toolbar/PaginationContainer';
import { TabType, useTabType } from '@/hooks/useTabType';
import TildelOppfolgingsenhetModal from '@/sider/oversikt/sokeresultat/toolbar/TildelOppfolgingsenhet/TildelOppfolgingsenhetModal';
import TildelOppfolgingsenhetButton from '@/sider/oversikt/sokeresultat/toolbar/TildelOppfolgingsenhet/TildelOppfolgingsenhetButton';
import { useFeatureToggles } from '@/data/unleash/unleashQueryHooks';
import PaginationLabel from '@/sider/oversikt/sokeresultat/toolbar/TildelOppfolgingsenhet/PaginationLabel';

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

export interface Props {
  isAllSelected: boolean;
  numberOfItemsTotal: number;
  checkAllHandler: (checked: boolean) => void;
  onPageChange: (startItem: number, endItem: number) => void;
  selectedPersoner: string[];
  setSelectedPersoner: (personer: string[]) => void;
  setTableActionError: (error: string) => void;
}

export interface PageInfoType {
  firstVisibleIndex: number;
  lastVisibleIndex: number;
}

export default function Toolbar(props: Props) {
  const { selectedTab } = useTabType();
  const { toggles } = useFeatureToggles();
  const [pageInfo, setPageInfo] = useState<PageInfoType>({
    firstVisibleIndex: 0,
    lastVisibleIndex: PAGINATED_NUMBER_OF_ITEMS,
  });
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
            {selectedTab === TabType.ENHETENS_OVERSIKT && <SearchVeileder />}
            {toggles.isTildelOppfolgingsenhetEnabled && (
              <TildelOppfolgingsenhetButton
                modalRef={modalRef}
                selectedPersoner={props.selectedPersoner}
                setTableActionError={props.setTableActionError}
              />
            )}
            {toggles.isTildelOppfolgingsenhetEnabled && (
              <TildelOppfolgingsenhetModal
                ref={modalRef}
                selectedPersoner={props.selectedPersoner}
                setSelectedPersoner={props.setSelectedPersoner}
              />
            )}
          </div>
          <PaginationContainer
            numberOfItemsTotal={props.numberOfItemsTotal}
            onPageChange={props.onPageChange}
            setPageInfo={setPageInfo}
          />
        </section>
      </ToolbarStyled>
    </>
  );
}
