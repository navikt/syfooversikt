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
  behandlerdialog: boolean;
  oppfolgingsoppgave: boolean;
  behandlerBerOmBistand: boolean;
  isAktivArbeidsuforhetvurdering: boolean;
  harFriskmeldingTilArbeidsformidling: boolean;
  isSenOppfolgingChecked: boolean;
  isAktivitetskravChecked: boolean;
  isAktivitetskravVurderStansChecked: boolean;
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
    behandlerdialog: false,
    oppfolgingsoppgave: false,
    behandlerBerOmBistand: false,
    isAktivArbeidsuforhetvurdering: false,
    harFriskmeldingTilArbeidsformidling: false,
    isSenOppfolgingChecked: false,
    isAktivitetskravChecked: false,
    isAktivitetskravVurderStansChecked: false,
  },
};
