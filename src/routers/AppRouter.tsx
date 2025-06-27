import React, { ReactElement } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Side from '../components/Side';
import Decorator from '../decorator/Decorator';
import OversiktContainer from '@/sider/oversikt/OversiktContainer';
import ErrorBoundary from '@/components/error/ErrorBoundary';
import SokContainer from '@/sider/sokperson/SokContainer';
import { routes } from '@/routers/routes';

export default function AppRouter(): ReactElement {
  return (
    <BrowserRouter basename="/">
      <>
        <Decorator />
        <Side tittel="Sykefraværsoppfølging">
          <ErrorBoundary>
            <Routes>
              <Route
                path={routes.ENHET_OVERSIKT}
                element={<OversiktContainer />}
              />
              <Route
                path={routes.MIN_OVERSIKT}
                element={<OversiktContainer />}
              />
              <Route path={routes.SOK_SYKMELDT} element={<SokContainer />} />
              <Route
                path="*"
                element={<Navigate to={routes.ENHET_OVERSIKT} />}
              />
            </Routes>
          </ErrorBoundary>
        </Side>
      </>
    </BrowserRouter>
  );
}
