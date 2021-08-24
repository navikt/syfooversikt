export interface HendelseTypeFilters {
  arbeidsgiverOnskerMote: boolean;
  onskerMote: boolean;
  svartMote: boolean;
  ufordeltBruker: boolean;
}

export interface FilterState {
  tekstFilter: string;
  selectedVeilederIdents: string[];
  selectedOptions: string[];
  selectedCompanies: string[];
  selectedBirthDates: string[];
  selectedHendelseType: HendelseTypeFilters;
}

export const filterInitialState = {
  tekstFilter: '',
  selectedVeilederIdents: [],
  selectedOptions: [],
  selectedCompanies: [],
  selectedBirthDates: [],
  selectedHendelseType: {
    arbeidsgiverOnskerMote: false,
    onskerMote: false,
    svartMote: false,
    ufordeltBruker: false,
  },
};
