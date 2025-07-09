import React, { ChangeEvent, ReactElement, useEffect, useState } from 'react';
import { filterVeiledereOnInput } from '@/utils/assignVeilederUtils';
import { sortVeiledereBySurnameAsc } from '@/utils/veiledereUtils';
import { VeilederDTO } from '@/api/types/veiledereTypes';
import OpenDropdownButton from '../../../../components/toolbar/OpenDropdownButton/OpenDropdownButton';
import { Dropdown } from '@/components/toolbar/Dropdown/Dropdown';
import { DropdownButtonTexts } from '@/components/toolbar/Dropdown/DropdownButtons';
import {
  useAktivVeilederQuery,
  useTildelVeileder,
  useVeiledereQuery,
} from '@/data/veiledereQueryHooks';
import { useTabType } from '@/hooks/useTabType';
import { VeilederArbeidstaker } from '@/api/types/veilederArbeidstakerTypes';

const dropdownButtonTexts: DropdownButtonTexts = {
  assign: 'Tildel veileder',
  reset: 'Avbryt',
};

interface Props {
  selectedPersoner: string[];
  handleSelectAll: (checked: boolean) => void;
}

const lagListe = (
  markertePersoner: string[],
  veilederIdent: string
): VeilederArbeidstaker[] => {
  return markertePersoner.map((fnr: string) => ({
    veilederIdent,
    fnr,
  }));
};

export default function TildelVeileder({
  selectedPersoner,
  handleSelectAll,
}: Props): ReactElement {
  const veiledereQuery = useVeiledereQuery();
  const aktivVeilederQuery = useAktivVeilederQuery();
  const tildelVeileder = useTildelVeileder();

  const [chosenVeilederIdent, setChosenVeilederIdent] = useState('');
  const [input, setInput] = useState('');
  const [showList, setShowList] = useState(false);
  const [veilederIsChosen, setVeilederIsChosen] = useState(false);
  const [showError, setShowError] = useState(false);
  const { selectedTab } = useTabType();

  const handleTildelVeileder = (veilederIdent: string): void => {
    const veilederArbeidstakerListe = lagListe(selectedPersoner, veilederIdent);

    tildelVeileder.mutate(veilederArbeidstakerListe);
  };

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
  const veiledereSortedAlphabetically = sortVeiledereBySurnameAsc(
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
}
