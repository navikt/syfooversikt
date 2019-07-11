import {
  PersonData,
  PersonregisterState,
} from '../../src/store/personregister/personregisterTypes';
import { PersonoversiktStatus } from '../../src/store/personoversikt/personoversiktTypes';

const veilederIdent = 'Z101010';
const veilederNavn = 'F_Z101010 E_Z101010';
const enhetId = '0315';

export const testdata = {
  fnr1: '99999911111',
  fnr2: '99999922222',
  fnr3: '99999933333',
  fnr4: '99999944444',
  navn1: 'Et navn',
  navn2: 'Et annet navn',
  navn3: 'Nok et navn..',
  enhetId,
  veilederIdent,
  skjermingskode: {
    ingen: 'INGEN',
    diskresjonsmerket: 'DISKRESJONSMERKET',
    egenAnsatt: 'EGEN_ANSATT',
  },
};

export const personregister: PersonregisterState = {
  [testdata.fnr1]: { navn: testdata.navn1, harMotebehovUbehandlet: true, harMoteplanleggerUbehandlet: false,
    skjermingskode: testdata.skjermingskode.ingen, markert: false } as PersonData,
  [testdata.fnr2]: { navn: testdata.navn2, harMotebehovUbehandlet: false, harMoteplanleggerUbehandlet: false,
    skjermingskode: testdata.skjermingskode.egenAnsatt, markert: false } as PersonData,
};

export const personoversikt = [
  {
    fnr: testdata.fnr1,
    enhet: enhetId,
    veilederIdent: null,
    motebehovUbehandlet: true,
  } as PersonoversiktStatus,
  {
    fnr: testdata.fnr4,
    enhet: enhetId,
    veilederIdent,
    motebehovUbehandlet: null,
  } as PersonoversiktStatus,
];

export const enhet = {
  enhetId: '0101',
  navn: 'Enhet',
};

export const veilederinfo = {
  navn: veilederNavn,
  ident: veilederIdent,
};
