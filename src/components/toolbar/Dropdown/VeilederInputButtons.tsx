import * as React from 'react';
import styled from 'styled-components';
import { Checkbox, Radio } from 'nav-frontend-skjema';
import { Veileder } from '@/store/veiledere/veiledereTypes';
import { ReactElement } from 'react';

interface VeilederCheckboxProps {
  onChangeHandler: (veileder: Veileder) => void;
  filteredVeiledere: Veileder[];
  selectedVeileders: Veileder[];
  isInputGiven: boolean;
  buttonType: string;
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

const StyledCheckbox = styled(Checkbox)`
  width: calc(100% - 1em);
  margin-bottom: 0.5em;
`;

const InputButtons = (props: VeilederCheckboxProps) => {
  const { onChangeHandler, filteredVeiledere, selectedVeileders } = props;

  function getVeilederIdentification(veileder: Veileder): string {
    return veileder.fornavn === ''
      ? veileder.ident
      : `${veileder.etternavn}, ${veileder.fornavn}`;
  }

  return (
    <React.Fragment>
      {filteredVeiledere.map((veileder: Veileder, index: number) =>
        props.buttonType === 'radio' ? (
          <StyledRadio
            key={JSON.stringify({ ...veileder, index })}
            label={getVeilederIdentification(veileder)}
            name="veiledereRadioButton"
            onChange={() => onChangeHandler(veileder)}
          />
        ) : (
          <StyledCheckbox
            key={JSON.stringify({ ...veileder, index })}
            label={getVeilederIdentification(veileder)}
            name="veiledereCheckbox"
            onChange={() => onChangeHandler(veileder)}
            checked={
              !!selectedVeileders.find((v) => veileder.ident === v.ident)
            }
          />
        )
      )}
    </React.Fragment>
  );
};

export const VeilederInputButtons = (
  props: VeilederCheckboxProps
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
