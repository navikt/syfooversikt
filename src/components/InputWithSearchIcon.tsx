import React, { ChangeEvent } from 'react';
import styled from 'styled-components';
import { Input } from 'nav-frontend-skjema';
import SearchIcon from '../img/icons/SearchIcon';
import themes from '../styles/themes';

interface InputWithSearchIconProps {
  autofocus: boolean;
  label: string;
  onChange: (event: ChangeEvent) => void;
  placeholder: string;
  type: string;
  value: string;
}

const InputDiv = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: flex-end;
`;
const InputStyled = styled(Input)`
  margin: 0.5em;
  width: 100%;
  outline: none;
`;

const SearchIconBlue = styled(SearchIcon)`
  fill: ${themes.color.navBla};
  position: absolute;
  right: 1em;
  top: 1.5em;
`;

const InputWithSearchIcon = (props: InputWithSearchIconProps) => {
  const { autofocus, label, onChange, placeholder, type, value } = props;
  return (
    <InputDiv className="inputWithSearchIcon">
      <InputStyled
        className="inputWithSearchIcon__input"
        label={label}
        value={value}
        type={type}
        onChange={(event) => onChange(event)}
        placeholder={placeholder}
        autoFocus={autofocus}
      />

      <SearchIconBlue className="inputWithSearchIcon__icon" />
    </InputDiv>
  );
};

export default InputWithSearchIcon;
