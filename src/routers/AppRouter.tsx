import React, { ReactElement } from 'react';
import { Redirect, Route, Switch } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import Side from '../sider/Side';
import { ManglerTilgangsside } from '@/sider/ManglerTilgangside';
import Decorator from '../decorator/Decorator';
import { ChangelogWrapper } from '@/components/changelog/ChangelogWrapper';
import OversiktContainer from '@/containers/OversiktContainer';
import { OverviewTabType } from '@/konstanter';

const AppRouter = (): ReactElement => {
  return (
    <BrowserRouter basename="/">
      <>
        <Decorator />
        <Side tittel="Sykefraværsoppfølging">
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
        </Side>
        <ChangelogWrapper />
      </>
    </BrowserRouter>
  );
};

export default AppRouter;
