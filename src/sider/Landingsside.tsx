import React, { ReactElement } from 'react';
import { Redirect, Route, Switch } from 'react-router';
import OversiktContainer from '../containers/OversiktContainer';
import { OverviewTabType } from '@/konstanter';
import { NavigationBar } from '@/components/NavigationBar';
import { ChangelogWrapper } from '@/components/changelog/ChangelogWrapper';

export const Landingsside = (): ReactElement => (
  <div>
    <NavigationBar />
    <Switch>
      <Route
        exact
        path={'/enhet'}
        render={() => (
          <OversiktContainer type={OverviewTabType.ENHET_OVERVIEW} />
        )}
      />
      <Route
        exact
        path={'/minoversikt'}
        render={() => <OversiktContainer type={OverviewTabType.MY_OVERVIEW} />}
      />
      <Redirect exact from="/" to="/enhet" />
    </Switch>
    <ChangelogWrapper />
  </div>
);
