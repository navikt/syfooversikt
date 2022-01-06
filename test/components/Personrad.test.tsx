import React from 'react';
import { testdata, veiledere } from '../data/fellesTestdata';
import { Skjermingskode } from '@/api/types/personregisterTypes';
import { Personrad } from '@/components/Personrad';
import { render, RenderResult } from '@testing-library/react';
import { expect } from 'chai';
import { formaterNavn } from '@/utils/lenkeUtil';

const fnr = testdata.fnr1;
const personData = {
  navn: testdata.navn1,
  harMotebehovUbehandlet: false,
  harMoteplanleggerUbehandlet: false,
  skjermingskode: testdata.skjermingskode.diskresjonsmerket as Skjermingskode,
  markert: false,
  harOppfolgingsplanLPSBistandUbehandlet: false,
  tildeltEnhetId: '123',
  tildeltVeilederIdent: '234',
  oppfolgingstilfeller: [],
};
const checkboxHandler = () => void 0;
let component: RenderResult;

describe('Personrad', () => {
  beforeEach(() => {
    component = render(
      <Personrad
        index={1}
        fnr={fnr}
        veilederName={`${veiledere[0].etternavn}, ${veiledere[0].fornavn}`}
        personData={personData}
        checkboxHandler={checkboxHandler}
        kryssAv={false}
      />
    );
  });

  it('Skal rendre riktig navn, fodselsnummer og skjermingskode', () => {
    expect(component.getByRole('link', { name: formaterNavn(personData.navn) }))
      .to.exist;
    expect(component.getByText(testdata.fnr1)).to.exist;
    expect(component.getByText('diskresjonsmerket')).to.exist;
  });
});
