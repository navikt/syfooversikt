import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { shallow } from 'enzyme';
import React from 'react';
import { Column } from 'nav-frontend-grid';
import { firstCompanyNameFromPersonData } from '../../src/utils/personDataUtil';
import { testdata, veiledere } from '../data/fellesTestdata';
import { Skjermingskode } from '../../src/api/types/personregisterTypes';
import { Personrad, StyledPersonRad } from '../../src/components/Personrad';
import Lenke from 'nav-frontend-lenker';
import { formaterNavn } from '../../src/utils/lenkeUtil';

chai.use(chaiEnzyme());
const expect = chai.expect;

describe('Personrad', () => {
  const fnr = testdata.fnr1;
  const personData = {
    navn: testdata.navn1,
    harMotebehovUbehandlet: false,
    harMoteplanleggerUbehandlet: false,
    skjermingskode: testdata.skjermingskode.ingen as Skjermingskode,
    markert: false,
    harOppfolgingsplanLPSBistandUbehandlet: false,
    tildeltEnhetId: '123',
    tildeltVeilederIdent: '234',
    oppfolgingstilfeller: [],
  };
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const checkboxHandler = () => {};
  const component = shallow(
    <Personrad
      index={1}
      fnr={fnr}
      veilederName={`${veiledere[0].etternavn}, ${veiledere[0].fornavn}`}
      personData={personData}
      checkboxHandler={checkboxHandler}
      kryssAv={false}
    />
  );

  it('Skal inneholde PersonRad', () => {
    expect(component.find(StyledPersonRad)).to.have.length(1);
  });

  it('Skal rendre Column-komponenter med riktig navn, fodselsnummer og skjermingskode', () => {
    expect(
      component.contains(
        <Column xs={'2'}>{firstCompanyNameFromPersonData(personData)}</Column>
      )
    ).to.equal(true);
    expect(
      component.find(Lenke).contains(formaterNavn(personData.navn))
    ).to.equal(true);
  });
});
