import React, {
    ChangeEvent,
    useState,
    useEffect,
} from 'react';
import { useSelector } from 'react-redux';
import OpenDropdownButton from '../OpenDropdownButton/OpenDropdownButton';
import { Veileder } from '../../../store/veiledere/veiledereTypes';
import styled from 'styled-components';
import { Dropdown } from '../Dropdown/Dropdown';
import { sortVeiledereAlphabeticallyWithGivenVeilederFirst } from '../../../utils/veiledereUtils';
import { filterVeiledereOnInput } from '../../../utils/assignVeilederUtils';
import { Veilederinfo } from '../../../store/veilederinfo/veilederinfoTypes';
import { ApplicationState } from '../../../store';

interface VeilederIdentsFilterProps {
    aktivVeilederInfo: Veilederinfo;
    veiledere: Veileder[];

    onSelect(value: string[]): void;
}

const ButtonDiv = styled.div`
  display: flex;
  align-items: center;
`;

const SearchVeileder = (props: VeilederIdentsFilterProps) => {
    const [showList, setShowList] = useState(false);
    const [input, setInput] = useState('');
    const appState = useSelector((state: ApplicationState) => state);
    const selectedVeilederIdents: string[] = appState.filters.selectedVeilederIdents;

    const [activeFilters, setActiveFilters] = useState(selectedVeilederIdents.length);

    const [activeVeilederFilter, setActiveVeilederFilter] = useState<Veileder[]>(
        props.veiledere.filter(
            (v) => selectedVeilederIdents.find((ident) => ident === v.ident)
        )
    );

    const toggleShowList = () => {
        setShowList(!showList);
    };

    const cancelButtonHandler = () => {
        setActiveVeilederFilter([])
        setActiveFilters(0)
        props.onSelect([])
        setShowList(false);
    };

    const inputChangeHandler = (event: ChangeEvent) => {
        const target = event.target as HTMLInputElement;
        setInput(target.value);
    };

    const lowerCaseInput = input.toLowerCase();
    const veiledereSortedAlphabetically = sortVeiledereAlphabeticallyWithGivenVeilederFirst(
        props.veiledere,
        props.aktivVeilederInfo.ident
    );
    const lowerCasedAndFilteredVeiledere = filterVeiledereOnInput(
        veiledereSortedAlphabetically,
        lowerCaseInput
    );

    const checkedSort = (v1: Veileder, v2: Veileder) => {
        const v1InFilter = selectedVeilederIdents.find((v) => v === v1.ident);
        const v2InFilter = selectedVeilederIdents.find((v) => v === v2.ident);

        if (v1.ident === props.aktivVeilederInfo.ident) {
            return -1;
        }

        if (v2.ident === props.aktivVeilederInfo.ident) {
            return 1;
        }

        if (v1InFilter && v2InFilter || !v1InFilter && !v2InFilter) {
            return 0;
        }
        if (v1InFilter && !v2InFilter) {
            return -1;
        }
        return 1;
    };

    const filteredVeiledere = lowerCasedAndFilteredVeiledere.sort(checkedSort);

    const checkboxOnChangeHandler = (veileder: Veileder) => {
        if (activeVeilederFilter.find((v: Veileder) => v.ident === veileder.ident)) {
            setActiveVeilederFilter(activeVeilederFilter.filter((v) => v.ident !== veileder.ident));
        } else {
            setActiveVeilederFilter([...activeVeilederFilter, veileder]);
        }
    };

    const checkedVeileders = useSelector((state: ApplicationState) => state.filters.selectedVeilederIdents);

    useEffect(() => {
        if (checkedVeileders.length === 0) {
            setActiveFilters(0);
            setActiveVeilederFilter([]);
        } else {
            setActiveFilters(activeVeilederFilter.length);
        }
    }, [checkedVeileders]);

    const chooseButtonHandler = () => {
        setActiveFilters((activeVeilederFilter.length));
        setShowList(false);
        props.onSelect(activeVeilederFilter.map((v) => v.ident));
    };

    const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const currentTarget = e.currentTarget;
        setTimeout(() => {
            if (!currentTarget.contains(document.activeElement)) {
                props.onSelect(activeVeilederFilter.map((v) => v.ident));
                setShowList(false);
            }
        }, 0);
    };

    return (
        <div tabIndex={1} onBlur={onBlur} style={{padding: 0}}>
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
                    buttonChangeHandler={checkboxOnChangeHandler}
                    cancelButtonHandler={cancelButtonHandler}
                    chooseButtonHandler={chooseButtonHandler}
                    filteredVeiledere={filteredVeiledere}
                    selectedVeileders={activeVeilederFilter}
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
