import * as React from 'react';
import { ReactElement } from 'react';
import styled from 'styled-components';
import DropdownButton from './DropdownButton';

export interface DropdownButtonTexts {
  assign: string;
  reset: string;
}

interface DropdownButtonsProps {
  cancelButtonHandler: () => void;
  chosenVeilederIdent: string;
  chooseButtonHandler: (chosenVeilederIdent: string) => void;
  veilederIsChosen: boolean;
  texts: DropdownButtonTexts;
}

const DropdownButtonsDiv = styled.div`
  margin: 2em 0.5em 1em 0.5em;
  display: flex;
  > :nth-child(2) {
    margin-left: 0.5em;
  }
`;

export const DropdownButtons = (props: DropdownButtonsProps): ReactElement => {
  const {
    cancelButtonHandler,
    chosenVeilederIdent,
    chooseButtonHandler,
    texts,
  } = props;

  return (
    <DropdownButtonsDiv className="confirmVeilederButtons">
      <DropdownButton
        classNameElement="choose"
        onClick={() => chooseButtonHandler(chosenVeilederIdent)}
        text={texts.assign}
        type={'standard'}
      />

      <DropdownButton
        classNameElement="close"
        onClick={cancelButtonHandler}
        text={texts.reset}
        type={'flat'}
      />
    </DropdownButtonsDiv>
  );
};
