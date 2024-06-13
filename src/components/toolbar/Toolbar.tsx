import TildelVeileder from './AssignVeileder/TildelVeileder';
import { OverviewTabType } from '@/konstanter';
import SearchVeileder from './SearchVeileder/SearchVeileder';
import { Column, Row } from 'nav-frontend-grid';
import Sorteringsrad from '../Sorteringsrad';
import React from 'react';
import styled from 'styled-components';
import themes from '../../styles/themes';
import { Checkbox } from 'nav-frontend-skjema';
import { ToolbarWrapperProps } from './ToolbarWrapper';
import { useTabType } from '@/context/tab/TabTypeContext';
import { useFeatureToggles } from '@/data/unleash/unleashQueryHooks';
import PaginationContainer from '@/components/toolbar/PaginationContainer';

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

const VelgBoks = styled(Checkbox)`
  > .skjemaelement {
    margin: 0;
    padding: 0;
  }

  margin: 0;
  margin-left: 0.5em;
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

const tekster = {
  selectAll: 'Velg alle',
};

interface ToolbarProps extends ToolbarWrapperProps {
  setPageInfo: (indices: {
    firstVisibleIndex: number;
    lastVisibleIndex: number;
  }) => void;
}

const Toolbar = (props: ToolbarProps) => {
  const { toggles } = useFeatureToggles();
  const { tabType } = useTabType();

  return (
    <ToolbarStyled>
      <Innhold>
        <Element>
          <TildelVeileder
            selectedPersoner={props.markertePersoner}
            handleTildelVeileder={props.buttonHandler}
            handleSelectAll={props.checkAllHandler}
          />
          {tabType === OverviewTabType.ENHET_OVERVIEW && <SearchVeileder />}
        </Element>
        <PaginationContainer
          numberOfItemsTotal={props.numberOfItemsTotal}
          onPageChange={props.onPageChange}
          setPageInfo={props.setPageInfo}
        />
      </Innhold>
      {!toggles.isAkselOversiktEnabled && (
        <Row className="flex ml-0 mr-0 items-center">
          <Column xs="1">
            <VelgBoks
              className="toolbar__velgBoks"
              aria-label={tekster.selectAll}
              label="&nbsp;"
              checked={props.alleMarkert}
              onChange={(event) => {
                props.checkAllHandler(event.target.checked);
              }}
            />
          </Column>
          <Sorteringsrad
            onSortClick={(type) => {
              props.setSortingType(type);
            }}
          />
          <Column xs={'1'} />
        </Row>
      )}
    </ToolbarStyled>
  );
};

export default Toolbar;
