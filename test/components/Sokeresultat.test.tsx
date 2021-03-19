import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { shallow } from 'enzyme';
import React from 'react';
import Sokeresultat from '../../src/components/Sokeresultat';
import {
  enhet,
  veilederinfo,
  personregister,
  veiledere,
  markertePersoner,
} from '../data/fellesTestdata';
import Toolbar from '../../src/components/toolbar/Toolbar';
import Personliste from '../../src/components/Personliste';
import { OverviewTabType } from '../../src/konstanter';

chai.use(chaiEnzyme());
const expect = chai.expect;

const emptyBlock = () => {
  // empty
};

describe('Sokeresultat', () => {
  // tslint:disable-next-line:no-empty
  const dummyFunksjon = () => {};

  const component = shallow(
    <Sokeresultat
      tabType={OverviewTabType.ENHET_OVERVIEW}
      aktivEnhetId={enhet.enhetId}
      aktivVeilederinfo={veilederinfo}
      personregister={personregister}
      tildelVeileder={dummyFunksjon}
      veiledere={veiledere}
    />
  );

  it('Skal inneholde knapperad', () => {
    expect(
      component.contains(
        <Toolbar
          numberOfItemsTotal={10}
          onPageChange={emptyBlock}
          tabType={OverviewTabType.ENHET_OVERVIEW}
          aktivVeilederInfo={veilederinfo}
          alleMarkert={false}
          buttonHandler={dummyFunksjon}
          checkAllHandler={dummyFunksjon}
          veiledere={veiledere}
          markertePersoner={markertePersoner}
          setPageInfo={() => {}}
        />
      )
    );
  });
  it('Skal inneholde liste av personer', () => {
    expect(component.find(Personliste)).to.have.length(1);
  });
});
