import React, { ReactElement, useEffect } from 'react';
import styled from 'styled-components';
import { usePersonregisterQuery } from '@/data/personregisterHooks';
import { usePersonoversiktQuery } from '@/data/personoversiktHooks';
import AppSpinner from '@/components/AppSpinner';
import { Oversikt } from '@/containers/Oversikt';
import { OverviewTabType } from '@/konstanter';
import { NavigationBar } from '@/components/NavigationBar';
import { useTabType } from '@/context/tab/TabTypeContext';
import { NotificationBar } from '@/components/error/NotificationBar';
import ErrorBoundary from '@/components/error/ErrorBoundary';
import * as Amplitude from '@/utils/amplitude';
import { EventType } from '@/utils/amplitude';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: calc(100% - 10%);
  margin: auto;
`;

interface Props {
  tabType: OverviewTabType;
}

function logPageView(tab: OverviewTabType) {
  Amplitude.logEvent({
    type: EventType.PageView,
    data: { url: window.location.href, sidetittel: toReadableString(tab) },
  });
}

function toReadableString(overviewTabType: OverviewTabType): string {
  switch (overviewTabType) {
    case OverviewTabType.ENHET_OVERVIEW:
      return 'Enhetens oversikt';
    case OverviewTabType.MY_OVERVIEW:
      return 'Min oversikt';
  }
}

const OversiktContainer = ({ tabType }: Props): ReactElement => {
  const personregisterQuery = usePersonregisterQuery();
  const personoversiktQuery = usePersonoversiktQuery();
  const { setTabType } = useTabType();
  useEffect(() => {
    logPageView(tabType);
  }, [tabType]);

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
    <ErrorBoundary>
      <Container>
        <NotificationBar />
        <NavigationBar />
        <ContainerContent />
      </Container>
    </ErrorBoundary>
  );
};

export default OversiktContainer;
