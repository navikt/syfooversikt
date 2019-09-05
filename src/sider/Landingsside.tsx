import React from 'react';
import { Route, Switch, Redirect } from 'react-router';
import OversiktContainer from '../containers/OversiktContainer';
import { OverviewTabType } from '../konstanter';
import HeaderWrapper from '../components/HeaderWrapper';
import LandingssideHeader from '../components/LandingssideHeader';
import NavigationBar from '../components/NavigationBar';

export const Landingsside = () => (
      <div>
        <HeaderWrapper>
          <LandingssideHeader />
          <NavigationBar />
        </HeaderWrapper>
        <Switch>
          <Route exact path={'/enhet'} render={() => <OversiktContainer type={OverviewTabType.ENHET_OVERVIEW} />} />
          <Route exact path={'/minoversikt'} render={() => <OversiktContainer type={OverviewTabType.MY_OVERVIEW} />} />
          <Redirect exact from="/" to="/enhet" />
        </Switch>
      </div>
);
