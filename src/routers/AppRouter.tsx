import React from 'react';
import { Route, Switch } from 'react-router';
import { Landingsside } from '../sider/Landingsside';
import ManglerTilgangside from '../sider/ManglerTilgangside';
import { BrowserRouter } from 'react-router-dom';
import Side from '../sider/Side';

const AppRouter = () => {
  return (<BrowserRouter basename="/">
    <Side tittel="Sykefraværsoppfølging">
      <Switch>
        <Route exact path="/na" component={ManglerTilgangside} />
        <Route component={Landingsside} />
      </Switch>
    </Side>
  </BrowserRouter>);
};

export default AppRouter;
