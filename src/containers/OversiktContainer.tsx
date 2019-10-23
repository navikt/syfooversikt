import React, {
  useEffect,
} from 'react';
import {
  useDispatch,
  useSelector,
} from 'react-redux';
import styled from 'styled-components';
import { AlertStripeRod } from '../components/AlertStripeAdvarsel';
import { ApplicationState } from '../store';
import { hentPersonoversiktForespurt } from '../store/personoversikt/personoversikt_actions';
import { hentVeilederenheter } from '../store/veilederenheter/veilederenheter_actions';
import EnhetensOversiktContainer from './EnhetensOversiktContainer';
import { OverviewTabType } from '../konstanter';

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

const Container = styled.div`
  width: calc(100% - 10%);
  margin: auto;
`;

const getPropsFromState = (
    {
      modiacontext,
      personoversikt,
      personregister,
      veilederenheter,
      veilederinfo,
    }: ApplicationState) => ({
  personregister,
  aktivEnhetId: veilederenheter.aktivEnhetId,
  aktivEnhetFeilet: modiacontext.hentingEnhetFeilet,
  aktivVeilederinfo: veilederinfo.data,
  henterAlt: veilederenheter.henter || veilederinfo.henter || personoversikt.henter,
  noeErHentet: veilederenheter.hentet && veilederinfo.hentet && personoversikt.hentet,
  altFeilet: modiacontext.hentingEnhetFeilet || veilederinfo.hentingFeilet || personoversikt.hentingFeilet,
});

const OversiktContainer = ({ type }: OversiktProps) => {

  const {
    aktivEnhetId,
    aktivEnhetFeilet,
  } = getPropsFromState(useSelector((state: ApplicationState) => state));

  const dispatch = useDispatch();
  const actions = {
    hentPersonoversiktForespurt: (enhetId: string) => dispatch(hentPersonoversiktForespurt(enhetId)),
    hentVeilederenheter: () => dispatch(hentVeilederenheter()),
  };

  useEffect(() => {
    actions.hentVeilederenheter();
  }, []);

  useEffect(() => {
    actions.hentPersonoversiktForespurt(aktivEnhetId);
  }, [aktivEnhetId]);

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
