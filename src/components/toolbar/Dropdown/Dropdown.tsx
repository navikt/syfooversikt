import React, { ChangeEvent, ReactElement } from "react";
import styled from "styled-components";
import InputWithSearchIcon from "../../InputWithSearchIcon";
import { VeilederInputButtons } from "./VeilederInputButtons";
import { DropdownButtons, DropdownButtonTexts } from "./DropdownButtons";
import { VeilederDTO } from "@/api/types/veiledereTypes";

interface Props {
  buttonTexts: DropdownButtonTexts;
  cancelButtonHandler: () => void;
  chooseButtonHandler: (chosenVeilederIdent: string) => void;
  chosenVeilederIdent: string;
  filteredVeiledere: VeilederDTO[];
  input: string;
  inputChangeHandler: (event: ChangeEvent) => void;
  buttonChangeHandler: (veilederident: string) => void;
  veilederIsChosen: boolean;
  showNoChosenVeilederError: boolean;
  placeholder: string;
}

const ButtonPanelGroup = styled.div`
  padding: 0.5em;
  border: 0;
  overflow: auto;
  height: 20em;
  width: calc(100% - 0.5em);
`;

const DropdownPanel = styled.section`
  padding: 0 !important;
  border: 1px solid gray;
  position: absolute;
  background: white;
  width: 25em;
  height: auto;
  z-index: 1;
`;

const texts = {
  noChosenVeilederError: "Du må velge en veileder for å kunne tildele. ",
};

const NoVeilederChosenErrorMessage = styled.p`
  color: red;
  margin: 0 0 1em 0.5em;
  font-weight: bold;
`;

export default function Dropdown(props: Props): ReactElement {
  const {
    buttonTexts,
    cancelButtonHandler,
    chooseButtonHandler,
    chosenVeilederIdent,
    filteredVeiledere,
    input,
    inputChangeHandler,
    buttonChangeHandler,
    veilederIsChosen,
    showNoChosenVeilederError,
    placeholder,
  } = props;

  return (
    <DropdownPanel>
      <InputWithSearchIcon
        autofocus
        label="Tildel veileder"
        onChange={inputChangeHandler}
        placeholder={placeholder}
        value={input}
      />

      <ButtonPanelGroup>
        <VeilederInputButtons
          onChangeHandler={buttonChangeHandler}
          filteredVeiledere={filteredVeiledere}
          chosenVeilederIdent={chosenVeilederIdent}
          isInputGiven={input.length > 0}
        />
      </ButtonPanelGroup>

      <DropdownButtons
        cancelButtonHandler={cancelButtonHandler}
        chosenVeilederIdent={chosenVeilederIdent}
        chooseButtonHandler={chooseButtonHandler}
        veilederIsChosen={veilederIsChosen}
        texts={buttonTexts}
      />

      {showNoChosenVeilederError && (
        <NoVeilederChosenErrorMessage>
          {texts.noChosenVeilederError}
        </NoVeilederChosenErrorMessage>
      )}
    </DropdownPanel>
  );
}
