import { expect } from 'chai';
import {
  filterOnFrist,
  filterOnPersonregister,
  FristFilterOption,
  getSortedEventsFromSortingType,
} from '@/utils/hendelseFilteringUtils';
import {
  PersonData,
  PersonregisterState,
  Skjermingskode,
} from '@/api/types/personregisterTypes';
import { testdata } from '../data/fellesTestdata';
import { HendelseTypeFilters } from '@/context/filters/filterContextState';
import { addWeeks, subWeeks } from 'date-fns';

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
    harOppfolgingsoppgave: false,
    oppfolgingsoppgaveFrist: null,
    behandlerBerOmBistandUbehandlet: false,
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
  oppfolgingsoppgave: false,
  behandlerBerOmBistand: false,
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

  describe('sort by sykefravar varighet uker', () => {
    const personWithLongestVarighet: PersonData = {
      ...createPersonDataWithName('Agnes Agnes'),
      latestOppfolgingstilfelle: {
        varighetUker: 10,
        virksomhetList: [],
        oppfolgingstilfelleStart: new Date('2023-01-01'),
        oppfolgingstilfelleEnd: new Date('2023-03-15'),
      },
    };
    const personWithShortestVarighet: PersonData = {
      ...createPersonDataWithName('Bjarne Bjarne'),
      latestOppfolgingstilfelle: {
        varighetUker: 4,
        virksomhetList: [],
        oppfolgingstilfelleStart: new Date('2023-02-01'),
        oppfolgingstilfelleEnd: new Date('2023-02-28'),
      },
    };
    const personWithEarliestTilfelleStart: PersonData = {
      ...createPersonDataWithName('Agnes Agnes'),
      latestOppfolgingstilfelle: {
        varighetUker: 8,
        virksomhetList: [],
        oppfolgingstilfelleStart: new Date('2023-01-01'),
        oppfolgingstilfelleEnd: new Date('2023-03-01'),
      },
    };
    const personWithLatestTilfelleStart: PersonData = {
      ...createPersonDataWithName('Bjarne Bjarne'),
      latestOppfolgingstilfelle: {
        varighetUker: 8,
        virksomhetList: [],
        oppfolgingstilfelleStart: new Date('2023-02-01'),
        oppfolgingstilfelleEnd: new Date('2023-04-01'),
      },
    };

    it('sorts by varighet uker ascending', () => {
      const result = getSortedEventsFromSortingType(
        {
          '09128034883': personWithLongestVarighet,
          '16624407794': personWithShortestVarighet,
        },
        [],
        'UKE_ASC'
      );
      expect(Object.values(result)[0]?.navn).to.deep.equal(
        personWithShortestVarighet.navn
      );
      expect(Object.values(result)[1]?.navn).to.deep.equal(
        personWithLongestVarighet.navn
      );
    });

    it('sorts by varighet uker descending', () => {
      const result = getSortedEventsFromSortingType(
        {
          '09128034883': personWithLongestVarighet,
          '16624407794': personWithShortestVarighet,
        },
        [],
        'UKE_DESC'
      );
      expect(Object.values(result)[0]?.navn).to.deep.equal(
        personWithLongestVarighet.navn
      );
      expect(Object.values(result)[1]?.navn).to.deep.equal(
        personWithShortestVarighet.navn
      );
    });

    it('sorts by tilfelle-start if equal varighet uker ascending', () => {
      const result = getSortedEventsFromSortingType(
        {
          '09128034883': personWithEarliestTilfelleStart,
          '16624407794': personWithLatestTilfelleStart,
        },
        [],
        'UKE_ASC'
      );
      expect(Object.values(result)[0]?.navn).to.deep.equal(
        personWithLatestTilfelleStart.navn
      );
      expect(Object.values(result)[1]?.navn).to.deep.equal(
        personWithEarliestTilfelleStart.navn
      );
    });
    it('sorts by tilfelle-start if equal varighet uker descending', () => {
      const result = getSortedEventsFromSortingType(
        {
          '09128034883': personWithEarliestTilfelleStart,
          '16624407794': personWithLatestTilfelleStart,
        },
        [],
        'UKE_DESC'
      );
      expect(Object.values(result)[0]?.navn).to.deep.equal(
        personWithEarliestTilfelleStart.navn
      );
      expect(Object.values(result)[1]?.navn).to.deep.equal(
        personWithLatestTilfelleStart.navn
      );
    });
  });
  describe('sort by frist', () => {
    it('Sorts by aktivitetskrav avventer-frist ascending', () => {
      const personWithEarliestFrist: PersonData = {
        ...createPersonDataWithName('Agnes Agnes'),
        aktivitetskravVurderingFrist: new Date('2023-12-05'),
      };
      const personWithLatestFrist: PersonData = {
        ...createPersonDataWithName('Bjarne Bjarne'),
        aktivitetskravVurderingFrist: new Date('2023-12-10'),
      };
      const personWithNoFrist = createPersonDataWithName('Navn Navnesen');

      const result = getSortedEventsFromSortingType(
        {
          '09128034883': personWithEarliestFrist,
          '16624407794': personWithNoFrist,
          '16614407794': personWithLatestFrist,
        },
        [],
        'DATO_ASC'
      );

      expect(Object.values(result)[0]?.navn).to.deep.equal(
        personWithEarliestFrist.navn
      );
      expect(Object.values(result)[1]?.navn).to.deep.equal(
        personWithLatestFrist.navn
      );
      expect(Object.values(result)[2]?.navn).to.deep.equal(
        personWithNoFrist.navn
      );
    });

    it('Sorts by aktivitetskrav avventer-frist descending', () => {
      const personWithEarliestFrist: PersonData = {
        ...createPersonDataWithName('Agnes Agnes'),
        aktivitetskravVurderingFrist: new Date('2023-12-05'),
      };
      const personWithLatestFrist: PersonData = {
        ...createPersonDataWithName('Bjarne Bjarne'),
        aktivitetskravVurderingFrist: new Date('2023-12-10'),
      };
      const personWithNoFrist = createPersonDataWithName('Navn Navnesen');

      const result = getSortedEventsFromSortingType(
        {
          '09128034883': personWithEarliestFrist,
          '16624407794': personWithNoFrist,
          '16614407794': personWithLatestFrist,
        },
        [],
        'DATO_DESC'
      );

      expect(Object.values(result)[0]?.navn).to.deep.equal(
        personWithNoFrist.navn
      );
      expect(Object.values(result)[1]?.navn).to.deep.equal(
        personWithLatestFrist.navn
      );
      expect(Object.values(result)[2]?.navn).to.deep.equal(
        personWithEarliestFrist.navn
      );
    });

    it('Sorts by trenger oppfolging-frist ascending', () => {
      const personWithEarliestFrist: PersonData = {
        ...createPersonDataWithName('Agnes Agnes'),
        oppfolgingsoppgaveFrist: new Date('2023-12-05'),
      };
      const personWithLatestFrist: PersonData = {
        ...createPersonDataWithName('Bjarne Bjarne'),
        oppfolgingsoppgaveFrist: new Date('2023-12-10'),
      };
      const personWithNoFrist = createPersonDataWithName('Navn Navnesen');

      const result = getSortedEventsFromSortingType(
        {
          '09128034883': personWithEarliestFrist,
          '16624407794': personWithNoFrist,
          '16614407794': personWithLatestFrist,
        },
        [],
        'DATO_ASC'
      );

      expect(Object.values(result)[0]?.navn).to.deep.equal(
        personWithEarliestFrist.navn
      );
      expect(Object.values(result)[1]?.navn).to.deep.equal(
        personWithLatestFrist.navn
      );
      expect(Object.values(result)[2]?.navn).to.deep.equal(
        personWithNoFrist.navn
      );
    });

    it('Sorts by trenger oppfolging-frist descending', () => {
      const personWithEarliestFrist: PersonData = {
        ...createPersonDataWithName('Agnes Agnes'),
        oppfolgingsoppgaveFrist: new Date('2023-12-05'),
      };
      const personWithLatestFrist: PersonData = {
        ...createPersonDataWithName('Bjarne Bjarne'),
        oppfolgingsoppgaveFrist: new Date('2023-12-10'),
      };
      const personWithNoFrist = createPersonDataWithName('Navn Navnesen');

      const result = getSortedEventsFromSortingType(
        {
          '09128034883': personWithEarliestFrist,
          '16624407794': personWithNoFrist,
          '16614407794': personWithLatestFrist,
        },
        [],
        'DATO_DESC'
      );

      expect(Object.values(result)[0]?.navn).to.deep.equal(
        personWithNoFrist.navn
      );
      expect(Object.values(result)[1]?.navn).to.deep.equal(
        personWithLatestFrist.navn
      );
      expect(Object.values(result)[2]?.navn).to.deep.equal(
        personWithEarliestFrist.navn
      );
    });

    it('Sorts by avventer and trenger oppfolging-frist ascending', () => {
      const personWithEarliestFrist: PersonData = {
        ...createPersonDataWithName('Agnes Agnes'),
        aktivitetskravVurderingFrist: new Date('2023-12-05'),
      };
      const personWithLatestFrist: PersonData = {
        ...createPersonDataWithName('Bjarne Bjarne'),
        oppfolgingsoppgaveFrist: new Date('2023-12-10'),
      };
      const personWithNoFrist = createPersonDataWithName('Navn Navnesen');

      const result = getSortedEventsFromSortingType(
        {
          '09128034883': personWithEarliestFrist,
          '16624407794': personWithNoFrist,
          '16614407794': personWithLatestFrist,
        },
        [],
        'DATO_ASC'
      );

      expect(Object.values(result)[0]?.navn).to.deep.equal(
        personWithEarliestFrist.navn
      );
      expect(Object.values(result)[1]?.navn).to.deep.equal(
        personWithLatestFrist.navn
      );
      expect(Object.values(result)[2]?.navn).to.deep.equal(
        personWithNoFrist.navn
      );
    });

    it('Sorts by avventer and trenger oppfolging-frist descending', () => {
      const personWithEarliestFrist: PersonData = {
        ...createPersonDataWithName('Agnes Agnes'),
        aktivitetskravVurderingFrist: new Date('2023-12-05'),
      };
      const personWithLatestFrist: PersonData = {
        ...createPersonDataWithName('Bjarne Bjarne'),
        oppfolgingsoppgaveFrist: new Date('2023-12-10'),
      };
      const personWithNoFrist = createPersonDataWithName('Navn Navnesen');

      const result = getSortedEventsFromSortingType(
        {
          '09128034883': personWithEarliestFrist,
          '16624407794': personWithNoFrist,
          '16614407794': personWithLatestFrist,
        },
        [],
        'DATO_DESC'
      );

      expect(Object.values(result)[0]?.navn).to.deep.equal(
        personWithNoFrist.navn
      );
      expect(Object.values(result)[1]?.navn).to.deep.equal(
        personWithLatestFrist.navn
      );
      expect(Object.values(result)[2]?.navn).to.deep.equal(
        personWithEarliestFrist.navn
      );
    });

    it('Sorts ascending by earliest frist per person when person have both frist', () => {
      const personWithEarliestFrist: PersonData = {
        ...createPersonDataWithName('Agnes Agnes'),
        aktivitetskravVurderingFrist: new Date('2023-12-05'),
        oppfolgingsoppgaveFrist: new Date('2023-12-10'),
      };
      const personWithLatestFrist: PersonData = {
        ...createPersonDataWithName('Bjarne Bjarne'),
        aktivitetskravVurderingFrist: new Date('2023-12-08'),
        oppfolgingsoppgaveFrist: new Date('2023-12-15'),
      };

      const result = getSortedEventsFromSortingType(
        {
          '09128034883': personWithEarliestFrist,
          '16614407794': personWithLatestFrist,
        },
        [],
        'DATO_ASC'
      );

      expect(Object.values(result)[0]?.navn).to.deep.equal(
        personWithEarliestFrist.navn
      );
      expect(Object.values(result)[1]?.navn).to.deep.equal(
        personWithLatestFrist.navn
      );
    });

    it('Sorts descending by earliest frist per person when person have both frist', () => {
      const personWithEarliestFrist: PersonData = {
        ...createPersonDataWithName('Agnes Agnes'),
        aktivitetskravVurderingFrist: new Date('2023-12-05'),
        oppfolgingsoppgaveFrist: new Date('2023-12-10'),
      };
      const personWithLatestFrist: PersonData = {
        ...createPersonDataWithName('Bjarne Bjarne'),
        aktivitetskravVurderingFrist: new Date('2023-12-08'),
        oppfolgingsoppgaveFrist: new Date('2023-12-15'),
      };

      const result = getSortedEventsFromSortingType(
        {
          '09128034883': personWithEarliestFrist,
          '16614407794': personWithLatestFrist,
        },
        [],
        'DATO_DESC'
      );

      expect(Object.values(result)[0]?.navn).to.deep.equal(
        personWithLatestFrist.navn
      );
      expect(Object.values(result)[1]?.navn).to.deep.equal(
        personWithEarliestFrist.navn
      );
    });
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

    describe('Frist filter', () => {
      const today = new Date();
      const oneWeekAgo = subWeeks(today, 1);
      const oneWeekFromToday = addWeeks(today, 1);

      const oppfolgingsOppgaveFristBeforeToday: PersonData = {
        ...createPersonDataWithName('Box Culder'),
        harOppfolgingsoppgave: true,
        oppfolgingsoppgaveFrist: oneWeekAgo,
      };
      const aktivitetskravVurderingFristBeforeToday: PersonData = {
        ...createPersonDataWithName('Cox Dulder'),
        aktivitetskravActive: true,
        aktivitetskravVurderingFrist: oneWeekAgo,
      };
      const oppfolgingsOppgaveFristToday: PersonData = {
        ...createPersonDataWithName('Dox Fulder'),
        harOppfolgingsoppgave: true,
        oppfolgingsoppgaveFrist: today,
      };
      const aktivitetskravVurderingFristToday: PersonData = {
        ...createPersonDataWithName('Fox Gulder'),
        aktivitetskravActive: true,
        aktivitetskravVurderingFrist: today,
      };
      const oppfolgingsOppgaveFristFuture: PersonData = {
        ...createPersonDataWithName('Gox Hulder'),
        harOppfolgingsoppgave: true,
        oppfolgingsoppgaveFrist: oneWeekFromToday,
      };
      const aktivitetskravVurderingFristFuture: PersonData = {
        ...createPersonDataWithName('Jox Kulder'),
        aktivitetskravActive: true,
        aktivitetskravVurderingFrist: oneWeekFromToday,
      };

      const personregister: PersonregisterState = {
        '16614407794': oppfolgingsOppgaveFristBeforeToday,
        '16614407795': aktivitetskravVurderingFristBeforeToday,
        '16614407796': oppfolgingsOppgaveFristToday,
        '16614407797': aktivitetskravVurderingFristToday,
        '16614407798': oppfolgingsOppgaveFristFuture,
        '16614407799': aktivitetskravVurderingFristFuture,
      };

      it('Only returns elements with frist dato before today', () => {
        const filteredPersonregister = filterOnFrist(personregister, [
          FristFilterOption.Past,
        ]);

        expect(Object.keys(filteredPersonregister).length).to.equal(2);
        expect(Object.keys(filteredPersonregister)[0]).to.equal('16614407794');
        expect(Object.keys(filteredPersonregister)[1]).to.equal('16614407795');
      });

      it('Only returns elements with frist dato today', () => {
        const filteredPersonregister = filterOnFrist(personregister, [
          FristFilterOption.Today,
        ]);

        expect(Object.keys(filteredPersonregister).length).to.equal(2);
        expect(Object.keys(filteredPersonregister)[0]).to.equal('16614407796');
        expect(Object.keys(filteredPersonregister)[1]).to.equal('16614407797');
      });

      it('Only returns elements with frist dato in the future', () => {
        const filteredPersonregister = filterOnFrist(personregister, [
          FristFilterOption.Future,
        ]);

        expect(Object.keys(filteredPersonregister).length).to.equal(2);
        expect(Object.keys(filteredPersonregister)[0]).to.equal('16614407798');
        expect(Object.keys(filteredPersonregister)[1]).to.equal('16614407799');
      });
    });
  });
});
