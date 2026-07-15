import * as React from "react";
import { ReactElement } from "react";
import styled from "styled-components";
import { Button } from "@navikt/ds-react";

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
      <Button
        onClick={() => chooseButtonHandler(chosenVeilederIdent)}
        size="small"
        variant="primary"
      >
        {texts.assign}
      </Button>

      <Button onClick={cancelButtonHandler} size="small" variant="secondary">
        {texts.reset}
      </Button>
    </DropdownButtonsDiv>
  );
};
