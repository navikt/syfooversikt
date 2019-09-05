import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { mount } from 'enzyme';
import React from 'react';
import LandingssideHeader from '../../src/components/LandingssideHeader';
import { Landingsside } from '../../src/sider/Landingsside';
import { createBrowserHistory } from 'history';
import { match, MemoryRouter} from 'react-router';
import { Provider } from 'react-redux';
import { store } from '../../src/store';

chai.use(chaiEnzyme());
const expect = chai.expect;

describe('Landingsside', () => {
  const component = mount(
    <Provider store={store}>
      <MemoryRouter>
        <Landingsside history={createBrowserHistory()} match={{ path: '/enhet', isExact: true, url: '', params: {} } as match} location={{pathname: '/enhet'} as any} staticContext={{} as any}/>
      </MemoryRouter>
    </Provider>);
  it('Skal rendre LandingssideHeader', () => {
    expect(
      component.contains(
        <LandingssideHeader />
      )
    ).to.equal(true);
  });

  it('Skal rendre Oversikt', () => {
    expect(component.find('OversiktContainer')).to.have.lengthOf(1);
  });
});
