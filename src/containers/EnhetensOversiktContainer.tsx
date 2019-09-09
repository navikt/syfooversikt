import React, {
  useEffect,
  useState,
} from 'react';
import {
  useDispatch,
  useSelector,
} from 'react-redux';
import styled from 'styled-components';
import { PersonregisterState } from '../store/personregister/personregisterTypes';
import AppSpinner from '../components/AppSpinner';
import Sokeresultat from '../components/Sokeresultat';
import { pushVeilederArbeidstakerForespurt } from '../store/veilederArbeidstaker/veilederArbeidstaker_actions';
import { VeilederArbeidstaker } from '../store/veilederArbeidstaker/veilederArbeidstakerTypes';
import SokeresultatFilter, { HendelseTypeFilters } from '../components/HendelseTypeFilter';
import {
  Filterable,
  filtrerPersonregister,
  filtrerPaaFodselsnummerEllerNavn,
  filterEventsOnVeileder,
} from '../utils/hendelseFilteringUtils';
import TekstFilter from '../components/TekstFilter';
import { ApplicationState } from '../store';
import { AlertStripeRod } from '../components/AlertStripeAdvarsel';
import { AlertStripeWarning } from '../components/AlertStripeWarning';
import { OverviewTabType } from '../konstanter';
import { hentVeiledere } from '../store/veiledere/veiledere_actions';

const tekster = {
    feil: {
      hentEnhetensOversiktFeilet: 'Det skjedde en feil: Kunne ikke hente enhetens oversikt',
      hentetIngenPersoner: 'Det er ingen personer knyttet til enhet med hendelser',
    },
};

const info = (altFeilet: boolean, hentetIngenPersoner: boolean) => {
  if (altFeilet) {
    return AlertStripeRod(
        tekster.feil.hentEnhetensOversiktFeilet,
        'oversiktContainer__alertstripe'
    );
  } else if(hentetIngenPersoner) {
    return AlertStripeWarning(
        tekster.feil.hentetIngenPersoner,
        'oversiktContainer__alertstripe'
    );
  }
};

const OversiktContainerInnhold = styled.div`
  display: flex;
`;

const SokeresultatFiltre = styled.div`
  flex: 1;
  min-width: 18rem;
  margin-right: 2rem;
`;

const TekstFilterStyled = styled(TekstFilter)`
  margin-bottom: 1rem;
`;

const HendelseFilterStyled = styled(SokeresultatFilter)`
  margin-bottom: 1rem;
`;

interface Props {
  tabType?: OverviewTabType;
}

export default ({ tabType = OverviewTabType.ENHET_OVERVIEW  }: Props) => {
  const initHendelseTypeFilter = {} as HendelseTypeFilters;
  const [ hendelseTypeFilter, onHendelsesTypeChange ] = useState(initHendelseTypeFilter);
  const [ tekstFilter, onTekstFilterChange ] = useState('');

  const dispatch = useDispatch();
  const actions = {
    tildelVeileder: (liste: VeilederArbeidstaker[]) => dispatch(pushVeilederArbeidstakerForespurt(liste)),
    hentVeiledere: () => dispatch(hentVeiledere()),
  };

  const {
    personregister,
    aktivEnhet,
    aktivVeilederinfo,
    henterAlt,
    hentetIngenPersoner,
    noeErHentet,
    altFeilet,
    veiledere,
  } = getPropsFromState(useSelector((state: ApplicationState) => state));

  useEffect(() => {
    actions.hentVeiledere();
  }, [aktivEnhet.enhetId]);

  let allEvents = new Filterable<PersonregisterState>(personregister);

  if (tabType === OverviewTabType.MY_OVERVIEW) {
    allEvents = allEvents.applyFilter((v) => filterEventsOnVeileder(v, aktivVeilederinfo.ident));
  }

  const filteredEvents = new Filterable<PersonregisterState>({...allEvents.value})
    .applyFilter((v) => filtrerPersonregister(v, hendelseTypeFilter))
    .applyFilter((v) => filtrerPaaFodselsnummerEllerNavn(v, tekstFilter));

  return (
    <div>
      {info(altFeilet, hentetIngenPersoner)}
      {henterAlt && <AppSpinner />}
      {noeErHentet && (
        <OversiktContainerInnhold>
          <SokeresultatFiltre>
              <TekstFilterStyled
                  onFilterChange={onTekstFilterChange}
              />
              <HendelseFilterStyled
                  onFilterChange={onHendelsesTypeChange}
                  personRegister={allEvents.value}
                  tabType={tabType}
              />
          </SokeresultatFiltre >
          <Sokeresultat
            tildelVeileder={actions.tildelVeileder}
            aktivEnhet={aktivEnhet}
            aktivVeilederinfo={aktivVeilederinfo}
            personregister={filteredEvents.value}
            veiledere={veiledere}
            tabType={tabType}
          />
        </OversiktContainerInnhold>
      )}
    </div>
  );
};

const getPropsFromState = (state: ApplicationState) => ({
  personregister: state.personregister,
  aktivEnhet: state.veilederenheter.aktivEnhet,
  aktivEnhetFeilet: state.veilederenheter.hentingFeilet,
  aktivVeilederinfo: state.veilederinfo.data,
  henterAlt: state.veilederenheter.henter || state.veilederinfo.henter || state.personoversikt.henter,
  noeErHentet: state.veilederenheter.hentet && state.veilederinfo.hentet && state.personoversikt.hentet,
  altFeilet: state.veilederinfo.hentingFeilet || state.personoversikt.hentingFeilet,
  veiledere: state.veiledere.data,
  hentetIngenPersoner: state.personoversikt.hentet && state.personoversikt.data.length === 0,
});
