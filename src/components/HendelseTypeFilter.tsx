import React, { ReactElement } from 'react';
import EkspanderbartPanel from 'nav-frontend-ekspanderbartpanel';
import { Checkbox, CheckboxGruppe } from 'nav-frontend-skjema';
import { PersonregisterState } from '@/api/types/personregisterTypes';
import { filtrerPersonregister } from '@/utils/hendelseFilteringUtils';
import { OverviewTabType } from '@/konstanter';
import styled from 'styled-components';
import { useFilters } from '@/context/filters/FilterContext';
import { ActionType } from '@/context/filters/filterContextActions';
import { HendelseTypeFilters } from '@/context/filters/filterContextState';
import { useTabType } from '@/context/tab/TabTypeContext';
import { trackOnClick } from '@/amplitude/amplitude';

const texts = {
  trackingLabel: 'HendelseFilter',
};

export const HendelseTekster = {
  UFORDELTE_BRUKERE: 'Ufordelte brukere', // Ikke tildelt veileder
  ARBEIDSGIVER_BISTAND: 'Arbeidsgiver ønsker bistand',
  MOTEPLANLEGGER_SVAR: 'Svar møteplanlegger', // Svar fra møteplanlegger
  MOTEBEHOV: 'Ønsker møte', // MØTEBEHOV - UBEHANDLET
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
  const { filterState, dispatch: dispatchFilterAction } = useFilters();
  const { tabType } = useTabType();

  const elementer = Object.keys(HendelseTekster)
    .filter((key) => {
      return !(
        HendelseTekster[key] === HendelseTekster.UFORDELTE_BRUKERE &&
        tabType === OverviewTabType.MY_OVERVIEW
      );
    })
    .map((key) => {
      const tekst: string = HendelseTekster[key];
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
  personRegister?: PersonregisterState
) => {
  return elementer.map((checkboksElement) => {
    const filter = enkeltFilterFraTekst(checkboksElement.tekst, true);
    const antall = Object.keys(
      filtrerPersonregister(personRegister || {}, filter)
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
