import React, { ReactElement, useEffect } from 'react';
import { usePersonregisterQuery } from '@/data/personregisterHooks';
import { usePersonoversiktQuery } from '@/data/personoversiktHooks';
import AppSpinner from '@/components/AppSpinner';
import { Oversikt } from '@/containers/Oversikt';
import { NavigationBar } from '@/components/NavigationBar';
import { NotificationBar } from '@/components/error/NotificationBar';
import ErrorBoundary from '@/components/error/ErrorBoundary';
import * as Amplitude from '@/utils/amplitude';
import { EventType } from '@/utils/amplitude';
import { Flexjar } from '@/components/flexjar/Flexjar';
import { StoreKey, useLocalStorageState } from '@/hooks/useLocalStorageState';
import { getWeeksBetween } from '@/utils/dateUtils';
import { useFeatureToggles } from '@/data/unleash/unleashQueryHooks';
import { TabType, useTabType } from '@/hooks/useTabType';

function logPageView(tab: TabType) {
  Amplitude.logEvent({
    type: EventType.PageView,
    data: { url: window.location.href, sidetittel: toReadableString(tab) },
  });
}

function toReadableString(overviewTabType: TabType): string {
  switch (overviewTabType) {
    case TabType.ENHETENS_OVERSIKT:
      return 'Enhetens oversikt';
    case TabType.MIN_OVERSIKT:
      return 'Min oversikt';
    case TabType.SOK_SYKMELDT:
      return 'Søk sykmeldt';
  }
}

const OversiktContainer = (): ReactElement => {
  const personregisterQuery = usePersonregisterQuery();
  const personoversiktQuery = usePersonoversiktQuery();
  const { toggles } = useFeatureToggles();
  const { selectedTab } = useTabType();
  const [feedbackDate] = useLocalStorageState<Date | null>(
    StoreKey.FLEXJAR_ARENABRUK_FEEDBACK_DATE,
    null
  );
  const showFlexjar =
    toggles.isFlexjarArenaEnabled &&
    (feedbackDate === null || getWeeksBetween(new Date(), feedbackDate) >= 8);

  useEffect(() => {
    logPageView(selectedTab);
  }, [selectedTab]);

  const ContainerContent = (): ReactElement => {
    if (personoversiktQuery.isInitialLoading) {
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
      <div className="flex flex-col mx-8">
        <NotificationBar />
        <NavigationBar />
        <ContainerContent />
        {showFlexjar && personoversiktQuery.isSuccess && (
          <Flexjar side={toReadableString(selectedTab)} />
        )}
      </div>
    </ErrorBoundary>
  );
};

export default OversiktContainer;
