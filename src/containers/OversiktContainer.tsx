import React, { ReactElement, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { AlertStripeRod } from '../components/AlertStripeAdvarsel';
import { hentPersonoversiktForespurt } from '../store/personoversikt/personoversikt_actions';
import { hentVeilederenheter } from '../store/veilederenheter/veilederenheter_actions';
import { EnhetensOversiktContainer } from './EnhetensOversiktContainer';
import { OverviewTabType } from '../konstanter';
import AppSpinner from '../components/AppSpinner';
import { OversiktData, useOversiktData } from '../store/hooks/oversiktHooks';

const tekster = {
  overskrifter: {
    minOversikt: 'Denne fanen er under utvikling',
    veilederoversikt: 'Denne fanen er under utvikling',
  },
  feil: {
    hentVeilederenheterFeilet:
      'Det skjedde en feil: Kunne ikke hente dine enheter',
  },
};

const Container = styled.div`
  width: calc(100% - 10%);
  margin: auto;
`;

interface OversiktProps {
  type: string;
}

const OversiktContainer = ({ type }: OversiktProps): ReactElement => {
  const dispatch = useDispatch();
  const oversiktData: OversiktData = useOversiktData();

  useEffect(() => {
    dispatch(hentVeilederenheter());
    dispatch(hentPersonoversiktForespurt(oversiktData.aktivEnhet));
  }, [oversiktData.aktivEnhet]);

  return (
    <Container>
      {oversiktData.hentingEnhetFeilet &&
        AlertStripeRod(
          tekster.feil.hentVeilederenheterFeilet,
          'oversiktContainer__alertstripe'
        )}
      <AppSpinner laster={oversiktData.laster}>
        <EnhetensOversiktContainer tabType={type as OverviewTabType} />
      </AppSpinner>
    </Container>
  );
};

export default OversiktContainer;
