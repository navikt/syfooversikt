import React, { ReactElement } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Side from '../sider/Side';
import Decorator from '../decorator/Decorator';
import OversiktContainer from '@/containers/OversiktContainer';
import { OverviewTabType } from '@/konstanter';
import ErrorBoundary from '@/components/error/ErrorBoundary';

export const minOversiktRoutePathRoutePath = '/minoversikt';
export const enhetOversiktRoutePath = '/enhet';

const AppRouter = (): ReactElement => {
  return (
    <BrowserRouter basename="/">
      <>
        <Decorator />
        <Side tittel="Sykefraværsoppfølging">
          <ErrorBoundary>
            <Routes>
              <Route
                path={enhetOversiktRoutePath}
                element={
                  <OversiktContainer tabType={OverviewTabType.ENHET_OVERVIEW} />
                }
              />
              <Route
                path={minOversiktRoutePathRoutePath}
                element={
                  <OversiktContainer tabType={OverviewTabType.MY_OVERVIEW} />
                }
              />
              <Route
                path="*"
                element={<Navigate to={enhetOversiktRoutePath} />}
              />
            </Routes>
          </ErrorBoundary>
        </Side>
      </>
    </BrowserRouter>
  );
};

export default AppRouter;
