import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import React from 'react';
import { Checkbox } from 'nav-frontend-skjema';
import { Provider } from 'react-redux';
import {
  HendelseTekster,
  HendelseTypeFilter,
} from '../../src/components/HendelseTypeFilter';
import { store } from '../../src/store';
import { mount } from 'enzyme';

chai.use(chaiEnzyme());
const expect = chai.expect;

describe('SokeresultatFilter', () => {
  const component = mount(
    <Provider store={store}>
      <HendelseTypeFilter />
    </Provider>
  );

  it('Skal inneholde checkbokser med riktige labels', () => {
    expect(
      component.contains(<Checkbox label={'Ønsker møte'} checked={false} />)
    );
    expect(
      component.contains(
        <Checkbox label={'Svar møteplanlegger'} checked={false} />
      )
    );
    expect(
      component.contains(
        <Checkbox label={'Ufordelte brukere'} checked={false} />
      )
    );
    expect(
      component.contains(
        <Checkbox
          label={HendelseTekster.ARBEIDSGIVER_BISTAND}
          checked={false}
        />
      )
    );
  });

  // TODO: test click handling?
});
