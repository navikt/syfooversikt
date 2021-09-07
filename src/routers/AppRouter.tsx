import React, { ReactElement } from 'react';
import { Redirect, Route, Switch } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import Side from '../sider/Side';
import { ManglerTilgangsside } from '@/sider/ManglerTilgangside';
import Decorator from '../decorator/Decorator';
import { ChangelogWrapper } from '@/components/changelog/ChangelogWrapper';
import OversiktContainer from '@/containers/OversiktContainer';
import { OverviewTabType } from '@/konstanter';
import { AktivEnhetProvider } from '@/context/aktivEnhet/AktivEnhetContext';
import { FilterProvider } from '@/context/filters/FilterContext';
import { TabTypeProvider } from '@/context/tab/TabTypeContext';
import { ErrorHandler } from '@/components/ErrorHandler';

const AppRouter = (): ReactElement => {
  return (
    <BrowserRouter basename="/">
      <>
        <TabTypeProvider>
          <AktivEnhetProvider>
            <FilterProvider>
              <Decorator />
              <Side tittel="Sykefraværsoppfølging">
                <ErrorHandler>
                  <Switch>
                    <Route exact path="/na" component={ManglerTilgangsside} />
                    <Route
                      exact
                      path={'/enhet'}
                      render={() => (
                        <OversiktContainer
                          tabType={OverviewTabType.ENHET_OVERVIEW}
                        />
                      )}
                    />
                    <Route
                      exact
                      path={'/minoversikt'}
                      render={() => (
                        <OversiktContainer
                          tabType={OverviewTabType.MY_OVERVIEW}
                        />
                      )}
                    />
                    <Redirect exact from="/" to="/enhet" />
                  </Switch>
                </ErrorHandler>
              </Side>

              <ChangelogWrapper />
            </FilterProvider>
          </AktivEnhetProvider>
        </TabTypeProvider>
      </>
    </BrowserRouter>
  );
};

export default AppRouter;
