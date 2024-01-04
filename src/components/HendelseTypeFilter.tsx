import React, { ReactElement } from 'react';
import EkspanderbartPanel from 'nav-frontend-ekspanderbartpanel';
import { Checkbox, CheckboxGruppe } from 'nav-frontend-skjema';
import { PersonregisterState } from '@/api/types/personregisterTypes';
import { filterOnPersonregister } from '@/utils/hendelseFilteringUtils';
import { OverviewTabType } from '@/konstanter';
import { useFilters } from '@/context/filters/FilterContext';
import { ActionType } from '@/context/filters/filterContextActions';
import { HendelseTypeFilters } from '@/context/filters/filterContextState';
import { useTabType } from '@/context/tab/TabTypeContext';
import { useFeatureToggles } from '@/data/unleash/unleashQueryHooks';
import { Toggles } from '@/data/unleash/types/unleash_types';

export const HendelseTekster = {
  UFORDELTE_BRUKERE: 'Ufordelte brukere', // Ikke tildelt veileder
  ARBEIDSGIVER_BISTAND: 'Arbeidsgiver ber om bistand',
  MOTEBEHOV: 'Ber om dialogmøte', // MØTEBEHOV - UBEHANDLET
  DIALOGMOTEKANDIDAT: 'Kandidat til dialogmøte',
  DIALOGMOTESVAR: 'Svar dialogmøte',
  AKTIVITETSKRAV: 'Aktivitetskrav',
  BEHANDLERDIALOG: 'Dialog med behandler',
  AKTIVITETSKRAV_VURDER_STANS: 'Vurder stans',
  HUSKELAPP: 'Vurdert for oppfølging',
  BEHANDLER_BER_OM_BISTAND: 'Behandler ber om bistand',
} as const;

type HendelseTeksterKeys = keyof typeof HendelseTekster;
type HendelseTeksterValues = typeof HendelseTekster[HendelseTeksterKeys];

interface Props {
  personRegister?: PersonregisterState;
}

const enkeltFilterFraTekst = (
  tekst: HendelseTeksterValues,
  checked: boolean
): HendelseTypeFilters => {
  const filter: HendelseTypeFilters = {
    arbeidsgiverOnskerMote: false,
    onskerMote: false,
    ufordeltBruker: false,
    dialogmotekandidat: false,
    dialogmotesvar: false,
    aktivitetskrav: false,
    behandlerdialog: false,
    aktivitetskravVurderStans: false,
    huskelapp: false,
    behandlerBerOmBistand: false,
  };
  return lagNyttFilter(filter, tekst, checked);
};

const lagNyttFilter = (
  forrigeFilter: HendelseTypeFilters,
  tekst: HendelseTeksterValues,
  checked: boolean
): HendelseTypeFilters => {
  const filter = { ...forrigeFilter };

  switch (tekst) {
    case HendelseTekster.ARBEIDSGIVER_BISTAND: {
      filter.arbeidsgiverOnskerMote = checked;
      return filter;
    }
    case HendelseTekster.MOTEBEHOV: {
      filter.onskerMote = checked;
      return filter;
    }
    case HendelseTekster.UFORDELTE_BRUKERE: {
      filter.ufordeltBruker = checked;
      return filter;
    }
    case HendelseTekster.DIALOGMOTEKANDIDAT: {
      filter.dialogmotekandidat = checked;
      return filter;
    }
    case HendelseTekster.DIALOGMOTESVAR: {
      filter.dialogmotesvar = checked;
      return filter;
    }
    case HendelseTekster.AKTIVITETSKRAV: {
      filter.aktivitetskrav = checked;
      return filter;
    }
    case HendelseTekster.BEHANDLERDIALOG: {
      filter.behandlerdialog = checked;
      return filter;
    }
    case HendelseTekster.AKTIVITETSKRAV_VURDER_STANS: {
      filter.aktivitetskravVurderStans = checked;
      return filter;
    }
    case HendelseTekster.HUSKELAPP: {
      filter.huskelapp = checked;
      return filter;
    }
    case HendelseTekster.BEHANDLER_BER_OM_BISTAND: {
      filter.behandlerBerOmBistand = checked;
      return filter;
    }
  }
};

const isCheckedInState = (
  state: HendelseTypeFilters,
  tekst: HendelseTeksterValues
): boolean => {
  switch (tekst) {
    case HendelseTekster.ARBEIDSGIVER_BISTAND:
      return state.arbeidsgiverOnskerMote;
    case HendelseTekster.MOTEBEHOV:
      return state.onskerMote;
    case HendelseTekster.UFORDELTE_BRUKERE:
      return state.ufordeltBruker;
    case HendelseTekster.DIALOGMOTEKANDIDAT:
      return state.dialogmotekandidat;
    case HendelseTekster.DIALOGMOTESVAR:
      return state.dialogmotesvar;
    case HendelseTekster.AKTIVITETSKRAV:
      return state.aktivitetskrav;
    case HendelseTekster.BEHANDLERDIALOG:
      return state.behandlerdialog;
    case HendelseTekster.AKTIVITETSKRAV_VURDER_STANS:
      return state.aktivitetskravVurderStans;
    case HendelseTekster.HUSKELAPP:
      return state.huskelapp;
    case HendelseTekster.BEHANDLER_BER_OM_BISTAND:
      return state.behandlerBerOmBistand;
  }
};

const showCheckbox = (
  key: HendelseTeksterKeys,
  toggles: Toggles,
  tabType: OverviewTabType
): boolean => {
  switch (key) {
    case 'AKTIVITETSKRAV':
    case 'AKTIVITETSKRAV_VURDER_STANS':
    case 'BEHANDLERDIALOG':
    case 'DIALOGMOTEKANDIDAT':
    case 'DIALOGMOTESVAR':
    case 'MOTEBEHOV':
    case 'ARBEIDSGIVER_BISTAND':
    case 'BEHANDLER_BER_OM_BISTAND':
      return true;
    case 'UFORDELTE_BRUKERE':
      return tabType === OverviewTabType.ENHET_OVERVIEW;
    case 'HUSKELAPP':
      return toggles.isHuskelappEnabled;
  }
};

interface CheckboksElement {
  tekst: HendelseTeksterValues;
  checked: boolean;
  key: HendelseTeksterKeys;
  show: boolean;
}

export const HendelseTypeFilter = ({ personRegister }: Props): ReactElement => {
  const { toggles } = useFeatureToggles();
  const { filterState, dispatch: dispatchFilterAction } = useFilters();
  const { tabType } = useTabType();

  const elementer = Object.entries(HendelseTekster).map(([key, tekst]) => {
    const checked = isCheckedInState(filterState.selectedHendelseType, tekst);
    const show = showCheckbox(key as HendelseTeksterKeys, toggles, tabType);
    return {
      key,
      tekst,
      checked,
      show,
    } as CheckboksElement;
  });

  const onCheckedChange = (element: CheckboksElement, checked: boolean) => {
    const nyttFilter = lagNyttFilter(
      filterState.selectedHendelseType,
      element.tekst,
      checked
    );
    dispatchFilterAction({
      type: ActionType.SetSelectedHendelseType,
      selectedHendelseType: nyttFilter,
    });
  };

  return (
    <div className="mb-4">
      <EkspanderbartPanel apen tittel="Hendelse">
        <CheckboxGruppe>
          {genererHendelseCheckbokser(
            elementer,
            onCheckedChange,
            personRegister
          )}
        </CheckboxGruppe>
      </EkspanderbartPanel>
    </div>
  );
};

const genererHendelseCheckbokser = (
  elementer: CheckboksElement[],
  onCheckedChange: (klikketElement: CheckboksElement, checked: boolean) => void,
  personRegister?: PersonregisterState
) => {
  return elementer
    .filter((checkboksElement) => checkboksElement.show)
    .map((checkboksElement) => {
      const filter = enkeltFilterFraTekst(checkboksElement.tekst, true);
      const antall = Object.keys(
        filterOnPersonregister(personRegister || {}, filter)
      ).length;
      const labelNode = (
        <div>
          {checkboksElement.tekst} <strong>({antall})</strong>
        </div>
      );
      return (
        <Checkbox
          label={labelNode}
          checked={checkboksElement.checked}
          id={checkboksElement.key}
          key={checkboksElement.key}
          onChange={(e) => onCheckedChange(checkboksElement, e.target.checked)}
        />
      );
    });
};
