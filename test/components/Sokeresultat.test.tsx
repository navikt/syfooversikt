import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { mount } from 'enzyme';
import React from 'react';
import Sokeresultat from '../../src/components/Sokeresultat';
import {
  markertePersoner,
  personregister,
  veilederinfo,
} from '../data/fellesTestdata';
import Toolbar from '../../src/components/toolbar/Toolbar';
import { QueryClient, QueryClientProvider } from 'react-query';
import Personliste from '../../src/components/Personliste';
import { Filterable } from '../../src/utils/hendelseFilteringUtils';
import { AktivEnhetProvider } from '../../src/context/aktivEnhet/AktivEnhetContext';

chai.use(chaiEnzyme());
const expect = chai.expect;

const emptyBlock = () => {
  // empty
};

describe('Sokeresultat', () => {
  const queryClient = new QueryClient();

  const component = mount(
    <QueryClientProvider client={queryClient}>
      <AktivEnhetProvider>
        <Sokeresultat allEvents={new Filterable(personregister)} />
      </AktivEnhetProvider>
    </QueryClientProvider>
  );

  it('Skal inneholde knapperad', () => {
    expect(
      component.contains(
        <Toolbar
          numberOfItemsTotal={10}
          onPageChange={emptyBlock}
          aktivVeilederInfo={veilederinfo}
          alleMarkert={false}
          buttonHandler={emptyBlock}
          checkAllHandler={emptyBlock}
          markertePersoner={markertePersoner}
          setPageInfo={emptyBlock}
          setSortingType={() => void 0}
        />
      )
    );
  });

  it('Skal inneholde liste av personer', () => {
    expect(component.find(Personliste)).to.have.length(1);
  });
});
