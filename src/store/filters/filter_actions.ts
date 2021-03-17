import { HendelseTypeFilters } from './filterReducer';

export enum FilterActionTypes {
  UPDATE_BIRTH_DATE = 'UPDATE_BIRTH_DATE',
  UPDATE_VEILDERER_IDENTS = 'UPDATE_VEILEDER_IDENTS',
  UPDATE_COMPANIES = 'UPDATE_COMPANIES',
  UPDATE_HENDELSE_FILTER = 'UPDATE_HENDELSE_FILTER',
  RESET_ALL_FILTERS = 'RESET_ALL_FILTERS',
}

interface UpdateBirthDateFilter {
  type: FilterActionTypes.UPDATE_BIRTH_DATE;
  selectedBirthDates: string[];
}

interface UpdateVeilederIdentsFilter {
  type: FilterActionTypes.UPDATE_VEILDERER_IDENTS;
  selectedVeilederIdents: string[];
}

interface UpdateCompaniesFilter {
  type: FilterActionTypes.UPDATE_COMPANIES;
  selectedCompanies: string[];
}

interface UpdateHendelseFilter {
  type: FilterActionTypes.UPDATE_HENDELSE_FILTER;
  filter: HendelseTypeFilters;
}
interface ResetAllFilters {
  type: FilterActionTypes.RESET_ALL_FILTERS;
}

export type FilterAction =
  | UpdateBirthDateFilter
  | UpdateVeilederIdentsFilter
  | UpdateCompaniesFilter
  | UpdateHendelseFilter
  | ResetAllFilters;

export const updateHendelseFilterAction = (
  hendelseFilter: HendelseTypeFilters
) =>
  ({
    filter: hendelseFilter,
    type: FilterActionTypes.UPDATE_HENDELSE_FILTER,
  } as UpdateHendelseFilter);

export const updateBirthDateFilter = (birthDates: string[]) =>
  ({
    type: FilterActionTypes.UPDATE_BIRTH_DATE,
    selectedBirthDates: birthDates,
  } as UpdateBirthDateFilter);

export const updateVeilederIdentsFilter = (veilederIdents: string[]) =>
  ({
    type: FilterActionTypes.UPDATE_VEILDERER_IDENTS,
    selectedVeilederIdents: veilederIdents,
  } as UpdateVeilederIdentsFilter);

export const updateCompaniesFilter = (companies: string[]) =>
  ({
    type: FilterActionTypes.UPDATE_COMPANIES,
    selectedCompanies: companies,
  } as UpdateCompaniesFilter);

export const resetAllFilters = () =>
  ({
    type: FilterActionTypes.RESET_ALL_FILTERS,
  } as ResetAllFilters);
