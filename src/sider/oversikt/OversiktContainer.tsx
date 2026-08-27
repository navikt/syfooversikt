import React, { ReactElement } from "react";
import { useGetPersonSkjermingskodeQuery } from "@/data/personregisterHooks";
import { useGetPersonstatusQuery } from "@/data/personoversiktHooks";
import AppSpinner from "@/components/AppSpinner";
import NavigationBar from "@/components/NavigationBar";
import ErrorBoundary from "@/components/error/ErrorBoundary";
import Oversikt from "@/sider/oversikt/Oversikt";
import NotificationBar from "@/components/error/NotificationBar";

export default function OversiktContainer(): ReactElement {
  const personregisterQuery = useGetPersonSkjermingskodeQuery();
  const getPersonstatusQuery = useGetPersonstatusQuery();

  return (
    <ErrorBoundary>
      <div className="flex flex-col mx-8">
        <NavigationBar />
        <NotificationBar />
        {getPersonstatusQuery.isLoading && !getPersonstatusQuery.isFetched ? (
          <AppSpinner />
        ) : (
          <Oversikt
            personSkjermingskode={personregisterQuery.data || []}
            personoversiktData={getPersonstatusQuery.data || []}
          />
        )}
      </div>
    </ErrorBoundary>
  );
}
