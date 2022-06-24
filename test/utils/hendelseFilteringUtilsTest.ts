import { expect } from 'chai';
import { getSortedEventsFromSortingType } from '@/utils/hendelseFilteringUtils';
import {
  PersonData,
  PersonregisterState,
  Skjermingskode,
} from '@/api/types/personregisterTypes';
import { testdata } from '../data/fellesTestdata';

const createPersonDataWithName = (name: string): PersonData => {
  return {
    navn: name,
    harMotebehovUbehandlet: false,
    harDialogmotesvar: false,
    skjermingskode: testdata.skjermingskode.ingen as Skjermingskode,
    markert: false,
    harOppfolgingsplanLPSBistandUbehandlet: false,
    tildeltEnhetId: '123',
    tildeltVeilederIdent: '234',
    dialogmotekandidat: undefined,
    latestOppfolgingstilfelle: undefined,
  };
};

describe('hendelseFilteringUtils', () => {
  it('Should sort by name descending', () => {
    const personregisterState: PersonregisterState = {
      '16614407794': createPersonDataWithName('Bjarne Bjarne'),
      '09128034883': createPersonDataWithName('Camilla Camilla'),
      '16761936120': createPersonDataWithName('Agnes Agnes'),
    };
    const result = getSortedEventsFromSortingType(
      personregisterState,
      [],
      'NAME_ASC'
    );

    expect(Object.values(result)[0]?.navn).to.deep.equal('Agnes Agnes');
    expect(Object.values(result)[1]?.navn).to.deep.equal('Bjarne Bjarne');
    expect(Object.values(result)[2]?.navn).to.deep.equal('Camilla Camilla');
  });

  it('Should sort by name ascending', () => {
    const personregisterState: PersonregisterState = {
      '16614407794': createPersonDataWithName('Bjarne Bjarne'),
      '09128034883': createPersonDataWithName('Camilla Camilla'),
      '16761936120': createPersonDataWithName('Agnes Agnes'),
    };
    const result = getSortedEventsFromSortingType(
      personregisterState,
      [],
      'NAME_DESC'
    );

    expect(Object.values(result)[0]?.navn).to.deep.equal('Camilla Camilla');
    expect(Object.values(result)[1]?.navn).to.deep.equal('Bjarne Bjarne');
    expect(Object.values(result)[2]?.navn).to.deep.equal('Agnes Agnes');
  });
});
