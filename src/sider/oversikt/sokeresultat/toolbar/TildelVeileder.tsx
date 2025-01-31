import React, { ChangeEvent, ReactElement, useEffect, useState } from 'react';
import { filterVeiledereOnInput } from '@/utils/assignVeilederUtils';
import { sortVeiledereAlphabeticallyWithGivenVeilederFirst } from '@/utils/veiledereUtils';
import { VeilederDTO } from '@/api/types/veiledereTypes';
import OpenDropdownButton from '../../../../components/toolbar/OpenDropdownButton/OpenDropdownButton';
import { Dropdown } from '@/components/toolbar/Dropdown/Dropdown';
import { DropdownButtonTexts } from '@/components/toolbar/Dropdown/DropdownButtons';
import {
  useAktivVeilederQuery,
  useVeiledereQuery,
} from '@/data/veiledereQueryHooks';
import { useTabType } from '@/hooks/useTabType';

const dropdownButtonTexts: DropdownButtonTexts = {
  assign: 'Tildel veileder',
  reset: 'Avbryt',
};

interface Props {
  selectedPersoner: string[];
  handleSelectAll: (checked: boolean) => void;
  handleTildelVeileder: (veilederIdent: string) => void;
}

const TildelVeileder = ({
  selectedPersoner,
  handleTildelVeileder,
  handleSelectAll,
}: Props): ReactElement => {
  const veiledereQuery = useVeiledereQuery();
  const aktivVeilederQuery = useAktivVeilederQuery();

  const [chosenVeilederIdent, setChosenVeilederIdent] = useState('');
  const [input, setInput] = useState('');
  const [showList, setShowList] = useState(false);
  const [veilederIsChosen, setVeilederIsChosen] = useState(false);
  const [showError, setShowError] = useState(false);
  const { selectedTab } = useTabType();

  useEffect(() => {
    setShowList(false);
  }, [selectedTab]);

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

  const radiobuttonOnChangeHandler = (veileder: VeilederDTO) => {
    setChosenVeilederIdent(veileder.ident);
    setVeilederIsChosen(true);
    setShowError(false);
  };

  const assignToOtherVeilederButtonHandler = () => {
    if (selectedPersoner.length > 0) {
      if (showList) {
        resetStateToDefault();
      } else {
        setInput('');
        setShowList(!showList);
      }
    }
  };

  const assignUsersToSelectedVeileder = (): void => {
    if (chosenVeilederIdent && chosenVeilederIdent.length > 0) {
      handleTildelVeileder(chosenVeilederIdent);
    }
    handleSelectAll(false);
  };

  const chooseButtonHandler = (chosenVeilederIdent: string) => {
    if (chosenVeilederIdent && chosenVeilederIdent.length > 0) {
      assignUsersToSelectedVeileder();
      setShowList(false);
      setVeilederIsChosen(false);
      setShowError(false);
      setChosenVeilederIdent('');
    } else {
      setShowError(true);
    }
  };

  const onBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    const currentTarget = e.currentTarget;
    setTimeout(() => {
      if (!currentTarget.contains(document.activeElement)) {
        resetStateToDefault();
      }
    }, 0);
  };

  const lowerCaseInput = input.toLowerCase();

  const veiledere = veiledereQuery.data?.filter((value) => value.enabled) || [];
  const veiledereSortedAlphabetically = sortVeiledereAlphabeticallyWithGivenVeilederFirst(
    veiledere,
    aktivVeilederQuery.data?.ident || ''
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
        active={selectedPersoner.length > 0}
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
          selectedVeileders={veiledere}
          showNoChosenVeilederError={showError}
        />
      )}
    </div>
  );
};

export default TildelVeileder;
