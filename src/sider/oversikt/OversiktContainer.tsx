import React, { ReactElement, useEffect } from 'react';
import { usePersonregisterQuery } from '@/data/personregisterHooks';
import { usePersonoversiktQuery } from '@/data/personoversiktHooks';
import AppSpinner from '@/components/AppSpinner';
import NavigationBar from '@/components/NavigationBar';
import ErrorBoundary from '@/components/error/ErrorBoundary';
import * as Amplitude from '@/utils/amplitude';
import { EventType } from '@/utils/amplitude';
import { ArenaFlexjar } from '@/components/flexjar/ArenaFlexjar';
import { StoreKey, useLocalStorageState } from '@/hooks/useLocalStorageState';
import { getWeeksBetween } from '@/utils/dateUtils';
import { useFeatureToggles } from '@/data/unleash/unleashQueryHooks';
import { TabType, useTabType } from '@/hooks/useTabType';
import Oversikt from '@/sider/oversikt/Oversikt';
import NotificationBar from '@/components/error/NotificationBar';
import RutingFlexjar from '@/components/flexjar/RutingFlexjar';

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

export default function OversiktContainer(): ReactElement {
  const personregisterQuery = usePersonregisterQuery();
  const personoversiktQuery = usePersonoversiktQuery();
  const { toggles } = useFeatureToggles();
  const { selectedTab } = useTabType();
  const [feedbackArenaDate] = useLocalStorageState<Date | null>(
    StoreKey.FLEXJAR_ARENABRUK_FEEDBACK_DATE,
    null
  );
  const [feedbackRutingDate] = useLocalStorageState<Date | null>(
    StoreKey.FLEXJAR_RUTING_FEEDBACK_DATE,
    null
  );
  const showArenaFlexjar =
    toggles.isFlexjarArenaEnabled &&
    (feedbackArenaDate === null ||
      getWeeksBetween(new Date(), feedbackArenaDate) >= 8);
  const showRutingFlexjar =
    toggles.isRutingFlexjarEnabled &&
    (feedbackRutingDate === null ||
      getWeeksBetween(new Date(), feedbackRutingDate) >= 8);

  useEffect(() => {
    logPageView(selectedTab);
  }, [selectedTab]);

  return (
    <ErrorBoundary>
      <div className="flex flex-col mx-8">
        <NavigationBar />
        <NotificationBar />
        {personoversiktQuery.isLoading ? (
          <AppSpinner />
        ) : (
          <Oversikt
            personregisterData={personregisterQuery.data || []}
            personoversiktData={personoversiktQuery.data || []}
          />
        )}
        {showArenaFlexjar && personoversiktQuery.isSuccess && (
          <ArenaFlexjar side={toReadableString(selectedTab)} />
        )}
        {showRutingFlexjar && personoversiktQuery.isSuccess && (
          <RutingFlexjar side={toReadableString(selectedTab)} />
        )}
      </div>
    </ErrorBoundary>
  );
}
