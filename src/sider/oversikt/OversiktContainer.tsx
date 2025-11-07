import React, { ReactElement } from 'react';
import { useGetPersonSkjermingskodeQuery } from '@/data/personregisterHooks';
import { useGetPersonstatusQuery } from '@/data/personoversiktHooks';
import AppSpinner from '@/components/AppSpinner';
import NavigationBar from '@/components/NavigationBar';
import ErrorBoundary from '@/components/error/ErrorBoundary';
import { ArenaFlexjar } from '@/components/flexjar/ArenaFlexjar';
import { StoreKey, useLocalStorageState } from '@/hooks/useLocalStorageState';
import { getWeeksBetween } from '@/utils/dateUtils';
import { useGetFeatureToggles } from '@/data/unleash/unleashQueryHooks';
import { TabType, useTabType } from '@/hooks/useTabType';
import Oversikt from '@/sider/oversikt/Oversikt';
import NotificationBar from '@/components/error/NotificationBar';
import RutingFlexjar from '@/components/flexjar/RutingFlexjar';

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
  const personregisterQuery = useGetPersonSkjermingskodeQuery();
  const getPersonstatusQuery = useGetPersonstatusQuery();
  const { toggles } = useGetFeatureToggles();
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

  return (
    <ErrorBoundary>
      <div className="flex flex-col mx-8">
        <NavigationBar />
        <NotificationBar />
        {getPersonstatusQuery.isLoading ? (
          <AppSpinner />
        ) : (
          <Oversikt
            personSkjermingskode={personregisterQuery.data || []}
            personoversiktData={getPersonstatusQuery.data || []}
          />
        )}
        {showArenaFlexjar && getPersonstatusQuery.isSuccess && (
          <ArenaFlexjar side={toReadableString(selectedTab)} />
        )}
        {showRutingFlexjar && getPersonstatusQuery.isSuccess && (
          <RutingFlexjar side={toReadableString(selectedTab)} />
        )}
      </div>
    </ErrorBoundary>
  );
}
