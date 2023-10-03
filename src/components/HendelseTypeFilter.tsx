import React, { ReactElement } from 'react';
import EkspanderbartPanel from 'nav-frontend-ekspanderbartpanel';
import { Checkbox, CheckboxGruppe } from 'nav-frontend-skjema';
import { PersonregisterState } from '@/api/types/personregisterTypes';
import { filterOnPersonregister } from '@/utils/hendelseFilteringUtils';
import { OverviewTabType } from '@/konstanter';
import styled from 'styled-components';
import { useFilters } from '@/context/filters/FilterContext';
import { ActionType } from '@/context/filters/filterContextActions';
import { HendelseTypeFilters } from '@/context/filters/filterContextState';
import { useTabType } from '@/context/tab/TabTypeContext';
import { trackOnClick } from '@/amplitude/amplitude';
import { useFeatureToggles } from '@/data/unleash/unleashQueryHooks';

const texts = {
  trackingLabel: 'HendelseFilter',
};

export const HendelseTekster = {
  UFORDELTE_BRUKERE: 'Ufordelte brukere', // Ikke tildelt veileder
  ARBEIDSGIVER_BISTAND: 'Arbeidsgiver ønsker bistand',
  MOTEBEHOV: 'Ønsker møte', // MØTEBEHOV - UBEHANDLET
  DIALOGMOTEKANDIDAT: 'Kandidat til dialogmøte',
  DIALOGMOTESVAR: 'Svar dialogmøte',
  AKTIVITETSKRAV: 'Aktivitetskrav',
  BEHANDLERDIALOG: 'Dialog med behandler',
  AKTIVITETSKRAV_VURDER_STANS: 'Vurder stans',
};

interface Props {
  personRegister?: PersonregisterState;
}

const enkeltFilterFraTekst = (
  tekst: string,
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
  };
  return lagNyttFilter(filter, tekst, checked);
};

const lagNyttFilter = (
  forrigeFilter: HendelseTypeFilters,
  tekst: string,
  checked: boolean
): HendelseTypeFilters => {
  const filter = { ...forrigeFilter };
  if (tekst === HendelseTekster.ARBEIDSGIVER_BISTAND)
    filter.arbeidsgiverOnskerMote = checked;
  if (tekst === HendelseTekster.MOTEBEHOV) filter.onskerMote = checked;
  if (tekst === HendelseTekster.UFORDELTE_BRUKERE)
    filter.ufordeltBruker = checked;
  if (tekst === HendelseTekster.DIALOGMOTEKANDIDAT)
    filter.dialogmotekandidat = checked;
  if (tekst === HendelseTekster.DIALOGMOTESVAR) filter.dialogmotesvar = checked;
  if (tekst === HendelseTekster.AKTIVITETSKRAV) filter.aktivitetskrav = checked;
  if (tekst === HendelseTekster.BEHANDLERDIALOG)
    filter.behandlerdialog = checked;
  if (tekst === HendelseTekster.AKTIVITETSKRAV_VURDER_STANS)
    filter.aktivitetskravVurderStans = checked;
  return filter;
};

const isCheckedInState = (
  state: HendelseTypeFilters,
  tekst: string
): boolean => {
  if (tekst === HendelseTekster.ARBEIDSGIVER_BISTAND)
    return state.arbeidsgiverOnskerMote;
  if (tekst === HendelseTekster.MOTEBEHOV) return state.onskerMote;
  if (tekst === HendelseTekster.UFORDELTE_BRUKERE) return state.ufordeltBruker;
  if (tekst === HendelseTekster.DIALOGMOTEKANDIDAT)
    return state.dialogmotekandidat;
  if (tekst === HendelseTekster.DIALOGMOTESVAR) return state.dialogmotesvar;
  if (tekst === HendelseTekster.AKTIVITETSKRAV) return state.aktivitetskrav;
  if (tekst === HendelseTekster.BEHANDLERDIALOG) return state.behandlerdialog;
  if (tekst === HendelseTekster.AKTIVITETSKRAV_VURDER_STANS)
    return state.aktivitetskravVurderStans;
  return false;
};

interface CheckboksElement {
  tekst: string;
  checked: boolean;
  key: string;
  tabType: OverviewTabType;
}

const Container = styled.div`
  margin-bottom: 1rem;
`;
export const HendelseTypeFilter = ({ personRegister }: Props): ReactElement => {
  const { toggles } = useFeatureToggles();
  const { filterState, dispatch: dispatchFilterAction } = useFilters();
  const { tabType } = useTabType();

  const elementer = Object.entries(HendelseTekster)
    .filter(([, tekst]) => {
      return !(
        tekst === HendelseTekster.UFORDELTE_BRUKERE &&
        tabType === OverviewTabType.MY_OVERVIEW
      );
    })
    .map(([key, tekst]) => {
      const checked = isCheckedInState(filterState.selectedHendelseType, tekst);
      return { key, tekst, checked } as CheckboksElement;
    });

  const onCheckedChange = (element: CheckboksElement, checked: boolean) => {
    const nyttFilter = lagNyttFilter(
      filterState.selectedHendelseType,
      element.tekst,
      checked
    );
    trackOnClick(`${texts.trackingLabel} '${element.tekst}'`);
    dispatchFilterAction({
      type: ActionType.SetSelectedHendelseType,
      selectedHendelseType: nyttFilter,
    });
  };

  return (
    <Container>
      <EkspanderbartPanel apen tittel="Hendelse">
        <CheckboxGruppe>
          {genererHendelseCheckbokser(
            elementer,
            onCheckedChange,
            toggles.isSendingAvForhandsvarselEnabled,
            personRegister
          )}
        </CheckboxGruppe>
      </EkspanderbartPanel>
    </Container>
  );
};

const genererHendelseCheckbokser = (
  elementer: CheckboksElement[],
  onCheckedChange: (klikketElement: CheckboksElement, checked: boolean) => void,
  isSendingAvForhandsvarselEnabled: boolean,
  personRegister?: PersonregisterState
) => {
  return elementer
    .filter(
      (checkboksElement) =>
        isSendingAvForhandsvarselEnabled ||
        checkboksElement.tekst !== HendelseTekster.AKTIVITETSKRAV_VURDER_STANS
    )
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
