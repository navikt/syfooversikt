import React from 'react';
import { PersonregisterState } from '@/api/types/personregisterTypes';
import { filterHendelser } from '@/utils/hendelseFilteringUtils';
import { useFilters } from '@/context/filters/FilterContext';
import { ActionType } from '@/context/filters/filterContextActions';
import {
  FilterState,
  HendelseTypeFilter,
} from '@/context/filters/filterContextState';
import { Checkbox, CheckboxGroup } from '@navikt/ds-react';
import * as Amplitude from '@/utils/amplitude';
import { EventType } from '@/utils/amplitude';

const HendelseTekster = {
  ARBEIDSGIVER_BISTAND: 'Arbeidsgiver ber om bistand',
  MOTEBEHOV: 'Ber om dialogmøte', // MØTEBEHOV - UBEHANDLET
  DIALOGMOTEKANDIDAT: 'Kandidat til dialogmøte',
  DIALOGMOTESVAR: 'Svar dialogmøte',
  AKTIVITETSKRAV: '§ 8-8 Aktivitetskrav',
  AKTIVITETSKRAV_VURDER_STANS: 'Vurder stans',
  BEHANDLERDIALOG: 'Dialog med behandler',
  OPPFOLGINGSOPPGAVE: 'Oppfølgingsoppgave',
  BEHANDLER_BER_OM_BISTAND: 'Behandler ber om bistand',
  ARBEIDSUFORHET: '§ 8-4 Arbeidsuførhet',
  FRISKMELDING_TIL_ARBEIDSFORMIDLING:
    '§ 8-5 Friskmelding til arbeidsformidling',
  SNART_SLUTT_PA_SYKEPENGENE: 'Snart slutt på sykepengene',
  MANGLENDE_MEDVIRKNING: '§ 8-8 Manglende medvirkning',
} as const;

type Hendelse = keyof typeof HendelseTekster;
type HendelseTeksterValues = typeof HendelseTekster[Hendelse];

function initFilter(hendelse: Hendelse): HendelseTypeFilter {
  const filter: HendelseTypeFilter = {
    arbeidsgiverOnskerMote: false,
    onskerMote: false,
    dialogmotekandidat: false,
    dialogmotesvar: false,
    isAktivitetskravChecked: false,
    isAktivitetskravVurderStansChecked: false,
    behandlerdialog: false,
    oppfolgingsoppgave: false,
    behandlerBerOmBistand: false,
    isAktivArbeidsuforhetvurdering: false,
    harFriskmeldingTilArbeidsformidling: false,
    isSenOppfolgingChecked: false,
    isManglendeMedvirkningChecked: false,
  };
  return updateFilterState(filter, hendelse);
}

function updateFilterState(
  filter: HendelseTypeFilter,
  selectedfilter: Hendelse
): HendelseTypeFilter {
  switch (selectedfilter) {
    case 'ARBEIDSGIVER_BISTAND': {
      filter.arbeidsgiverOnskerMote = !filter.arbeidsgiverOnskerMote;
      return filter;
    }
    case 'MOTEBEHOV': {
      filter.onskerMote = !filter.onskerMote;
      return filter;
    }
    case 'DIALOGMOTEKANDIDAT': {
      filter.dialogmotekandidat = !filter.dialogmotekandidat;
      return filter;
    }
    case 'DIALOGMOTESVAR': {
      filter.dialogmotesvar = !filter.dialogmotesvar;
      return filter;
    }
    case 'AKTIVITETSKRAV': {
      filter.isAktivitetskravChecked = !filter.isAktivitetskravChecked;
      return filter;
    }
    case 'AKTIVITETSKRAV_VURDER_STANS': {
      filter.isAktivitetskravVurderStansChecked = !filter.isAktivitetskravVurderStansChecked;
      return filter;
    }
    case 'BEHANDLERDIALOG': {
      filter.behandlerdialog = !filter.behandlerdialog;
      return filter;
    }
    case 'OPPFOLGINGSOPPGAVE': {
      filter.oppfolgingsoppgave = !filter.oppfolgingsoppgave;
      return filter;
    }
    case 'BEHANDLER_BER_OM_BISTAND': {
      filter.behandlerBerOmBistand = !filter.behandlerBerOmBistand;
      return filter;
    }
    case 'ARBEIDSUFORHET': {
      filter.isAktivArbeidsuforhetvurdering = !filter.isAktivArbeidsuforhetvurdering;
      return filter;
    }
    case 'FRISKMELDING_TIL_ARBEIDSFORMIDLING': {
      filter.harFriskmeldingTilArbeidsformidling = !filter.harFriskmeldingTilArbeidsformidling;
      return filter;
    }
    case 'SNART_SLUTT_PA_SYKEPENGENE': {
      filter.isSenOppfolgingChecked = !filter.isSenOppfolgingChecked;
      return filter;
    }
    case 'MANGLENDE_MEDVIRKNING': {
      filter.isManglendeMedvirkningChecked = !filter.isManglendeMedvirkningChecked;
      return filter;
    }
  }
}

function isChecked(state: HendelseTypeFilter, hendelse: Hendelse): boolean {
  switch (hendelse) {
    case 'ARBEIDSGIVER_BISTAND':
      return state.arbeidsgiverOnskerMote;
    case 'MOTEBEHOV':
      return state.onskerMote;
    case 'DIALOGMOTEKANDIDAT':
      return state.dialogmotekandidat;
    case 'DIALOGMOTESVAR':
      return state.dialogmotesvar;
    case 'AKTIVITETSKRAV':
      return state.isAktivitetskravChecked;
    case 'AKTIVITETSKRAV_VURDER_STANS':
      return state.isAktivitetskravVurderStansChecked;
    case 'BEHANDLERDIALOG':
      return state.behandlerdialog;
    case 'OPPFOLGINGSOPPGAVE':
      return state.oppfolgingsoppgave;
    case 'BEHANDLER_BER_OM_BISTAND':
      return state.behandlerBerOmBistand;
    case 'ARBEIDSUFORHET':
      return state.isAktivArbeidsuforhetvurdering;
    case 'FRISKMELDING_TIL_ARBEIDSFORMIDLING':
      return state.harFriskmeldingTilArbeidsformidling;
    case 'SNART_SLUTT_PA_SYKEPENGENE':
      return state.isSenOppfolgingChecked;
    case 'MANGLENDE_MEDVIRKNING':
      return state.isManglendeMedvirkningChecked;
  }
}

interface CheckboxElement {
  hendelse: Hendelse;
  tekst: HendelseTeksterValues;
  antallHendelser: number;
  isChecked: boolean;
}

function hendelseCheckboxes(
  personRegister: PersonregisterState | undefined,
  filterState: FilterState
): CheckboxElement[] {
  return Object.entries(HendelseTekster).map(([hendelse, tekst]) => {
    const filter = initFilter(hendelse as Hendelse);
    const antall = Object.keys(filterHendelser(personRegister || {}, filter))
      .length;
    const checked = isChecked(
      filterState.selectedHendelseType,
      hendelse as Hendelse
    );
    return {
      hendelse: hendelse,
      tekst,
      antallHendelser: antall,
      isChecked: checked,
    } as CheckboxElement;
  });
}

interface Props {
  personRegister?: PersonregisterState;
}

export default function HendelseFilter({ personRegister }: Props) {
  const { filterState, dispatch: dispatchFilterAction } = useFilters();
  const checkboxElements = hendelseCheckboxes(personRegister, filterState);

  const onChange = (value: string) => {
    const newFilterState = { ...filterState.selectedHendelseType };
    updateFilterState(newFilterState, value as Hendelse);
    dispatchFilterAction({
      type: ActionType.SetSelectedHendelseType,
      selectedHendelseType: newFilterState,
    });
    const shouldLogToAmplitude = checkboxElements.some(
      (checkbox) => checkbox.hendelse === value && !checkbox.isChecked
    );
    if (shouldLogToAmplitude) {
      Amplitude.logEvent({
        type: EventType.OptionSelected,
        data: {
          url: window.location.href,
          tekst: 'Hendelsesfilter valgt',
          option: value,
        },
      });
    }
  };

  return (
    <CheckboxGroup legend="Hendelse" size="small">
      {checkboxElements.map((checkbox) => {
        return (
          <Checkbox
            key={checkbox.hendelse}
            checked={checkbox.isChecked}
            value={checkbox.hendelse}
            onChange={(e) => onChange(e.target.value)}
          >
            {checkbox.tekst} <strong>({checkbox.antallHendelser})</strong>
          </Checkbox>
        );
      })}
    </CheckboxGroup>
  );
}
