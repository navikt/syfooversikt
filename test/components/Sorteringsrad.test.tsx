import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { shallow } from 'enzyme';
import React from 'react';
import { Column } from 'nav-frontend-grid';
import Sorteringsrad, { SortingButton } from '../../src/components/Sorteringsrad';

chai.use(chaiEnzyme());
const expect = chai.expect;

describe('Sorteringsrad', () => {
  const kolonneVirksomhetTekst = 'Virksomhet';
  const kolonneForVeilederTekst = 'Veileder';
  const component = shallow(<Sorteringsrad onSortClick={(type) => {}}/>);

  it('Skal rendre navn, fodselsnummer, veilederident og veiledernavn Column-komponenter', () => {
    expect(component.find(SortingButton)).to.have.length(3);
    expect(component.contains(<Column xs={'2'}>{kolonneForVeilederTekst}</Column>)).to.equal(true);
  });
});
