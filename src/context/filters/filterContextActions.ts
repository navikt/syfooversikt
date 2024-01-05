import { HendelseTypeFilters } from '@/context/filters/filterContextState';
import { FristFilterOption } from '@/utils/hendelseFilteringUtils';

export enum ActionType {
  SetTekstFilter,
  SetSelectedVeilederIdents,
  SetSelectedOptions,
  SetSelectedCompanies,
  SetSelectedBirthDates,
  SetSelectedFristFilter,
  SetSelectedHendelseType,
  ResetFilters,
}

export interface SetTekstFilter {
  type: ActionType.SetTekstFilter;
  tekstFilter: string;
}

export interface SetSelectedVeilederIdents {
  type: ActionType.SetSelectedVeilederIdents;
  selectedVeilederIdents: string[];
}

export interface SetSelectedOptions {
  type: ActionType.SetSelectedOptions;
  selectedOptions: string[];
}

export interface SetSelectedCompanies {
  type: ActionType.SetSelectedCompanies;
  selectedCompanies: string[];
}

export interface SetSelectedFristFilter {
  type: ActionType.SetSelectedFristFilter;
  selectedFristFilters: FristFilterOption[];
}

export interface SetSelectedBirthDates {
  type: ActionType.SetSelectedBirthDates;
  selectedBirthDates: string[];
}

export interface SetSelectedHendelseType {
  type: ActionType.SetSelectedHendelseType;
  selectedHendelseType: HendelseTypeFilters;
}

export interface ResetFilters {
  type: ActionType.ResetFilters;
}

export type FilterActions =
  | SetTekstFilter
  | SetSelectedVeilederIdents
  | SetSelectedOptions
  | SetSelectedCompanies
  | SetSelectedFristFilter
  | SetSelectedBirthDates
  | SetSelectedHendelseType
  | ResetFilters;
