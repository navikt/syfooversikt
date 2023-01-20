import React, { ReactElement, useEffect } from 'react';
import styled from 'styled-components';
import { usePersonregisterQuery } from '@/data/personregisterHooks';
import { usePersonoversiktQuery } from '@/data/personoversiktHooks';
import AppSpinner from '@/components/AppSpinner';
import { Oversikt } from '@/containers/Oversikt';
import { OverviewTabType } from '@/konstanter';
import { NavigationBar } from '@/components/NavigationBar';
import { useTabType } from '@/context/tab/TabTypeContext';
import { ErrorBoundary } from '@/components/error/ErrorBoundary';
import { NotificationBar } from '@/components/error/NotificationBar';

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
  const personregisterQuery = usePersonregisterQuery();
  const personoversiktQuery = usePersonoversiktQuery();
  const { setTabType } = useTabType();

  useEffect(() => {
    setTabType(tabType);
  }, [setTabType, tabType]);

  const ContainerContent = (): ReactElement => {
    if (
      personoversiktQuery.isInitialLoading ||
      personregisterQuery.isInitialLoading
    ) {
      return <AppSpinner />;
    }

    return (
      <Oversikt
        personregisterData={personregisterQuery.data || []}
        personoversiktData={personoversiktQuery.data || []}
      />
    );
  };

  return (
    <ErrorBoundary context={'oversiktContainer'}>
      <Container>
        <NotificationBar />
        <NavigationBar />
        <ContainerContent />
      </Container>
    </ErrorBoundary>
  );
};

export default OversiktContainer;
