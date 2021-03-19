import React, { ReactElement } from 'react';
import { Route, Switch } from 'react-router';
import { Landingsside } from '../sider/Landingsside';
import { BrowserRouter } from 'react-router-dom';
import Side from '../sider/Side';
import { ManglerTilgangsside } from '../sider/ManglerTilgangside';

const AppRouter = (): ReactElement => {
  return (
    <BrowserRouter basename="/">
      <Side tittel="Sykefraværsoppfølging">
        <Switch>
          <Route exact path="/na" component={ManglerTilgangsside} />
          <Route component={Landingsside} />
        </Switch>
      </Side>
    </BrowserRouter>
  );
};

export default AppRouter;
