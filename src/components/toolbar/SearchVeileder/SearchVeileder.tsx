import React, { ChangeEvent, useState, useEffect, ReactElement } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import OpenDropdownButton from '../OpenDropdownButton/OpenDropdownButton';
import { Veileder } from '@/store/veiledere/veiledereTypes';
import styled from 'styled-components';
import { Dropdown } from '../Dropdown/Dropdown';
import { sortVeiledereAlphabeticallyWithGivenVeilederFirst } from '@/utils/veiledereUtils';
import { filterVeiledereOnInput } from '@/utils/assignVeilederUtils';
import { VeilederinfoDTO } from '@/store/veilederinfo/veilederinfoTypes';
import { ApplicationState } from '@/store';
import { DropdownButtonTexts } from '../Dropdown/DropdownButtons';
import { updateVeilederIdentsFilter } from '@/store/filters/filter_actions';
import countFilterAction, {
  CounterFilterActionTypes,
} from '../../../metrics/countFilterAction';

interface VeilederIdentsFilterProps {
  aktivVeilederInfo?: VeilederinfoDTO;
  veiledere: Veileder[];
}

const ButtonDiv = styled.div`
  display: flex;
  align-items: center;
`;

const dropdownButtonTexts: DropdownButtonTexts = {
  assign: 'Lagre',
  reset: 'Nullstill',
};

const SearchVeileder = (props: VeilederIdentsFilterProps): ReactElement => {
  const [showList, setShowList] = useState(false);
  const [input, setInput] = useState('');
  const appState = useSelector((state: ApplicationState) => state);
  const dispatch = useDispatch();
  const selectedVeilederIdents: string[] =
    appState.filters.selectedVeilederIdents;

  const [activeFilters, setActiveFilters] = useState(
    selectedVeilederIdents.length
  );

  const [activeVeilederFilter, setActiveVeilederFilter] = useState<Veileder[]>(
    props.veiledere.filter((v) =>
      selectedVeilederIdents.find((ident) => ident === v.ident)
    )
  );

  const onVeilderIdentsChange = (veilederIdents: string[]) => {
    dispatch(updateVeilederIdentsFilter(veilederIdents));
    countFilterAction(CounterFilterActionTypes.VEILEDER_SOK).next();
  };

  const toggleShowList = () => {
    setInput('');
    setShowList(!showList);
  };

  const cancelButtonHandler = () => {
    setActiveVeilederFilter([]);
    setActiveFilters(0);
    setInput('');
    onVeilderIdentsChange([]);
  };

  const inputChangeHandler = (event: ChangeEvent) => {
    const target = event.target as HTMLInputElement;
    setInput(target.value);
  };

  const lowerCaseInput = input.toLowerCase();
  const veiledereSortedAlphabetically = sortVeiledereAlphabeticallyWithGivenVeilederFirst(
    props.veiledere,
    props.aktivVeilederInfo?.ident || ''
  );
  const lowerCasedAndFilteredVeiledere = filterVeiledereOnInput(
    veiledereSortedAlphabetically,
    lowerCaseInput
  );

  const checkedSort = (v1: Veileder, v2: Veileder) => {
    const v1InFilter = selectedVeilederIdents.find((v) => v === v1.ident);
    const v2InFilter = selectedVeilederIdents.find((v) => v === v2.ident);

    if (v1.ident === props.aktivVeilederInfo?.ident) {
      return -1;
    }

    if (v2.ident === props.aktivVeilederInfo?.ident) {
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
    } else {
      setActiveVeilederFilter([...activeVeilederFilter, veileder]);
    }
  };

  const checkedVeileders = useSelector(
    (state: ApplicationState) => state.filters.selectedVeilederIdents
  );

  useEffect(() => {
    if (checkedVeileders.length === 0) {
      setActiveFilters(0);
      setActiveVeilederFilter([]);
    } else {
      setActiveFilters(activeVeilederFilter.length);
    }
  }, [checkedVeileders]);

  const chooseButtonHandler = () => {
    setActiveFilters(activeVeilederFilter.length);
    setShowList(false);
    setInput('');
    onVeilderIdentsChange(activeVeilederFilter.map((v) => v.ident));
  };

  const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const currentTarget = e.currentTarget;
    setTimeout(() => {
      if (!currentTarget.contains(document.activeElement)) {
        onVeilderIdentsChange(activeVeilederFilter.map((v) => v.ident));
        setShowList(false);
        setInput('');
      }
    }, 0);
  };

  return (
    <div tabIndex={1} onBlur={onBlur} style={{ padding: 0 }}>
      <ButtonDiv>
        <OpenDropdownButton
          text={`Søk veileder (${activeFilters})`}
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
