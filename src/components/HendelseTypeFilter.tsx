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
import { ToggleNames } from '@/data/unleash/types/unleash_types';

const texts = {
  trackingLabel: 'HendelseFilter',
};

export const HendelseTekster = {
  UFORDELTE_BRUKERE: 'Ufordelte brukere', // Ikke tildelt veileder
  ARBEIDSGIVER_BISTAND: 'Arbeidsgiver ønsker bistand',
  MOTEPLANLEGGER_SVAR: 'Svar møteplanlegger',
  MOTEBEHOV: 'Ønsker møte', // MØTEBEHOV - UBEHANDLET
  DIALOGMOTEKANDIDAT: 'Kandidat til dialogmøte',
  DIALOGMOTESVAR: 'Svar dialogmøte',
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
    svartMote: false,
    ufordeltBruker: false,
    dialogmotekandidat: false,
    dialogmotesvar: false,
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
  if (tekst === HendelseTekster.MOTEPLANLEGGER_SVAR) filter.svartMote = checked;
  if (tekst === HendelseTekster.UFORDELTE_BRUKERE)
    filter.ufordeltBruker = checked;
  if (tekst === HendelseTekster.DIALOGMOTEKANDIDAT)
    filter.dialogmotekandidat = checked;
  if (tekst === HendelseTekster.DIALOGMOTESVAR) filter.dialogmotesvar = checked;
  return filter;
};

const isCheckedInState = (
  state: HendelseTypeFilters,
  tekst: string
): boolean => {
  if (tekst === HendelseTekster.ARBEIDSGIVER_BISTAND)
    return state.arbeidsgiverOnskerMote;
  if (tekst === HendelseTekster.MOTEBEHOV) return state.onskerMote;
  if (tekst === HendelseTekster.MOTEPLANLEGGER_SVAR) return state.svartMote;
  if (tekst === HendelseTekster.UFORDELTE_BRUKERE) return state.ufordeltBruker;
  if (tekst === HendelseTekster.DIALOGMOTEKANDIDAT)
    return state.dialogmotekandidat;
  if (tekst === HendelseTekster.DIALOGMOTESVAR) return state.dialogmotesvar;
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

const getHendelsetekster = (visDialogmotekandidat: boolean) => {
  if (visDialogmotekandidat) {
    return HendelseTekster;
  }
  const { DIALOGMOTEKANDIDAT, ...hendelseTekster } = HendelseTekster;
  return hendelseTekster;
};

export const HendelseTypeFilter = ({ personRegister }: Props): ReactElement => {
  const { filterState, dispatch: dispatchFilterAction } = useFilters();
  const { tabType } = useTabType();

  const { isFeatureEnabled } = useFeatureToggles();
  const visDialogmotekandidat: boolean = isFeatureEnabled(
    ToggleNames.dialogmotekandidat
  );
  const hendelseTekster = getHendelsetekster(visDialogmotekandidat);
  const ikkeVisDialogmoteSvar = !isFeatureEnabled(ToggleNames.dialogmotesvar);

  const elementer = Object.entries(hendelseTekster)
    .filter(([, tekst]) => {
      return !(
        tekst === hendelseTekster.UFORDELTE_BRUKERE &&
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
            ikkeVisDialogmoteSvar,
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
  ikkeVisDialogmotesvar: boolean,
  personRegister?: PersonregisterState
) => {
  return elementer.map((checkboksElement) => {
    if (
      ikkeVisDialogmotesvar &&
      checkboksElement.tekst == HendelseTekster.DIALOGMOTESVAR
    )
      return null;
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
