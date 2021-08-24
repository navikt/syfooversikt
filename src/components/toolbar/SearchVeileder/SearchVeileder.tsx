import React, { ChangeEvent, ReactElement, useState } from 'react';
import OpenDropdownButton from '../OpenDropdownButton/OpenDropdownButton';
import { Veileder } from '@/api/types/veiledereTypes';
import styled from 'styled-components';
import { Dropdown } from '../Dropdown/Dropdown';
import { sortVeiledereAlphabeticallyWithGivenVeilederFirst } from '@/utils/veiledereUtils';
import { filterVeiledereOnInput } from '@/utils/assignVeilederUtils';
import { DropdownButtonTexts } from '../Dropdown/DropdownButtons';
import {
  useAktivVeilederQuery,
  useVeiledereQuery,
} from '@/react-query/veiledereQueryHooks';
import { useFilters } from '@/context/filters/FilterContext';
import { ActionType } from '@/context/filters/filterContextActions';

const ButtonDiv = styled.div`
  display: flex;
  align-items: center;
`;

const dropdownButtonTexts: DropdownButtonTexts = {
  assign: 'Lagre',
  reset: 'Nullstill',
};

const SearchVeileder = (): ReactElement => {
  const [showList, setShowList] = useState(false);
  const [input, setInput] = useState('');
  const veiledereQuery = useVeiledereQuery();
  const aktivVeilederQuery = useAktivVeilederQuery();
  const { filterState, dispatch: dispatchFilterAction } = useFilters();

  const [activeVeilederFilter, setActiveVeilederFilter] = useState<Veileder[]>(
    []
  );

  const onVeilederIdentsChange = (veilederIdents: string[]) => {
    dispatchFilterAction({
      type: ActionType.SetSelectedVeilederIdents,
      selectedVeilederIdents: veilederIdents,
    });
  };

  const toggleShowList = () => {
    setInput('');
    setShowList(!showList);
  };

  const cancelButtonHandler = () => {
    setActiveVeilederFilter([]);
    setInput('');
    onVeilederIdentsChange([]);
  };

  const inputChangeHandler = (event: ChangeEvent) => {
    const target = event.target as HTMLInputElement;
    setInput(target.value);
  };

  const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const currentTarget = e.currentTarget;
    setTimeout(() => {
      if (!currentTarget.contains(document.activeElement)) {
        onVeilederIdentsChange(activeVeilederFilter.map((v) => v.ident));
        setShowList(false);
        setInput('');
      }
    }, 0);
  };

  const lowerCaseInput = input.toLowerCase();
  const veiledereSortedAlphabetically = sortVeiledereAlphabeticallyWithGivenVeilederFirst(
    veiledereQuery.data || [],
    aktivVeilederQuery.data?.ident || ''
  );
  const lowerCasedAndFilteredVeiledere = filterVeiledereOnInput(
    veiledereSortedAlphabetically,
    lowerCaseInput
  );

  const checkedSort = (v1: Veileder, v2: Veileder) => {
    const v1InFilter = filterState.selectedVeilederIdents.find(
      (v) => v === v1.ident
    );
    const v2InFilter = filterState.selectedVeilederIdents.find(
      (v) => v === v2.ident
    );

    if (v1.ident === aktivVeilederQuery.data?.ident) {
      return -1;
    }

    if (v2.ident === aktivVeilederQuery.data?.ident) {
      return 1;
    }

    if ((v1InFilter && v2InFilter) || (!v1InFilter && !v2InFilter)) {
      return 0;
    }
    if (v1InFilter && !v2InFilter) {
      return -1;
    }
    return 1;
  };

  const filteredVeiledere = lowerCasedAndFilteredVeiledere.sort(checkedSort);

  const checkboxOnChangeHandler = (veileder: Veileder) => {
    if (
      activeVeilederFilter.find((v: Veileder) => v.ident === veileder.ident)
    ) {
      setActiveVeilederFilter(
        activeVeilederFilter.filter((v) => v.ident !== veileder.ident)
      );
    } else if (activeVeilederFilter) {
      setActiveVeilederFilter([...activeVeilederFilter, veileder]);
    }
  };

  const chooseButtonHandler = () => {
    setShowList(false);
    setInput('');
    onVeilederIdentsChange(activeVeilederFilter?.map((v) => v.ident) || []);
  };

  return (
    <div tabIndex={1} onBlur={onBlur} style={{ padding: 0 }}>
      <ButtonDiv>
        <OpenDropdownButton
          text={`Søk veileder (${activeVeilederFilter.length})`}
          showList={showList}
          userIsChecked={true}
          onClick={toggleShowList}
          search={true}
        />
      </ButtonDiv>
      {showList && (
        <Dropdown
          buttonTexts={dropdownButtonTexts}
          buttonChangeHandler={checkboxOnChangeHandler}
          cancelButtonHandler={cancelButtonHandler}
          chooseButtonHandler={chooseButtonHandler}
          filteredVeiledere={filteredVeiledere}
          selectedVeileders={activeVeilederFilter}
          showNoChosenVeilederError={false}
          placeholder={'Søk veileder'}
          input={input}
          inputChangeHandler={inputChangeHandler}
          chosenVeilederIdent={''}
          veilederIsChosen={true}
          buttonType={'checkbox'}
        />
      )}
    </div>
  );
};

export default SearchVeileder;
