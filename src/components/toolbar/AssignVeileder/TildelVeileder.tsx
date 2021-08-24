import React, { ChangeEvent, ReactElement, useEffect, useState } from 'react';
import {
  assignUsersToSelectedVeileder,
  filterVeiledereOnInput,
  hasNoCheckedPersoner,
} from '@/utils/assignVeilederUtils';
import { sortVeiledereAlphabeticallyWithGivenVeilederFirst } from '@/utils/veiledereUtils';
import { Veileder } from '@/api/types/veiledereTypes';
import OpenDropdownButton from '../OpenDropdownButton/OpenDropdownButton';
import { Dropdown } from '../Dropdown/Dropdown';
import { DropdownButtonTexts } from '../Dropdown/DropdownButtons';
import { ToolbarWrapperProps } from '../ToolbarWrapper';
import { useVeiledereQuery } from '@/react-query/veiledereQueryHooks';
import { useTabType } from '@/context/tab/TabTypeContext';

const dropdownButtonTexts: DropdownButtonTexts = {
  assign: 'Tildel veileder',
  reset: 'Avbryt',
};

const TildelVeileder = (props: ToolbarWrapperProps): ReactElement => {
  const veiledereQuery = useVeiledereQuery();

  const [chosenVeilederIdent, setChosenVeilederIdent] = useState('');
  const [input, setInput] = useState('');
  const [showList, setShowList] = useState(false);
  const [veilederIsChosen, setVeilederIsChosen] = useState(false);
  const [showError, setShowError] = useState(false);
  const { tabType } = useTabType();

  useEffect(() => {
    setShowList(false);
  }, [tabType]);

  const resetStateToDefault = () => {
    setChosenVeilederIdent('');
    setInput('');
    setShowList(false);
    setShowError(false);
    setVeilederIsChosen(false);
  };

  const inputChangeHandler = (event: ChangeEvent) => {
    const target = event.target as HTMLInputElement;
    setInput(target.value);
  };

  const radiobuttonOnChangeHandler = (veileder: Veileder) => {
    setChosenVeilederIdent(veileder.ident);
    setVeilederIsChosen(true);
    setShowError(false);
  };

  const assignToOtherVeilederButtonHandler = () => {
    if (props.markertePersoner.length > 0) {
      if (showList) {
        resetStateToDefault();
      } else {
        setInput('');
        setShowList(!showList);
      }
    }
  };

  const chooseButtonHandler = (chosenVeilederIdent: string) => {
    if (chosenVeilederIdent && chosenVeilederIdent.length > 0) {
      assignUsersToSelectedVeileder(props, chosenVeilederIdent);
      setShowList(false);
      setVeilederIsChosen(false);
      setShowError(false);
      setChosenVeilederIdent('');
    } else {
      setShowError(true);
    }
  };

  const onBlur = (e: any) => {
    const currentTarget = e.currentTarget;
    setTimeout(() => {
      if (!currentTarget.contains(document.activeElement)) {
        resetStateToDefault();
      }
    }, 0);
  };

  const lowerCaseInput = input.toLowerCase();

  const veiledereSortedAlphabetically = sortVeiledereAlphabeticallyWithGivenVeilederFirst(
    veiledereQuery?.data || [],
    props.aktivVeilederInfo?.ident || ''
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
        showList={showList}
        userIsChecked={!hasNoCheckedPersoner(props.markertePersoner)}
        search={false}
      />

      {showList && (
        <Dropdown
          buttonTexts={dropdownButtonTexts}
          cancelButtonHandler={resetStateToDefault}
          chooseButtonHandler={chooseButtonHandler}
          chosenVeilederIdent={chosenVeilederIdent}
          filteredVeiledere={filteredVeiledere}
          input={input}
          inputChangeHandler={inputChangeHandler}
          buttonChangeHandler={radiobuttonOnChangeHandler}
          veilederIsChosen={veilederIsChosen}
          buttonType={'radio'}
          placeholder={'Tildel veileder'}
          selectedVeileders={veiledereQuery.data || []}
          showNoChosenVeilederError={showError}
        />
      )}
    </div>
  );
};

export default TildelVeileder;
