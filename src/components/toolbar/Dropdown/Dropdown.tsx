import React, { ChangeEvent, ReactElement } from 'react';
import styled from 'styled-components';
import InputWithSearchIcon from '../../InputWithSearchIcon';
import { VeilederInputButtons } from './VeilederInputButtons';
import { isInputGiven } from '@/utils/assignVeilederUtils';
import { DropdownButtons, DropdownButtonTexts } from './DropdownButtons';
import { VeilederDTO } from '@/api/types/veiledereTypes';

interface DropdownProps {
  buttonTexts: DropdownButtonTexts;
  cancelButtonHandler: () => void;
  chooseButtonHandler: (chosenVeilederIdent: string) => void;
  chosenVeilederIdent: string;
  filteredVeiledere: VeilederDTO[];
  input: string;
  inputChangeHandler: (event: ChangeEvent) => void;
  buttonChangeHandler: (veileder: VeilederDTO) => void;
  veilederIsChosen: boolean;
  selectedVeileders: VeilederDTO[];
  showNoChosenVeilederError: boolean;
  placeholder: string;
  buttonType: string;
}

const ButtonPanelGroup = styled.div`
  margin: 0.5em;
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
  noChosenVeilederError: 'Du må velge en veileder for å kunne tildele. ',
};

const NoVeilederChosenErrorMessage = styled.p`
  color: red;
  margin: 0 0 1em 0.5em;
  font-weight: bold;
`;

export const Dropdown = (props: DropdownProps): ReactElement => {
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
    selectedVeileders,
    showNoChosenVeilederError,
    placeholder,
    buttonType,
  } = props;

  return (
    <DropdownPanel className="tildelVeileder__dropdownPanel">
      <InputWithSearchIcon
        autofocus
        label=""
        onChange={inputChangeHandler}
        placeholder={placeholder}
        type={'text'}
        value={input}
      />

      <ButtonPanelGroup className="radioPanelGroup">
        <VeilederInputButtons
          onChangeHandler={buttonChangeHandler}
          filteredVeiledere={filteredVeiledere}
          selectedVeileders={selectedVeileders}
          isInputGiven={isInputGiven(input)}
          buttonType={buttonType}
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
};
