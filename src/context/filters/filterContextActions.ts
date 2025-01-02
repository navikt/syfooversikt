import { HendelseTypeFilter } from '@/context/filters/filterContextState';
import {
  AgeFilterOption,
  FristFilterOption,
} from '@/utils/hendelseFilteringUtils';

export enum ActionType {
  SetTekstFilter,
  SetSelectedVeilederIdents,
  SetSelectedOptions,
  SetSelectedCompanies,
  SetSelectedBirthDates,
  SetSelectedFristFilter,
  SetSelectedAgeFilter,
  SetSelectedHendelseType,
  SetFilterUfordelteBrukere,
  ResetFilters,
}

export interface SetTekstFilter {
  type: ActionType.SetTekstFilter;
  tekstFilter: string;
}

export interface SetUfordelteBrukereFilter {
  type: ActionType.SetFilterUfordelteBrukere;
  isUfordelteBrukereFilter: boolean;
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

export interface SetSelectedAgeFilter {
  type: ActionType.SetSelectedAgeFilter;
  selectedAgeFilters: AgeFilterOption[];
}

export interface SetSelectedBirthDates {
  type: ActionType.SetSelectedBirthDates;
  selectedBirthDates: string[];
}

export interface SetSelectedHendelseType {
  type: ActionType.SetSelectedHendelseType;
  selectedHendelseType: HendelseTypeFilter;
}

export interface ResetFilters {
  type: ActionType.ResetFilters;
}

export type FilterActions =
  | SetTekstFilter
  | SetUfordelteBrukereFilter
  | SetSelectedVeilederIdents
  | SetSelectedOptions
  | SetSelectedCompanies
  | SetSelectedFristFilter
  | SetSelectedAgeFilter
  | SetSelectedBirthDates
  | SetSelectedHendelseType
  | ResetFilters;
