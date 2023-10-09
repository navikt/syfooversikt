import { expect } from 'chai';
import {
  filterOnPersonregister,
  getSortedEventsFromSortingType,
} from '@/utils/hendelseFilteringUtils';
import {
  PersonData,
  PersonregisterState,
  Skjermingskode,
} from '@/api/types/personregisterTypes';
import { testdata } from '../data/fellesTestdata';
import { HendelseTypeFilters } from '@/context/filters/filterContextState';

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
    aktivitetskrav: null,
    aktivitetskravSistVurdert: null,
    aktivitetskravActive: false,
    aktivitetskravVurderingFrist: null,
    harBehandlerdialogUbehandlet: false,
    harAktivitetskravVurderStansUbehandlet: false,
    huskelappActive: false,
  };
};

const defaulthendelseFilter: HendelseTypeFilters = {
  arbeidsgiverOnskerMote: false,
  onskerMote: false,
  ufordeltBruker: false,
  dialogmotekandidat: false,
  dialogmotesvar: false,
  aktivitetskrav: false,
  behandlerdialog: false,
  aktivitetskravVurderStans: false,
  huskelapp: false,
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

  describe('filterOnPersonregister', () => {
    it('Return all elements in personregister if no filter is selected', () => {
      const personregister: PersonregisterState = {
        '16614407794': createPersonDataWithName('Bjarne Bjarne'),
      };
      const filteredPersonregister = filterOnPersonregister(
        personregister,
        defaulthendelseFilter
      );

      expect(Object.keys(filteredPersonregister).length).to.equal(1);
      expect(Object.keys(filteredPersonregister)[0]).to.equal('16614407794');
    });

    it('Return no elements in personregister if no personer matches filter', () => {
      const personDataWithAktivitetskrav: PersonData = {
        ...createPersonDataWithName('Navn Navnesen'),
        aktivitetskravActive: true,
      };
      const personregister: PersonregisterState = {
        '16614407794': personDataWithAktivitetskrav,
      };
      const filterWithDialogmotesvar: HendelseTypeFilters = {
        ...defaulthendelseFilter,
        dialogmotesvar: true,
      };

      const filteredPersonregister = filterOnPersonregister(
        personregister,
        filterWithDialogmotesvar
      );

      expect(Object.keys(filteredPersonregister).length).to.equal(0);
    });

    it('Return only elements matching all active filters', () => {
      const personDataWithAktivitetskrav: PersonData = {
        ...createPersonDataWithName('Fox Mulder'),
        aktivitetskravActive: true,
      };
      const personDataWithMotebehovAndAktivitetskrav: PersonData = {
        ...createPersonDataWithName('Dana Scully'),
        harMotebehovUbehandlet: true,
        aktivitetskravActive: true,
      };
      const personregister: PersonregisterState = {
        '16614407794': personDataWithAktivitetskrav,
        '09128034883': personDataWithMotebehovAndAktivitetskrav,
      };
      const filterWithMotebehovAndAktivitetskrav: HendelseTypeFilters = {
        ...defaulthendelseFilter,
        onskerMote: true,
        aktivitetskrav: true,
      };

      const filteredPersonregister = filterOnPersonregister(
        personregister,
        filterWithMotebehovAndAktivitetskrav
      );

      expect(Object.keys(filteredPersonregister).length).to.equal(1);
      expect(Object.keys(filteredPersonregister)[0]).to.equal('09128034883');
    });
  });
});
