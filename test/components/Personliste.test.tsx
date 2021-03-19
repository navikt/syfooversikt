import React from 'react';
import { Provider } from 'react-redux';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { mount } from 'enzyme';
import Personliste from '../../src/components/Personliste';
import { Personrad } from '../../src/components/Personrad';
import {
  enhet,
  modiacontextNyAktivEnhet,
  personregister,
  veiledere,
} from '../data/fellesTestdata';
import { store } from '../../src/store';
import { veiledereHentet } from '../../src/store/veiledere/veiledere_actions';
import { modiaContextPushet } from '../../src/store/modiacontext/modiacontext_actions';

chai.use(chaiEnzyme());
const expect = chai.expect;

store.dispatch(veiledereHentet(enhet.enhetId, veiledere));
store.dispatch(modiaContextPushet(modiacontextNyAktivEnhet));

describe('Personliste', () => {
  const markertePersoner = ['123', '234'];
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const checkboxHandler = () => {};
  const component = mount(
    <Provider store={store}>
      <Personliste
        personregister={personregister}
        checkboxHandler={checkboxHandler}
        markertePersoner={markertePersoner}
        veiledere={veiledere}
        startItem={0}
        endItem={1}
      />
    </Provider>
  );

  it('Skal rendre 2 personrader', () => {
    expect(component.find(Personrad)).to.have.length(2);
  });
});
