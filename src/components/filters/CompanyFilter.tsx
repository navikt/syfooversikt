import React from 'react';
import { useState, useEffect } from 'react';
import Select from 'react-select';
import FilterTitle from '../FilterTitle';
import { ValueType } from 'react-select/src/types';
import { useSelector } from 'react-redux';
import { ApplicationState } from '../../store';

const texts = {
  title: 'Virksomheter',
  placeholder: 'Velg virksomheter',
};

interface CompanyOption {
  value: string;
  label: string;
}

interface CompantyFilterProps {
  options: string[];
  selectedOptions: string[];
  onSelect(arrayOfCompanies: string[]): void;
}

const companyNamesToOptions = (companies: string[]): CompanyOption[] => {
  return companies.map((v) => ({ label: v, value: v } as CompanyOption));
};

const CompanyFilter = (props: CompantyFilterProps) => {
  const selectedCompanies = useSelector(
    (state: ApplicationState) => state.filters.selectedCompanies
  );
  const allCompanies = props.options;

  const [options, setOptions] = useState<CompanyOption[]>(
    companyNamesToOptions(props.options)
  );
  const [selectedOptions, setSelectedOptions] = useState<CompanyOption[]>(
    companyNamesToOptions(selectedCompanies)
  );

  useEffect(() => {
    setOptions(companyNamesToOptions(allCompanies));
    setSelectedOptions(companyNamesToOptions(selectedCompanies));
  }, [selectedCompanies, allCompanies]);

  return (
    <div>
      <FilterTitle>{texts.title}</FilterTitle>
      <Select
        isDisabled={allCompanies.length === 0}
        isMulti
        value={selectedOptions}
        placeholder={texts.placeholder}
        options={options}
        onChange={(v: ValueType<CompanyOption>) => {
          const arrayOfSelectedOptions = (v as CompanyOption[]) || [];
          const arrayOfStrings =
            arrayOfSelectedOptions.map((option) => option.value) || [];
          props.onSelect(arrayOfStrings);
        }}
      />
    </div>
  );
};

export default CompanyFilter;
