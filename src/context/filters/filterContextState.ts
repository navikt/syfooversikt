import {
  AgeFilterOption,
  FristFilterOption,
} from '@/utils/hendelseFilteringUtils';

export interface HendelseTypeFilters {
  arbeidsgiverOnskerMote: boolean;
  onskerMote: boolean;
  ufordeltBruker: boolean;
  dialogmotekandidat: boolean;
  dialogmotesvar: boolean;
  aktivitetskrav: boolean;
  behandlerdialog: boolean;
  aktivitetskravVurderStans: boolean;
  oppfolgingsoppgave: boolean;
  behandlerBerOmBistand: boolean;
  arbeidsuforhetForhandsvarselUtlopt: boolean;
}

export interface FilterState {
  tekstFilter: string;
  selectedVeilederIdents: string[];
  selectedOptions: string[];
  selectedCompanies: string[];
  selectedBirthDates: string[];
  selectedFristFilters: FristFilterOption[];
  selectedAgeFilters: AgeFilterOption[];
  selectedHendelseType: HendelseTypeFilters;
}

export const filterInitialState: FilterState = {
  tekstFilter: '',
  selectedVeilederIdents: [],
  selectedOptions: [],
  selectedCompanies: [],
  selectedBirthDates: [],
  selectedFristFilters: [],
  selectedAgeFilters: [],
  selectedHendelseType: {
    arbeidsgiverOnskerMote: false,
    onskerMote: false,
    ufordeltBruker: false,
    dialogmotekandidat: false,
    dialogmotesvar: false,
    aktivitetskrav: false,
    behandlerdialog: false,
    aktivitetskravVurderStans: false,
    oppfolgingsoppgave: false,
    behandlerBerOmBistand: false,
    arbeidsuforhetForhandsvarselUtlopt: false,
  },
};
