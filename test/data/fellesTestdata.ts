import {
  PersonData,
  PersonregisterState,
} from '@/api/types/personregisterTypes';
import {
  AktivitetskravStatus,
  PersonOversiktStatusDTO,
} from '@/api/types/personoversiktTypes';

const veilederIdent = 'Z101010';
const enhetId = '0316';

export const testdata = {
  fnr1: '01999911111',
  fnr2: '99999922222',
  fnr3: '59999933333',
  fnr4: '99999944444',
  navn1: 'Et navn',
  navn2: 'Et annet navn',
  navn3: 'Nok et navn..',
  navn4: 'Nok et navn igjen',
  enhetId,
  veilederIdent,
  skjermingskode: {
    ingen: 'INGEN',
    diskresjonsmerket: 'DISKRESJONSMERKET',
    egenAnsatt: 'EGEN_ANSATT',
  },
};

export const personregister: PersonregisterState = {
  [testdata.fnr1]: {
    navn: testdata.navn1,
    harMotebehovUbehandlet: true,
    harDialogmotesvar: true,
    skjermingskode: testdata.skjermingskode.ingen,
    markert: false,
    tildeltVeilederIdent: 'Z999999',
    aktivitetskrav: AktivitetskravStatus.NY,
    aktivitetskravSistVurdert: new Date(),
    aktivitetskravActive: true,
  } as PersonData,
  [testdata.fnr2]: {
    navn: testdata.navn2,
    harMotebehovUbehandlet: false,
    harDialogmotesvar: false,
    skjermingskode: testdata.skjermingskode.egenAnsatt,
    markert: false,
    tildeltVeilederIdent: 'Z999999',
    aktivitetskrav: null,
    aktivitetskravSistVurdert: null,
    aktivitetskravActive: false,
  } as PersonData,
};

export const personoversikt: PersonOversiktStatusDTO[] = [
  {
    fnr: testdata.fnr1,
    navn: testdata.navn1,
    enhet: enhetId,
    veilederIdent: null,
    motebehovUbehandlet: true,
    dialogmotesvarUbehandlet: false,
    oppfolgingsplanLPSBistandUbehandlet: null,
    dialogmotekandidat: undefined,
    motestatus: undefined,
    aktivitetskrav: null,
    aktivitetskravSistVurdert: null,
    aktivitetskravActive: false,
    aktivitetskravVurderingFrist: null,
    behandlerdialogUbehandlet: false,
    aktivitetskravVurderStansUbehandlet: false,
    trengerOppfolging: false,
    trengerOppfolgingFrist: null,
    behandlerBerOmBistandUbehandlet: false,
  },
  {
    fnr: testdata.fnr4,
    navn: testdata.navn4,
    enhet: enhetId,
    veilederIdent,
    motebehovUbehandlet: null,
    dialogmotesvarUbehandlet: false,
    oppfolgingsplanLPSBistandUbehandlet: false,
    dialogmotekandidat: undefined,
    motestatus: undefined,
    aktivitetskrav: null,
    aktivitetskravSistVurdert: null,
    aktivitetskravActive: false,
    aktivitetskravVurderingFrist: null,
    behandlerdialogUbehandlet: false,
    aktivitetskravVurderStansUbehandlet: false,
    trengerOppfolging: false,
    trengerOppfolgingFrist: null,
    behandlerBerOmBistandUbehandlet: false,
  },
];

export const enhet = {
  enhetId: '0101',
  navn: 'Enhet',
};

export const veiledere = [
  {
    ident: 'Z999999',
    fornavn: 'Veil',
    etternavn: 'Eder',
  },
  {
    ident: 'Z000000',
    fornavn: 'NAV',
    etternavn: 'Ansatt',
  },
];
