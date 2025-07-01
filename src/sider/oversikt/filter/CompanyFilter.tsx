import React, { ReactElement } from 'react';
import { UNSAFE_Combobox } from '@navikt/ds-react';
import { ActionType } from '@/context/filters/filterContextActions';
import { useFilters } from '@/context/filters/FilterContext';
import { PersonregisterState } from '@/api/types/personregisterTypes';
import { mapPersonregisterToCompanyList } from '@/utils/personDataUtil';

const texts = {
  title: 'Virksomheter',
  placeholder: 'Velg virksomheter',
};

interface Props {
  persondata: PersonregisterState;
}

export default function CompanyFilter({ persondata }: Props): ReactElement {
  const { filterState, dispatch: dispatchFilterAction } = useFilters();
  const onCompanyChange = (companies: string[]) => {
    dispatchFilterAction({
      type: ActionType.SetSelectedCompanies,
      selectedCompanies: companies,
    });
  };
  const selectedCompanies = filterState.selectedCompanies;
  const options = mapPersonregisterToCompanyList(persondata);
  const onOptionSelected = (option: string, isSelected: boolean) => {
    if (isSelected) {
      onCompanyChange([...selectedCompanies, option]);
    } else {
      onCompanyChange(selectedCompanies.filter((o) => o !== option));
    }
  };

  return (
    <UNSAFE_Combobox
      isMultiSelect
      size="small"
      label={texts.title}
      placeholder={selectedCompanies.length > 0 ? undefined : texts.placeholder}
      options={options.sort()}
      selectedOptions={selectedCompanies}
      onToggleSelected={onOptionSelected}
    />
  );
}
