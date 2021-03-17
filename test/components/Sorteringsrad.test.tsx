import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { shallow } from 'enzyme';
import React from 'react';
import Sorteringsrad, {
  SortingButton,
} from '../../src/components/Sorteringsrad';

chai.use(chaiEnzyme());
const expect = chai.expect;

describe('Sorteringsrad', () => {
  const kolonneForVeilederTekst = 'Veileder';
  const component = shallow(<Sorteringsrad onSortClick={(type) => {}} />);

  it('Skal rendre navn, fodselsnummer, veilederident og veiledernavn Column-komponenter', () => {
    expect(component.find(SortingButton)).to.have.length(4);
    expect(component.contains(kolonneForVeilederTekst)).to.equal(true);
  });
});
