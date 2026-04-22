import {
  AgeFilterOption,
  DatoFilterOption,
} from '@/utils/hendelseFilteringUtils';
import { DateRange } from '@/sider/oversikt/filter/types.ts';

export interface FristFilter {
  selectedDatoOptions: DatoFilterOption[];
  selectedDateRange: DateRange;
}

export interface HendelseTypeFilter {
  arbeidsgiverOnskerMote: boolean;
  onskerMote: boolean;
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
  isManglendeMedvirkningChecked: boolean;
  isKartleggingssporsmalChecked: boolean;
}

export interface FilterState {
  tekstFilter: string;
  selectedVeilederIdents: string[];
  selectedOptions: string[];
  selectedCompanies: string[];
  selectedBirthDates: string[];
  selectedFristFilters: FristFilter;
  selectedAgeFilters: AgeFilterOption[];
  selectedHendelseType: HendelseTypeFilter;
  isUfordelteBrukereFilter: boolean;
}

export const filterInitialState: FilterState = {
  tekstFilter: '',
  selectedVeilederIdents: [],
  selectedOptions: [],
  selectedCompanies: [],
  selectedBirthDates: [],
  selectedFristFilters: {
    selectedDatoOptions: [],
    selectedDateRange: {
      from: undefined,
      to: undefined,
    },
  },
  selectedAgeFilters: [],
  selectedHendelseType: {
    arbeidsgiverOnskerMote: false,
    onskerMote: false,
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
    isManglendeMedvirkningChecked: false,
    isKartleggingssporsmalChecked: false,
  },
  isUfordelteBrukereFilter: false,
};
