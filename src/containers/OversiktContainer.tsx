import React, { ReactElement, useEffect } from 'react';
import styled from 'styled-components';
import { AlertStripeRod } from '@/components/AlertStripe/AlertStripeAdvarsel';
import { usePersonregisterQuery } from '@/data/personregisterHooks';
import { usePersonoversiktQuery } from '@/data/personoversiktHooks';
import {
  useAktivVeilederQuery,
  useVeiledereQuery,
} from '@/data/veiledereQueryHooks';
import AppSpinner from '@/components/AppSpinner';
import { Oversikt } from '@/containers/Oversikt';
import { OverviewTabType } from '@/konstanter';
import { NavigationBar } from '@/components/NavigationBar';
import { useTabType } from '@/context/tab/TabTypeContext';

const tekster = {
  hentEnhetensOversiktFeilet:
    'Det skjedde en feil: Kunne ikke hente enhetens oversikt',
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: calc(100% - 10%);
  margin: auto;
`;

interface Props {
  tabType: OverviewTabType;
}

const OversiktContainer = ({ tabType }: Props): ReactElement => {
  const aktivVeilederQuery = useAktivVeilederQuery();
  const veiledereQuery = useVeiledereQuery();
  const personregisterQuery = usePersonregisterQuery();
  const personoversiktQuery = usePersonoversiktQuery();
  const { setTabType } = useTabType();

  useEffect(() => {
    setTabType(tabType);
  }, [setTabType, tabType]);

  const isError =
    aktivVeilederQuery.isError ||
    veiledereQuery.isError ||
    personregisterQuery.isError ||
    personoversiktQuery.isError;

  const isLoading =
    aktivVeilederQuery.isLoading ||
    veiledereQuery.isLoading ||
    personregisterQuery.isLoading ||
    personoversiktQuery.isLoading;

  const ContainerContent = (): ReactElement => {
    if (isError) {
      return AlertStripeRod(
        tekster.hentEnhetensOversiktFeilet,
        'oversiktContainer__alertstripe'
      );
    }

    if (isLoading) {
      return <AppSpinner />;
    }

    if (personoversiktQuery.isSuccess && aktivVeilederQuery.isSuccess) {
      return (
        <Oversikt
          personregisterData={personregisterQuery.data || []}
          personoversiktData={personoversiktQuery.data || []}
          aktivVeilederData={aktivVeilederQuery.data}
        />
      );
    }

    return <></>;
  };

  return (
    <Container>
      <NavigationBar />
      <ContainerContent />
    </Container>
  );
};

export default OversiktContainer;
