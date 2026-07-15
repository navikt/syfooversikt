import * as React from "react";
import { ReactElement } from "react";
import styled from "styled-components";
import { VeilederDTO } from "@/api/types/veiledereTypes";
import { Radio, RadioGroup } from "@navikt/ds-react";

interface VeilederCheckboxProps {
  onChangeHandler: (veilederident: string) => void;
  filteredVeiledere: VeilederDTO[];
  chosenVeilederIdent: string;
  isInputGiven: boolean;
}

const LoggedInVeilederFirst = styled.div`
  & > *:first-child {
    padding-bottom: 0.5em;
    border-bottom: 1px dotted gray;
  }
`;

const StyledRadio = styled(Radio)`
  width: calc(100% - 1em);
  margin-bottom: 0.5em;
`;

const InputButtons = (props: VeilederCheckboxProps) => {
  const { onChangeHandler, filteredVeiledere, chosenVeilederIdent } = props;

  const getVeilederIdentification = (veileder: VeilederDTO): string => {
    return veileder.fornavn === ""
      ? veileder.ident
      : `${veileder.etternavn}, ${veileder.fornavn}`;
  };

  return (
    <RadioGroup
      legend="Velg veileder."
      onChange={(veileder: string) => onChangeHandler(veileder)}
      value={chosenVeilederIdent}
    >
      {filteredVeiledere.map((veileder: VeilederDTO, index: number) => (
        <StyledRadio
          key={JSON.stringify({ ...veileder, index })}
          name="veiledereRadioButton"
          size={"small"}
          value={veileder.ident}
        >
          {getVeilederIdentification(veileder)}
        </StyledRadio>
      ))}
    </RadioGroup>
  );
};

export const VeilederInputButtons = (
  props: VeilederCheckboxProps,
): ReactElement => {
  if (props.isInputGiven) {
    return <InputButtons {...props} />;
  }
  return (
    <LoggedInVeilederFirst>
      <InputButtons {...props} />
    </LoggedInVeilederFirst>
  );
};
