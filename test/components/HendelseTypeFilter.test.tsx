import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import React from 'react';
import { Checkbox } from 'nav-frontend-skjema';
import {
  HendelseTekster,
  HendelseTypeFilter,
} from '../../src/components/HendelseTypeFilter';
import { mount } from 'enzyme';
import { QueryClient, QueryClientProvider } from 'react-query';

chai.use(chaiEnzyme());
const expect = chai.expect;

describe('SokeresultatFilter', () => {
  const queryClient = new QueryClient();

  it('Skal inneholde checkbokser med riktige labels', () => {
    const component = mount(
      <QueryClientProvider client={queryClient}>
        <HendelseTypeFilter />
      </QueryClientProvider>
    );

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
});
