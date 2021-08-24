import React from 'react';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { mount } from 'enzyme';
import Personliste from '../../src/components/Personliste';
import { Personrad } from '../../src/components/Personrad';
import { personregister } from '../data/fellesTestdata';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AktivEnhetProvider } from '../../src/context/aktivEnhet/AktivEnhetContext';

chai.use(chaiEnzyme());
const expect = chai.expect;

describe('Personliste', () => {
  const queryClient = new QueryClient();
  const markertePersoner = ['123', '234'];
  const checkboxHandler = () => void 0;

  it('Skal rendre 2 personrader', () => {
    const component = mount(
      <QueryClientProvider client={queryClient}>
        <AktivEnhetProvider>
          <Personliste
            personregister={personregister}
            checkboxHandler={checkboxHandler}
            markertePersoner={markertePersoner}
            startItem={0}
            endItem={1}
            sortingType={'FNR_DESC'}
          />
        </AktivEnhetProvider>
      </QueryClientProvider>
    );

    expect(component.find(Personrad)).to.have.length(2);
  });
});
