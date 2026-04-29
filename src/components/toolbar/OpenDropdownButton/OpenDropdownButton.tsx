import * as React from 'react';
import styled, { css } from 'styled-components';
import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons';
import themes from '../../../styles/themes';
import SearchIcon from '../../../img/icons/SearchIcon';
import { ReactElement } from 'react';

interface ButtonDivProps {
  active: boolean;
}

const SearchIconBlue = styled(SearchIcon)`
  fill: ${themes.color.navBla};
  position: absolute;
  margin-left: -1em;
`;

const ButtonDiv = styled.div<ButtonDivProps>`
  display: flex;
  cursor: pointer;
  align-items: center;
  justify-content: flex-start;
  height: 100%;
  border: 1px solid ${themes.color.darkGrayish};
  border-radius: 4px;
  ${({ active }) =>
    active &&
    css`
      &:hover {
        text-decoration: underline;
      }
      & > * {
        color: ${themes.color.navBla};
      }
    `}
`;

const DropdownButtonButton = styled.button`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5em;

  padding: 0.5em 1em;
  margin: 0;
  width: 100%;
  background: none;
  cursor: pointer;
  border: none;

  svg {
    width: 1.5em;
    height: 1.5em;
  }

  &::after {
    background-image: 1;
  }
`;

const SearchIconWrapper = styled.span`
  padding: 1em;
`;

interface AssignToVeilederButtonProps {
  text: string;
  active: boolean;
  onClick: () => void;
  showList: boolean;
  search: boolean;
}

export const OpenDropdownButton = (
  props: AssignToVeilederButtonProps
): ReactElement => {
  return (
    <ButtonDiv className="openDropdownButton" active={props.active}>
      <DropdownButtonButton
        className="openDropdownButton__button"
        onClick={props.onClick}
      >
        {props.search && (
          <SearchIconWrapper>
            <SearchIconBlue className="inputWithSearchIcon__icon" />
          </SearchIconWrapper>
        )}
        {props.text}
        {props.showList ? (
          <ChevronUpIcon className="openDropdownButton__chevron" aria-hidden />
        ) : (
          <ChevronDownIcon
            className="openDropdownButton__chevron"
            aria-hidden
          />
        )}
      </DropdownButtonButton>
    </ButtonDiv>
  );
};
