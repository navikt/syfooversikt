import React, { ReactElement } from 'react';
import { Redirect, Route, Switch } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
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
            <Switch>
              <Route exact path="/na" component={ManglerTilgangsside} />
              <Route
                exact
                path={'/enhet'}
                render={() => (
                  <OversiktContainer tabType={OverviewTabType.ENHET_OVERVIEW} />
                )}
              />
              <Route
                exact
                path={'/minoversikt'}
                render={() => (
                  <OversiktContainer tabType={OverviewTabType.MY_OVERVIEW} />
                )}
              />
              <Redirect exact from="/" to="/enhet" />
            </Switch>
          </ErrorBoundary>
        </Side>
        <ChangelogWrapper />
      </>
    </BrowserRouter>
  );
};

export default AppRouter;
