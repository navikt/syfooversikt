import React, { ReactElement, useEffect } from 'react';
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
import { Flexjar } from '@/components/flexjar/Flexjar';
import { StoreKey, useLocalStorageState } from '@/hooks/useLocalStorageState';
import { getWeeksBetween } from '@/utils/dateUtils';
import { useFeatureToggles } from '@/data/unleash/unleashQueryHooks';

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
  const { toggles } = useFeatureToggles();
  const [feedbackDate] = useLocalStorageState<Date | null>(
    StoreKey.FLEXJAR_ARENABRUK_FEEDBACK_DATE,
    null
  );
  const showFlexjar =
    toggles.isFlexjarArenaEnabled &&
    (feedbackDate === null || getWeeksBetween(new Date(), feedbackDate) >= 3);

  const { setTabType } = useTabType();
  useEffect(() => {
    setTabType(tabType);
    logPageView(tabType);
  }, [setTabType, tabType]);

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
          <Flexjar side={toReadableString(tabType)} />
        )}
      </div>
    </ErrorBoundary>
  );
};

export default OversiktContainer;
