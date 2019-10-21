import React, { ChangeEvent } from 'react';
import styled from 'styled-components';
import InputWithSearchIcon from '../../InputWithSearchIcon';
import { VeilederInputButtons } from './VeilederInputButtons';
import { isInputGiven } from '../../../utils/assignVeilederUtils';
import { DropdownButtons } from './DropdownButtons';
import { Veileder } from '../../../store/veiledere/veiledereTypes';

interface DropdownProps {
    cancelButtonHandler: () => void;
    chooseButtonHandler: (chosenVeilederIdent: string) => void;
    chosenVeilederIdent: string;
    filteredVeiledere: Veileder[];
    input: string;
    inputChangeHandler: (event: ChangeEvent) => void;
    buttonChangeHandler: (veileder: Veileder) => void;
    veilederIsChosen: boolean;
    selectedVeileders: Veileder[];
    placeholder: string;
    buttonType: string;
}

const ButtonPanelGroup = styled.div`
  margin: .5em;
  border: 0;
  overflow: auto;
  height: 20em;
  width: calc(100% - .5em);
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
    buttonText: 'Lagre',
};

export const Dropdown = (props: DropdownProps) => {
    const {
        cancelButtonHandler,
        chooseButtonHandler,
        chosenVeilederIdent,
        filteredVeiledere,
        input,
        inputChangeHandler,
        buttonChangeHandler,
        veilederIsChosen,
        selectedVeileders,
        placeholder,
        buttonType,
    } = props;

    return (<DropdownPanel className="tildelVeileder__dropdownPanel">
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
                buttonType={buttonType}/>
        </ButtonPanelGroup>

        <DropdownButtons
            cancelButtonHandler={cancelButtonHandler}
            chosenVeilederIdent={chosenVeilederIdent}
            chooseButtonHandler={chooseButtonHandler}
            veilederIsChosen={veilederIsChosen}
            assignText={texts.buttonText}/>
    </DropdownPanel>);
};
