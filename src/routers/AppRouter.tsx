import React, { ReactElement } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Side from '../sider/Side';
import { ManglerTilgangsside } from '@/sider/ManglerTilgangside';
import Decorator from '../decorator/Decorator';
import OversiktContainer from '@/containers/OversiktContainer';
import { OverviewTabType } from '@/konstanter';
import { ChangelogWrapper } from '@/components/changelog/ChangelogWrapper';
import { ErrorBoundary } from '@/components/error/ErrorBoundary';

const AppRouter = (): ReactElement => {
  return (
    <BrowserRouter basename="/">
      <>
        <Decorator />
        <Side tittel="Sykefraværsoppfølging">
          <ErrorBoundary context="appRouter">
            <Routes>
              <Route path="/na" element={ManglerTilgangsside} />
              <Route
                path={'/enhet'}
                element={
                  <OversiktContainer tabType={OverviewTabType.ENHET_OVERVIEW} />
                }
              />
              <Route
                path={'/minoversikt'}
                element={
                  <OversiktContainer tabType={OverviewTabType.MY_OVERVIEW} />
                }
              />
              <Route path="/" element={<Navigate to="/enhet" />} />
            </Routes>
          </ErrorBoundary>
        </Side>
        <ChangelogWrapper />
      </>
    </BrowserRouter>
  );
};

export default AppRouter;
