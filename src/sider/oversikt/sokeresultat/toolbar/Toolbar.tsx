import TildelVeileder from './TildelVeileder';
import SearchVeileder from './SearchVeileder';
import React from 'react';
import styled from 'styled-components';
import themes from '../../../../styles/themes';
import { ToolbarWrapperProps } from './ToolbarWrapper';
import PaginationContainer from '@/sider/oversikt/sokeresultat/toolbar/PaginationContainer';
import { TabType, useTabType } from '@/hooks/useTabType';

const Innhold = styled.section`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 0.5em;
  border-bottom: 1px solid ${themes.color.navGra40};
`;

const Element = styled.div`
  display: flex;
  align-items: center;

  & > div:not(:nth-child(2)) {
    padding: 0.5em;
  }
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

const Toolbar = (props: ToolbarProps) => {
  const { selectedTab } = useTabType();

  return (
    <ToolbarStyled>
      <Innhold>
        <Element>
          <TildelVeileder
            selectedPersoner={props.markertePersoner}
            handleTildelVeileder={props.buttonHandler}
            handleSelectAll={props.checkAllHandler}
          />
          {selectedTab === TabType.ENHETENS_OVERSIKT && <SearchVeileder />}
        </Element>
        <PaginationContainer
          numberOfItemsTotal={props.numberOfItemsTotal}
          onPageChange={props.onPageChange}
          setPageInfo={props.setPageInfo}
        />
      </Innhold>
    </ToolbarStyled>
  );
};

export default Toolbar;
