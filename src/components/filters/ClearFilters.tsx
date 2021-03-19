import React from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { resetAllFilters } from '../../store/filters/filter_actions';
import themes from '../../styles/themes';
import SlettIkon from '../common/SlettIkon';

const ClearFiltersWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  box-sizing: border-box;
  border: 2px solid transparent;
  border-radius: 2px;
  color: ${themes.color.navBla};
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

export default (props: any) => {
  const dispatch = useDispatch();

  const clearAllFilters = () => {
    dispatch(resetAllFilters());
  };

  return (
    <div className={props.className}>
      <ClearFiltersWrapper onClick={clearAllFilters}>
        <SlettIkon fargeKode={themes.color.navBla} />
        Nullstill valg
      </ClearFiltersWrapper>
    </div>
  );
};
