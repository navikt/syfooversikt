import { HendelseTypeFilters } from './filterReducer';

export enum FilterActionTypes {
  UPDATE_BIRTH_DATE = 'UPDATE_BIRTH_DATE',
  UPDATE_VEILDERER_IDENTS = 'UPDATE_VEILEDER_IDENTS',
  UPDATE_COMPANIES = 'UPDATE_COMPANIES',
  UPDATE_HENDELSE_FILTER = 'UPDATE_HENDELSE_FILTER',
  RESET_ALL_FILTERS = 'RESET_ALL_FILTERS',
}

interface UpdateBirthDateFilterAction {
  type: FilterActionTypes.UPDATE_BIRTH_DATE;
  selectedBirthDates: string[];
}

interface UpdateVeilederIdentsFilterAction {
  type: FilterActionTypes.UPDATE_VEILDERER_IDENTS;
  selectedVeilederIdents: string[];
}

interface UpdateCompaniesFilterAction {
  type: FilterActionTypes.UPDATE_COMPANIES;
  selectedCompanies: string[];
}

interface UpdateHendelseFilterAction {
  type: FilterActionTypes.UPDATE_HENDELSE_FILTER;
  filter: HendelseTypeFilters;
}
interface ResetAllFiltersAction {
  type: FilterActionTypes.RESET_ALL_FILTERS;
}

export type FilterAction =
  | UpdateBirthDateFilterAction
  | UpdateVeilederIdentsFilterAction
  | UpdateCompaniesFilterAction
  | UpdateHendelseFilterAction
  | ResetAllFiltersAction;

export const updateHendelseFilterAction = (
  hendelseFilter: HendelseTypeFilters
): FilterAction => ({
  filter: hendelseFilter,
  type: FilterActionTypes.UPDATE_HENDELSE_FILTER,
});

export const updateBirthDateFilter = (birthDates: string[]): FilterAction => ({
  type: FilterActionTypes.UPDATE_BIRTH_DATE,
  selectedBirthDates: birthDates,
});

export const updateVeilederIdentsFilter = (
  veilederIdents: string[]
): FilterAction => ({
  type: FilterActionTypes.UPDATE_VEILDERER_IDENTS,
  selectedVeilederIdents: veilederIdents,
});

export const updateCompaniesFilter = (companies: string[]): FilterAction => ({
  type: FilterActionTypes.UPDATE_COMPANIES,
  selectedCompanies: companies,
});

export const resetAllFilters = (): FilterAction => ({
  type: FilterActionTypes.RESET_ALL_FILTERS,
});
