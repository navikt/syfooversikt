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
import SokeresultatFilter from '../components/HendelseTypeFilter';
import {
  Filterable,
  filtrerPersonregister,
  filtrerPaaFodselsnummerEllerNavn,
  filterEventsOnVeileder,
  filterOnBirthDates,
  filterOnCompany,
  filterOnEnhet,
} from '../utils/hendelseFilteringUtils';
import TekstFilter from '../components/TekstFilter';
import { ApplicationState } from '../store';
import { AlertStripeRod } from '../components/AlertStripeAdvarsel';
import { AlertStripeWarning } from '../components/AlertStripeWarning';
import { OverviewTabType } from '../konstanter';
import { hentVeiledere } from '../store/veiledere/veiledere_actions';
import PersonFilter from '../components/PersonFilter';
import ClearFilters from '../components/filters/ClearFilters';
import { resetAllFilters } from '../store/filters/filter_actions';

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

const SokeresultatFiltre = styled.div`
  margin-right: 2rem;
  width: 18em;
`;

const OversiktContainerInnhold = styled.div`
  display: flex;

  @media (max-width: 960px) {
    flex-direction: column;

    ${SokeresultatFiltre} {
      flex: 1;
      width: auto;
      margin-right: 0;
      margin-bottom: 4em;
    }
  }
`;
const TekstFilterStyled = styled(TekstFilter)`
  margin-bottom: 1rem;
`;

const HendelseFilterStyled = styled(SokeresultatFilter)`
  margin-bottom: 1rem;
`;

const ClearFiltersButton = styled(ClearFilters)`
  display: flex;
  justify-content: flex-end;
  margin-bottom: .5em;
`;

interface Props {
  tabType?: OverviewTabType;
}

export default ({ tabType = OverviewTabType.ENHET_OVERVIEW  }: Props) => {

  const [ tekstFilter, onTekstFilterChange ] = useState('');

  const dispatch = useDispatch();
  const actions = {
    tildelVeileder: (liste: VeilederArbeidstaker[]) => dispatch(pushVeilederArbeidstakerForespurt(liste)),
    hentVeiledere: () => dispatch(hentVeiledere()),
  };

  const {
    personregister,
    aktivEnhetId,
    aktivVeilederinfo,
    henterAlt,
    noeErHentet,
    altFeilet,
    veiledere,
    selectedBirthDates,
    selectedVeilederIdents,
    selectedCompanies,
    selectedHendelseTypeFilters,
  } = getPropsFromState(useSelector((state: ApplicationState) => state));

  useEffect(() => {
    actions.hentVeiledere();
  }, [aktivEnhetId]);

  useEffect(() => {
    dispatch(resetAllFilters());
  }, [tabType]);

  let allEvents = new Filterable<PersonregisterState>(personregister)
      .applyFilter((v) => filterOnEnhet(v, aktivEnhetId));

  const hentetIngenPersoner = !henterAlt && Object.keys(allEvents.value).length === 0;

  if (tabType === OverviewTabType.MY_OVERVIEW) {
    allEvents = allEvents.applyFilter((v) => filterEventsOnVeileder(v, [aktivVeilederinfo.ident]));
  } else {
    allEvents = allEvents.applyFilter((v) => filterEventsOnVeileder(v, selectedVeilederIdents));
  }

  const filteredEvents = new Filterable<PersonregisterState>({...allEvents.value})
    .applyFilter((v) => filterOnCompany(v, selectedCompanies))
    .applyFilter((v) => filterOnBirthDates(v, selectedBirthDates))
    .applyFilter((v) => filtrerPersonregister(v, selectedHendelseTypeFilters))
    .applyFilter((v) => filtrerPaaFodselsnummerEllerNavn(v, tekstFilter));

  return (
    <div>
      {info(altFeilet, hentetIngenPersoner)}
      {henterAlt && <AppSpinner />}
      {noeErHentet && (
        <OversiktContainerInnhold>
          <SokeresultatFiltre>
              <ClearFiltersButton />
              <TekstFilterStyled
                  onFilterChange={onTekstFilterChange}
              />
              <HendelseFilterStyled
                  personRegister={allEvents.value}
                  tabType={tabType}
              />

              <PersonFilter personregister={personregister} />
          </SokeresultatFiltre >
          <Sokeresultat
            tildelVeileder={actions.tildelVeileder}
            aktivEnhetId={aktivEnhetId}
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
  aktivEnhetId: state.veilederenheter.aktivEnhetId,
  aktivEnhetFeilet: state.veilederenheter.hentingFeilet,
  aktivVeilederinfo: state.veilederinfo.data,
  henterAlt: state.veilederenheter.henter || state.veilederinfo.henter || state.personoversikt.henter,
  noeErHentet: state.veilederenheter.aktivEnhetId !== '' && state.veilederinfo.hentet && state.personoversikt.hentet,
  altFeilet: state.modiacontext.hentingEnhetFeilet || state.veilederinfo.hentingFeilet || state.personoversikt.hentingFeilet,
  veiledere: state.veiledere[state.veilederenheter.aktivEnhetId] && state.veiledere[state.veilederenheter.aktivEnhetId].data || [],
  selectedBirthDates: state.filters.selectedBirthDates,
  selectedVeilederIdents: state.filters.selectedVeilederIdents,
  selectedCompanies: state.filters.selectedCompanies,
  selectedHendelseTypeFilters: state.filters.selectedHendelseType,
});
