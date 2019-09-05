import React, {
  useEffect,
} from 'react';
import {
  useDispatch,
  useSelector,
} from 'react-redux';
import { AlertStripeRod } from '../components/AlertStripeAdvarsel';
import { ApplicationState } from '../store';
import { hentPersonoversiktForespurt } from '../store/personoversikt/personoversikt_actions';
import { hentVeilederenheter } from '../store/veilederenheter/veilederenheter_actions';
import EnhetensOversiktContainer from './EnhetensOversiktContainer';
import { OverviewTabType } from '../konstanter';
import { Container } from 'nav-frontend-grid';

const tekster = {
  overskrifter: {
    minOversikt: 'Denne fanen er under utvikling',
    veilederoversikt: 'Denne fanen er under utvikling',
  },
  feil: {
    hentVeilederenheterFeilet: 'Det skjedde en feil: Kunne ikke hente dine enheter',
  },
};

interface OversiktProps {
  type: string;
}

const getPropsFromState = (
    {
      personoversikt,
      personregister,
      veilederenheter,
      veilederinfo,
    }: ApplicationState) => ({
  personregister,
  aktivEnhet: veilederenheter.aktivEnhet,
  aktivEnhetFeilet: veilederenheter.hentingFeilet,
  aktivVeilederinfo: veilederinfo.data,
  henterAlt: veilederenheter.henter || veilederinfo.henter || personoversikt.henter,
  noeErHentet: veilederenheter.hentet && veilederinfo.hentet && personoversikt.hentet,
  altFeilet: veilederinfo.hentingFeilet || personoversikt.hentingFeilet,
});

const OversiktContainer = ({ type }: OversiktProps) => {

  const {
    aktivEnhet,
    aktivEnhetFeilet,
  } = getPropsFromState(useSelector((state: ApplicationState) => state));

  const dispatch = useDispatch();
  const actions = {
    hentPersonoversiktForespurt: () => dispatch(hentPersonoversiktForespurt()),
    hentVeilederenheter: () => dispatch(hentVeilederenheter()),
  };

  useEffect(() => {
    actions.hentVeilederenheter();
  }, []);

  useEffect(() => {
    actions.hentPersonoversiktForespurt();
  }, [aktivEnhet.enhetId]);

  return (
    <Container>
      {aktivEnhetFeilet && (
        <AktivEnhetFeiletError />
      )}
      {!aktivEnhetFeilet && (
        <EnhetensOversiktContainer tabType={type as OverviewTabType} />
      )}
    </Container>
  );
};

const AktivEnhetFeiletError = () => (AlertStripeRod(
  tekster.feil.hentVeilederenheterFeilet,
  'oversiktContainer__alertstripe'
));

export default OversiktContainer;
