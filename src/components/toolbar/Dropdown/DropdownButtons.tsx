import * as React from 'react';
import styled from 'styled-components';
import DropdownButton from './DropdownButton';

interface DropdownButtonsProps {
    cancelButtonHandler: () => void;
    chosenVeilederIdent: string;
    chooseButtonHandler: (chosenVeilederIdent: string) => void;
    veilederIsChosen: boolean;
    assignText: string;
}

const texts = {
    reset: 'Nullstill',
};

const DropdownButtonsDiv = styled.div`
  margin: .5em;
  margin-top: 2em;
  display: flex;
  > :nth-child(1) {
    > :nth-child(1) {
      margin-left: 1em;
    }
  }
  > :nth-child(2) {
    > :nth-child(1) {
      margin-left: -2em;
    }
  }
`;

export const DropdownButtons = ((props: DropdownButtonsProps) => {
    const {
        cancelButtonHandler,
        chosenVeilederIdent,
        chooseButtonHandler,
        veilederIsChosen,
        assignText,
    } = props;

    return (<DropdownButtonsDiv className="confirmVeilederButtons">
        <DropdownButton
            classNameElement="choose"
            invisible={!veilederIsChosen}
            onClick={() => chooseButtonHandler(chosenVeilederIdent)}
            text={assignText}
            type={'standard'}/>

        <DropdownButton
            classNameElement="close"
            invisible={false}
            onClick={cancelButtonHandler}
            text={texts.reset}
            type={'flat'}/>
    </DropdownButtonsDiv>);
});
