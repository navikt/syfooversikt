import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { shallow, configure } from 'enzyme';
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
import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });

chai.use(chaiEnzyme());
const expect = chai.expect;

const emptyBlock = () => {
  // empty
};

describe('Sokeresultat', () => {
  const component = shallow(
    <Sokeresultat
      tabType={OverviewTabType.ENHET_OVERVIEW}
      aktivEnhetId={enhet.enhetId}
      aktivVeilederinfo={veilederinfo}
      personregister={personregister}
      tildelVeileder={emptyBlock}
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
          buttonHandler={emptyBlock}
          checkAllHandler={emptyBlock}
          veiledere={veiledere}
          markertePersoner={markertePersoner}
          setPageInfo={emptyBlock}
        />
      )
    );
  });
  it('Skal inneholde liste av personer', () => {
    expect(component.find(Personliste)).to.have.length(1);
  });
});
