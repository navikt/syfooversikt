import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { mount } from 'enzyme';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AktivEnhetContext } from '@/context/aktivEnhet/AktivEnhetContext';
import { MemoryRouter, Route } from 'react-router-dom';
import { NotificationContext } from '@/context/notification/NotificationContext';
import OversiktContainer from '@/containers/OversiktContainer';
import { OverviewTabType } from '@/konstanter';
import { stubPersonoversikt } from '../stubs/stubPersonoversikt';
import { stubPersonregister } from '../stubs/stubPersonregister';
import { stubAktivVeileder } from '../stubs/stubAktivVeileder';
import { stubModiaContext } from '../stubs/stubModiaContext';
import { stubVeiledere } from '../stubs/stubVeiledere';
import { NotificationBar } from '@/components/error/NotificationBar';
import aktivEnhetMockData from '../../mock/data/aktivEnhet.json';
import { FetchVeiledereFailed } from '@/context/notification/Notifications';

chai.use(chaiEnzyme());
const expect = chai.expect;

describe('OversiktContainer', () => {
  const queryClient = new QueryClient();

  it('Skal vise notifikasjon ved feilende apikall', async () => {
    stubPersonoversikt();
    stubPersonregister();
    stubAktivVeileder();
    stubModiaContext();
    stubVeiledere();

    const wrapper = mount(
      <MemoryRouter initialEntries={['/enhet']}>
        <Route path="/enhet">
          <NotificationContext.Provider
            value={{
              notifications: [FetchVeiledereFailed],
              displayNotification: () => void 0,
              clearNotification: () => void 0,
            }}
          >
            <AktivEnhetContext.Provider
              value={{
                aktivEnhet: aktivEnhetMockData.aktivEnhet,
                handleAktivEnhetChanged: () => void 0,
              }}
            >
              <QueryClientProvider client={queryClient}>
                <OversiktContainer tabType={OverviewTabType.ENHET_OVERVIEW} />
              </QueryClientProvider>
            </AktivEnhetContext.Provider>
          </NotificationContext.Provider>
        </Route>
      </MemoryRouter>
    );

    const notifications = wrapper.find(NotificationBar);
    expect(notifications.text()).to.contain(FetchVeiledereFailed.message);
  });
});
