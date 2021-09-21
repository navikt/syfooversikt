import React, { ReactElement } from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { useFilters } from '@/context/filters/FilterContext';
import { ActionType } from '@/context/filters/filterContextActions';
import { trackOnClick } from '@/amplitude/amplitude';

const tekster = {
  enhetensOversikt: 'Enhetens oversikt',
  minOversikt: 'Min oversikt',
};

const LinkStyled = styled(NavLink)`
  padding: 0;
  background-color: transparent;
  border: none;
  font-weight: 600;
  font-size: 20px;
  cursor: pointer;
  color: black;
  border-bottom: 0.1em transparent solid;
  border-bottom-color: transparent;
  text-decoration: none;

  &.active {
    border-bottom-color: #0c5ea8;
  }

  &:visited {
    color: black;
  }

  &:focus {
    outline: none;
  }

  &:hover {
    border-bottom-color: #0c5ea8;
  }
`;

const NavigationBarDiv = styled.div`
  background: white;
  width: 100%;
  margin: auto;
  margin-bottom: 1em;
`;

const NavigationBarContent = styled.div`
  width: calc(100% - 10%);
  margin: auto;
  padding-top: 1em;
  padding-bottom: 1em;
  display: flex;
  > :not(:last-child) {
    margin-right: 1em;
  }
`;

export const NavigationBar = (): ReactElement => {
  const { dispatch } = useFilters();

  return (
    <NavigationBarDiv>
      <NavigationBarContent>
        <LinkStyled
          activeClassName="active"
          to={'/minoversikt'}
          onClick={() => {
            trackOnClick(tekster.minOversikt);
            dispatch({
              type: ActionType.ResetFilters,
            });
          }}
        >
          {tekster.minOversikt}
        </LinkStyled>
        <LinkStyled
          activeClassName="active"
          to={'/enhet'}
          onClick={() => {
            trackOnClick(tekster.enhetensOversikt);
            dispatch({
              type: ActionType.ResetFilters,
            });
          }}
        >
          {tekster.enhetensOversikt}
        </LinkStyled>
      </NavigationBarContent>
    </NavigationBarDiv>
  );
};
