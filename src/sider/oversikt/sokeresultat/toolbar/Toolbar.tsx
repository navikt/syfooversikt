import TildelVeileder from './TildelVeileder';
import SearchVeileder from './SearchVeileder';
import React, { useRef } from 'react';
import styled from 'styled-components';
import themes from '../../../../styles/themes';
import { ToolbarWrapperProps } from './ToolbarWrapper';
import PaginationContainer from '@/sider/oversikt/sokeresultat/toolbar/PaginationContainer';
import { TabType, useTabType } from '@/hooks/useTabType';
import TildelOppfolgingsenhetModal from '@/sider/oversikt/sokeresultat/toolbar/TildelOppfolgingsenhet/TildelOppfolgingsenhetModal';
import TildelOppfolgingsenhetButton from '@/sider/oversikt/sokeresultat/toolbar/TildelOppfolgingsenhet/TildelOppfolgingsenhetButton';
import { useFeatureToggles } from '@/data/unleash/unleashQueryHooks';

const Innhold = styled.section`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 0.5em;
  border-bottom: 1px solid ${themes.color.navGra40};
`;

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

interface ToolbarProps extends ToolbarWrapperProps {
  setPageInfo: (indices: {
    firstVisibleIndex: number;
    lastVisibleIndex: number;
  }) => void;
}

export default function Toolbar(props: ToolbarProps) {
  const { selectedTab } = useTabType();
  const { toggles } = useFeatureToggles();

  const modalRef = useRef<HTMLDialogElement>(null);

  return (
    <ToolbarStyled>
      <Innhold>
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
          setPageInfo={props.setPageInfo}
        />
      </Innhold>
    </ToolbarStyled>
  );
}
