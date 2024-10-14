import React from 'react';
import EkspanderbartPanel from 'nav-frontend-ekspanderbartpanel';
import { PersonregisterState } from '@/api/types/personregisterTypes';
import { filterOnPersonregister } from '@/utils/hendelseFilteringUtils';
import { OverviewTabType } from '@/konstanter';
import { useFilters } from '@/context/filters/FilterContext';
import { ActionType } from '@/context/filters/filterContextActions';
import { useTabType } from '@/context/tab/TabTypeContext';
import { useFeatureToggles } from '@/data/unleash/unleashQueryHooks';
import { Toggles } from '@/data/unleash/types/unleash_types';
import {
  FilterState,
  HendelseTypeFilter,
} from '@/context/filters/filterContextState';
import { Checkbox, CheckboxGroup } from '@navikt/ds-react';

export const HendelseTekster = {
  UFORDELTE_BRUKERE: 'Ufordelte brukere', // Ikke tildelt veileder
  ARBEIDSGIVER_BISTAND: 'Arbeidsgiver ber om bistand',
  MOTEBEHOV: 'Ber om dialogmøte', // MØTEBEHOV - UBEHANDLET
  DIALOGMOTEKANDIDAT: 'Kandidat til dialogmøte',
  DIALOGMOTESVAR: 'Svar dialogmøte',
  AKTIVITETSKRAV: 'Aktivitetskrav',
  AKTIVITETSKRAV_VURDER_STANS: 'Vurder stans',
  BEHANDLERDIALOG: 'Dialog med behandler',
  OPPFOLGINGSOPPGAVE: 'Oppfølgingsoppgave',
  BEHANDLER_BER_OM_BISTAND: 'Behandler ber om bistand',
  ARBEIDSUFORHET: '§8-4 Arbeidsuførhet',
  FRISKMELDING_TIL_ARBEIDSFORMIDLING: '§8-5 Friskmelding til arbeidsformidling',
  SNART_SLUTT_PA_SYKEPENGENE: 'Snart slutt på sykepengene',
  MANGLENDE_MEDVIRKNING: '§8-8 Manglende medvirkning',
} as const;

type Hendelse = keyof typeof HendelseTekster;
type HendelseTeksterValues = typeof HendelseTekster[Hendelse];

interface Props {
  personRegister?: PersonregisterState;
}

function initFilter(hendelse: Hendelse): HendelseTypeFilter {
  const filter: HendelseTypeFilter = {
    arbeidsgiverOnskerMote: false,
    onskerMote: false,
    ufordeltBruker: false,
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
    case 'UFORDELTE_BRUKERE': {
      filter.ufordeltBruker = !filter.ufordeltBruker;
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
    case 'UFORDELTE_BRUKERE':
      return state.ufordeltBruker;
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

function showCheckbox(
  toggles: Toggles,
  hendelse: Hendelse,
  tabType: OverviewTabType
): boolean {
  switch (hendelse) {
    case 'AKTIVITETSKRAV':
    case 'AKTIVITETSKRAV_VURDER_STANS':
    case 'BEHANDLERDIALOG':
    case 'DIALOGMOTEKANDIDAT':
    case 'DIALOGMOTESVAR':
    case 'MOTEBEHOV':
    case 'ARBEIDSGIVER_BISTAND':
    case 'BEHANDLER_BER_OM_BISTAND':
    case 'OPPFOLGINGSOPPGAVE':
    case 'ARBEIDSUFORHET':
      return true;
    case 'FRISKMELDING_TIL_ARBEIDSFORMIDLING':
      return toggles.isFrisktilarbeidEnabled;
    case 'SNART_SLUTT_PA_SYKEPENGENE':
      return toggles.isOppfolgingISenFaseEnabled;
    case 'MANGLENDE_MEDVIRKNING':
      return toggles.isManglendeMedvirkningEnabled;
    case 'UFORDELTE_BRUKERE':
      return tabType === OverviewTabType.ENHET_OVERVIEW;
  }
}

interface CheckboxElement {
  hendelse: Hendelse;
  tekst: HendelseTeksterValues;
  antallHendelser: number;
  isChecked: boolean;
  isVisible: boolean;
}

function hendelseCheckboxes(
  personRegister: PersonregisterState | undefined,
  filterState: FilterState,
  tabType: OverviewTabType,
  toggles: Toggles
): CheckboxElement[] {
  return Object.entries(HendelseTekster).map(([hendelse, tekst]) => {
    const filter = initFilter(hendelse as Hendelse);
    const antall = Object.keys(
      filterOnPersonregister(personRegister || {}, filter)
    ).length;
    const checked = isChecked(
      filterState.selectedHendelseType,
      hendelse as Hendelse
    );
    const isVisible = showCheckbox(toggles, hendelse as Hendelse, tabType);
    return {
      hendelse: hendelse,
      tekst,
      antallHendelser: antall,
      isChecked: checked,
      isVisible: isVisible,
    } as CheckboxElement;
  });
}

interface CheckboxLabelProps {
  labelText: string;
  antallHendelser: number;
}

function CheckboxLabel({ labelText, antallHendelser }: CheckboxLabelProps) {
  return (
    <div>
      {labelText} <strong>({antallHendelser})</strong>
    </div>
  );
}

export function HendelseFilterPanel({ personRegister }: Props) {
  const { toggles } = useFeatureToggles();
  const { filterState, dispatch: dispatchFilterAction } = useFilters();
  const { tabType } = useTabType();

  const checkboxElements = hendelseCheckboxes(
    personRegister,
    filterState,
    tabType,
    toggles
  ).filter((checkboksElement) => checkboksElement.isVisible);

  const onChange = (value: string) => {
    const newFilterState = updateFilterState(
      filterState.selectedHendelseType,
      value as Hendelse
    );
    dispatchFilterAction({
      type: ActionType.SetSelectedHendelseType,
      selectedHendelseType: newFilterState,
    });
  };

  return (
    <EkspanderbartPanel apen tittel="Hendelse" className="mb-4">
      <CheckboxGroup legend="Hendelse" hideLegend={true} size="small">
        {checkboxElements.map((checkbox) => {
          return (
            <Checkbox
              key={checkbox.hendelse}
              checked={checkbox.isChecked}
              value={checkbox.hendelse}
              onChange={(e) => onChange(e.target.value)}
            >
              <CheckboxLabel
                labelText={checkbox.tekst}
                antallHendelser={checkbox.antallHendelser}
              />
            </Checkbox>
          );
        })}
      </CheckboxGroup>
    </EkspanderbartPanel>
  );
}
