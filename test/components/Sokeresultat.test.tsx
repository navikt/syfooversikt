import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { mount } from 'enzyme';
import React from 'react';
import Sokeresultat from '../../src/components/Sokeresultat';
import { markertePersoner, personregister } from '../data/fellesTestdata';
import Toolbar from '../../src/components/toolbar/Toolbar';
import { QueryClient, QueryClientProvider } from 'react-query';
import Personliste from '../../src/components/Personliste';
import { Filterable } from '@/utils/hendelseFilteringUtils';
import { AktivEnhetProvider } from '@/context/aktivEnhet/AktivEnhetContext';
import { NotificationProvider } from '@/context/notification/NotificationContext';
import { stubAktivVeileder } from '../stubs/stubAktivVeileder';

chai.use(chaiEnzyme());
const expect = chai.expect;

const emptyBlock = () => {
  // empty
};

describe('Sokeresultat', () => {
  const queryClient = new QueryClient();
  stubAktivVeileder();

  const component = mount(
    <NotificationProvider>
      <QueryClientProvider client={queryClient}>
        <AktivEnhetProvider>
          <Sokeresultat allEvents={new Filterable(personregister)} />
        </AktivEnhetProvider>
      </QueryClientProvider>
    </NotificationProvider>
  );

  it('Skal inneholde knapperad', () => {
    expect(
      component.contains(
        <Toolbar
          numberOfItemsTotal={10}
          onPageChange={emptyBlock}
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
