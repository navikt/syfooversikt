import React, { ChangeEvent, ReactElement } from "react";
import styled from "styled-components";
import SearchIcon from "../img/icons/SearchIcon";
import themes from "../styles/themes";
import { TextField } from "@navikt/ds-react";

interface InputWithSearchIconProps {
  autofocus: boolean;
  label: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  value: string;
}

const InputDiv = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: flex-end;
  padding: 0.5em;
`;

const InputStyled = styled(TextField)`
  width: 100%;
  outline: none;
`;

const SearchIconBlue = styled(SearchIcon)`
  fill: ${themes.color.navBla};
  position: absolute;
  padding: 0.125em;
  right: 1em;
`;

const InputWithSearchIcon = (props: InputWithSearchIconProps): ReactElement => {
  const { autofocus, label, onChange, placeholder, value } = props;
  return (
    <InputDiv className="inputWithSearchIcon">
      <InputStyled
        className="inputWithSearchIcon__input"
        label={label}
        hideLabel={true}
        value={value}
        size="small"
        onChange={(event) => onChange(event)}
        placeholder={placeholder}
        autoFocus={autofocus}
      />

      <SearchIconBlue />
    </InputDiv>
  );
};

export default InputWithSearchIcon;
