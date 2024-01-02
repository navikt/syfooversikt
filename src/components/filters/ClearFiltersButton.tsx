import React, { ReactElement } from 'react';
import styled from 'styled-components';
import themes from '@/styles/themes';
import SlettIkon from '@/components/common/SlettIkon';
import { useFilters } from '@/context/filters/FilterContext';
import { ActionType } from '@/context/filters/filterContextActions';

const texts = {
  nullstill: 'Nullstill valg',
};

const ClearFiltersWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  box-sizing: border-box;
  border: 2px solid transparent;
  justify-content: flex-end;
  border-radius: 2px;
  color: ${themes.color.navBla};
  margin-bottom: 0.5em;
  font-size: 1em;
  font-weight: 500;
  padding: 0.25em;
  -webkit-user-select: none;
  user-select: none;
  :hover {
    cursor: pointer;
  }
  :active {
    border: 2px solid ${themes.color.navBla};
  }
  > svg {
    margin-right: 0.25em;
  }
`;

export const ClearFiltersButton = (): ReactElement => {
  const { dispatch: dispatchFilterAction } = useFilters();

  return (
    <ClearFiltersWrapper
      onClick={() => {
        dispatchFilterAction({
          type: ActionType.ResetFilters,
        });
      }}
    >
      <SlettIkon fargeKode={themes.color.navBla} />
      {texts.nullstill}
    </ClearFiltersWrapper>
  );
};
