import React, { ChangeEvent, useEffect, useState } from 'react';
import {
  assignUsersToSelectedVeileder,
  filterVeiledereOnInput,
  hasNoCheckedPersoner,
} from '../../../utils/assignVeilederUtils';
import { sortVeiledereAlphabeticallyWithGivenVeilederFirst } from '../../../utils/veiledereUtils';
import { Veileder } from '../../../store/veiledere/veiledereTypes';
import OpenDropdownButton from '../OpenDropdownButton/OpenDropdownButton';
import { Dropdown } from '../Dropdown/Dropdown';
import { DropdownButtonTexts } from '../Dropdown/DropdownButtons';
import { ToolbarWrapperProps } from '../ToolbarWrapper';

interface StateProps {
  chosenVeilederIdent: string;
  input: string;
  showList: boolean;
  veiledere: Veileder[];
  veilederIsChosen: boolean;
  showError: boolean;
}

const dropdownButtonTexts: DropdownButtonTexts = {
  assign: 'Tildel veileder',
  reset: 'Avbryt',
};

const TildelVeileder = (props: ToolbarWrapperProps) => {
  const stateFromProps = () => ({
    chosenVeilederIdent: '',
    input: '',
    showList: false,
    veiledere: props.veiledere,
    veilederIsChosen: false,
    showError: false,
  });

  const [state, setState] = useState<StateProps>(stateFromProps());

  const inputChangeHandler = (event: ChangeEvent) => {
    const target = event.target as HTMLInputElement;
    setState({
      ...state,
      input: target.value,
    });
  };

  useEffect(() => {
    setState({
      ...state,
      showList: false,
    });
  }, [props.tabType]);

  const radiobuttonOnChangeHandler = (veileder: Veileder) => {
    setState({
      ...state,
      chosenVeilederIdent: veileder.ident,
      veilederIsChosen: true,
      showError: false,
    });
  };

  const assignToOtherVeilederButtonHandler = () => {
    if (!hasNoCheckedPersoner(props.markertePersoner)) {
      if (state.showList) {
        setState({
          ...state,
          chosenVeilederIdent: '',
          input: '',
          showList: false,
          showError: false,
          veilederIsChosen: false,
        });
      } else {
        setState({
          ...state,
          input: '',
          showList: !state.showList,
        });
      }
    }
  };

  const cancelButtonHandler = () => {
    setState({
      ...state,
      chosenVeilederIdent: '',
      input: '',
      showList: false,
      showError: false,
      veilederIsChosen: false,
    });
  };

  const chooseButtonHandler = (chosenVeilederIdent: string) => {
    if (chosenVeilederIdent && chosenVeilederIdent.length > 0) {
      assignUsersToSelectedVeileder(props, chosenVeilederIdent);
      setState({
        ...state,
        showList: false,
        veilederIsChosen: false,
        chosenVeilederIdent: '',
        showError: false,
      });
    } else {
      setState({
        ...state,
        showError: true,
      });
    }
  };

  const onBlur = (e: any) => {
    const currentTarget = e.currentTarget;
    setTimeout(() => {
      if (!currentTarget.contains(document.activeElement)) {
        setState({
          ...state,
          chosenVeilederIdent: '',
          input: '',
          showList: false,
          showError: false,
          veilederIsChosen: false,
        });
      }
    }, 0);
  };

  const lowerCaseInput = state.input.toLowerCase();
  const veiledereSortedAlphabetically = sortVeiledereAlphabeticallyWithGivenVeilederFirst(
    props.veiledere,
    props.aktivVeilederInfo.ident
  );
  const filteredVeiledere = filterVeiledereOnInput(
    veiledereSortedAlphabetically,
    lowerCaseInput
  );

  return (
    <div tabIndex={1} onBlur={onBlur}>
      <OpenDropdownButton
        text={'Tildel veileder'}
        onClick={assignToOtherVeilederButtonHandler}
        showList={state.showList}
        userIsChecked={!hasNoCheckedPersoner(props.markertePersoner)}
        search={false}
      />

      {state.showList && (
        <Dropdown
          buttonTexts={dropdownButtonTexts}
          cancelButtonHandler={cancelButtonHandler}
          chooseButtonHandler={chooseButtonHandler}
          chosenVeilederIdent={state.chosenVeilederIdent}
          filteredVeiledere={filteredVeiledere}
          input={state.input}
          inputChangeHandler={inputChangeHandler}
          buttonChangeHandler={radiobuttonOnChangeHandler}
          veilederIsChosen={state.veilederIsChosen}
          buttonType={'radio'}
          placeholder={'Tildel veileder'}
          selectedVeileders={props.veiledere}
          showNoChosenVeilederError={state.showError}
        />
      )}
    </div>
  );
};

export default TildelVeileder;
