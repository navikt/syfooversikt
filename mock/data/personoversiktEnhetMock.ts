import {
  AktivitetskravStatus,
  MoteStatusType,
  Oppfolgingsgrunn,
  OppfolgingsoppgaveDTO,
  PersonOversiktStatusDTO,
  PersonOversiktUbehandletStatusDTO,
} from '../../src/api/types/personoversiktTypes';
import { veilederMock } from './veilederMock';

const behandletPerson: PersonOversiktUbehandletStatusDTO = {
  oppfolgingsplanLPSBistandUbehandlet: null,
  motebehovUbehandlet: null,
  dialogmotekandidat: undefined,
  dialogmotesvarUbehandlet: false,
  aktivitetskravActive: false,
  behandlerdialogUbehandlet: false,
  oppfolgingsoppgave: null,
  behandlerBerOmBistandUbehandlet: false,
  aktivitetskravVurderStansUbehandlet: false,
  arbeidsuforhetvurdering: null,
  friskmeldingTilArbeidsformidlingFom: null,
  isAktivSenOppfolgingKandidat: false,
};

export const personoversiktEnhetMock: PersonOversiktStatusDTO[] = [
  {
    ...behandletPerson,
    fnr: '01999911111',
    navn: 'Korrupt Heis',
    enhet: '0316',
    veilederIdent: null,
    aktivitetskrav: AktivitetskravStatus.OPPFYLT,
    aktivitetskravActive: false,
    aktivitetskravVurderingFrist: null,
    oppfolgingsplanLPSBistandUbehandlet: true,
    motestatus: undefined,
    oppfolgingsoppgave: null,
    behandlerBerOmBistandUbehandlet: false,
    arbeidsuforhetvurdering: {
      varsel: {
        svarfrist: new Date('2022-12-01T10:12:05.913826'),
      },
    },
  },
  {
    ...behandletPerson,
    fnr: '99999922222',
    navn: 'Korrupt Bordsen',
    enhet: '0316',
    veilederIdent: null,
    motebehovUbehandlet: true,
    aktivitetskrav: AktivitetskravStatus.UNNTAK,
    aktivitetskravActive: false,
    aktivitetskravVurderingFrist: null,
    motestatus: undefined,
    behandlerdialogUbehandlet: true,
    oppfolgingsoppgave: null,
  },
  {
    ...behandletPerson,
    fnr: '99999922220',
    navn: 'Ola Forhåndsvarselsen',
    enhet: '0316',
    veilederIdent: null,
    motebehovUbehandlet: true,
    aktivitetskrav: AktivitetskravStatus.FORHANDSVARSEL,
    aktivitetskravActive: false,
    aktivitetskravVurderingFrist: null,
    motestatus: undefined,
    aktivitetskravVurderStansUbehandlet: true,
    oppfolgingsoppgave: null,
  },
  {
    ...behandletPerson,
    fnr: '99999921210',
    navn: 'Per Arbeidsuforvarselsen',
    enhet: '0316',
    veilederIdent: null,
    aktivitetskrav: null,
    aktivitetskravVurderingFrist: null,
    oppfolgingsplanLPSBistandUbehandlet: null,
    motestatus: undefined,
    oppfolgingsoppgave: null,
    arbeidsuforhetvurdering: {
      varsel: {
        svarfrist: new Date(),
      },
    },
  },
  {
    ...behandletPerson,
    fnr: '99999911120',
    navn: 'Hans Huskelappen',
    enhet: '0316',
    veilederIdent: null,
    motebehovUbehandlet: true,
    aktivitetskrav: null,
    aktivitetskravVurderingFrist: null,
    motestatus: undefined,
    oppfolgingsoppgave: getOppfolgingsoppgave(new Date('2024-01-01')),
  },
  {
    ...behandletPerson,
    fnr: '99999911125',
    navn: 'Frist Fristersen',
    enhet: '0316',
    veilederIdent: null,
    motebehovUbehandlet: true,
    aktivitetskrav: AktivitetskravStatus.AVVENT,
    aktivitetskravActive: true,
    aktivitetskravVurderingFrist: new Date('2022-12-08'),
    oppfolgingsplanLPSBistandUbehandlet: null,
    motestatus: undefined,
    oppfolgingsoppgave: getOppfolgingsoppgave(new Date('2024-01-01')),
  },
  {
    ...behandletPerson,
    fnr: '18049911120',
    navn: 'Bent Behandlerbistandsen',
    enhet: '0316',
    veilederIdent: null,
    motebehovUbehandlet: true,
    aktivitetskrav: null,
    aktivitetskravVurderingFrist: null,
    motestatus: undefined,
    oppfolgingsoppgave: getOppfolgingsoppgave(new Date('2024-04-01')),
    behandlerBerOmBistandUbehandlet: true,
  },
  {
    ...behandletPerson,
    fnr: '59999933333',
    navn: '',
    enhet: '0316',
    veilederIdent: 'Z101010',
    motebehovUbehandlet: true,
    aktivitetskrav: AktivitetskravStatus.AVVENT,
    aktivitetskravActive: false,
    aktivitetskravVurderingFrist: new Date('2022-12-10'),
    motestatus: undefined,
    oppfolgingsoppgave: null,
    latestOppfolgingstilfelle: {
      oppfolgingstilfelleStart: new Date('2022-10-25'),
      oppfolgingstilfelleEnd: new Date('2022-12-31'),
      varighetUker: 2,
      virksomhetList: [
        {
          virksomhetsnummer: '987654321',
          virksomhetsnavn: 'NAV Security',
        },
        {
          virksomhetsnummer: '987654322',
          virksomhetsnavn: 'NAV Investments',
        },
        {
          virksomhetsnummer: '987654320',
          virksomhetsnavn: 'Annen Virksomhet AS',
        },
        {
          virksomhetsnummer: '987654328',
          virksomhetsnavn: 'Bolle Og Brus',
        },
      ],
    },
  },
  {
    ...behandletPerson,
    fnr: '99999944444',
    navn: 'Stol Bordsen',
    enhet: '0316',
    veilederIdent: 'Z101010',
    motebehovUbehandlet: true,
    motestatus: undefined,
    aktivitetskrav: AktivitetskravStatus.AVVENT,
    aktivitetskravActive: false,
    aktivitetskravVurderingFrist: new Date('2022-12-10'),
    oppfolgingsoppgave: null,
    latestOppfolgingstilfelle: {
      oppfolgingstilfelleStart: new Date('2022-08-03'),
      oppfolgingstilfelleEnd: new Date('2022-12-31'),
      varighetUker: 2,
      virksomhetList: [
        {
          virksomhetsnummer: '987654321',
          virksomhetsnavn: 'NAV Security',
        },
        {
          virksomhetsnummer: '987654322',
          virksomhetsnavn: 'NAV Investments',
        },
        {
          virksomhetsnummer: '987654324',
          virksomhetsnavn: 'Kompani & Co. AS',
        },
      ],
    },
  },
  {
    ...behandletPerson,
    fnr: '18999955555',
    navn: 'Bord Stolesen',
    enhet: '0316',
    veilederIdent: null,
    motebehovUbehandlet: true,
    oppfolgingsplanLPSBistandUbehandlet: true,
    motestatus: undefined,
    aktivitetskrav: AktivitetskravStatus.AVVENT,
    aktivitetskravActive: true,
    aktivitetskravVurderingFrist: new Date('2023-04-01'),
    oppfolgingsoppgave: getOppfolgingsoppgave(new Date('2024-05-01')),
    latestOppfolgingstilfelle: {
      oppfolgingstilfelleStart: new Date('2022-08-01'),
      oppfolgingstilfelleEnd: new Date('2022-12-31'),
      varighetUker: 2,
      virksomhetList: [
        {
          virksomhetsnummer: '987654322',
          virksomhetsnavn: 'NAV Investments',
        },
        {
          virksomhetsnummer: '987654321',
          virksomhetsnavn: 'NAV Security',
        },
      ],
    },
  },
  {
    ...behandletPerson,
    fnr: '99999966666',
    navn: 'Gulv Heisen',
    enhet: '0316',
    veilederIdent: 'M987654',
    motestatus: MoteStatusType.NYTT_TID_STED,
    aktivitetskrav: AktivitetskravStatus.AVVENT,
    aktivitetskravActive: false,
    aktivitetskravVurderingFrist: new Date('2023-12-10'),
    oppfolgingsoppgave: null,
    latestOppfolgingstilfelle: {
      oppfolgingstilfelleStart: new Date('2022-01-01'),
      oppfolgingstilfelleEnd: new Date('2022-12-31'),
      varighetUker: 2,
      virksomhetList: [
        {
          virksomhetsnummer: '987654322',
          virksomhetsnavn: 'NAV Investments',
        },
      ],
    },
  },
  {
    ...behandletPerson,
    fnr: '99999955556',
    navn: 'Skjerm Visen',
    enhet: '0316',
    veilederIdent: null,
    motebehovUbehandlet: true,
    motestatus: MoteStatusType.INNKALT,
    dialogmotesvarUbehandlet: true,
    aktivitetskrav: AktivitetskravStatus.NY,
    aktivitetskravActive: true,
    aktivitetskravVurderingFrist: null,
    oppfolgingsoppgave: null,
    latestOppfolgingstilfelle: {
      oppfolgingstilfelleStart: new Date('2022-01-01'),
      oppfolgingstilfelleEnd: new Date('2022-12-31'),
      varighetUker: 2,
      virksomhetList: [
        {
          virksomhetsnummer: '987654322',
          virksomhetsnavn: 'NAV Investments',
        },
      ],
    },
  },
  {
    ...behandletPerson,
    fnr: '99999966667',
    navn: 'Stol Sengestad',
    enhet: '0316',
    veilederIdent: 'M987654',
    dialogmotekandidat: true,
    motestatus: MoteStatusType.AVLYST,
    aktivitetskrav: AktivitetskravStatus.STANS,
    aktivitetskravActive: false,
    aktivitetskravVurderingFrist: null,
    oppfolgingsoppgave: null,
    latestOppfolgingstilfelle: {
      oppfolgingstilfelleStart: new Date('2022-01-01'),
      oppfolgingstilfelleEnd: new Date('2022-12-31'),
      varighetUker: 4,
      virksomhetList: [
        {
          virksomhetsnummer: '987654322',
          virksomhetsnavn: 'NAV Investments',
        },
      ],
    },
  },
  {
    ...behandletPerson,
    fnr: '99999966668',
    navn: 'Bord Plantesen',
    enhet: '0316',
    veilederIdent: 'M987654',
    dialogmotekandidat: true,
    motestatus: undefined,
    aktivitetskrav: AktivitetskravStatus.AVVENT,
    aktivitetskravActive: false,
    aktivitetskravVurderingFrist: new Date('2022-12-10'),
    oppfolgingsoppgave: null,
    latestOppfolgingstilfelle: {
      oppfolgingstilfelleStart: new Date('2022-05-01'),
      oppfolgingstilfelleEnd: new Date('2022-12-31'),
      varighetUker: 1,
      virksomhetList: [
        {
          virksomhetsnummer: '987654322',
          virksomhetsnavn: 'NAV Investments',
        },
      ],
    },
  },
  {
    ...behandletPerson,
    fnr: '99999966669',
    navn: 'Lun Gange',
    enhet: '0316',
    veilederIdent: 'Wienerbrød',
    oppfolgingsplanLPSBistandUbehandlet: true,
    motestatus: MoteStatusType.FERDIGSTILT,
    aktivitetskrav: AktivitetskravStatus.UNNTAK,
    aktivitetskravActive: false,
    aktivitetskravVurderingFrist: null,
    oppfolgingsoppgave: getOppfolgingsoppgave(new Date('2024-01-01')),
    latestOppfolgingstilfelle: {
      oppfolgingstilfelleStart: new Date('2022-10-01'),
      oppfolgingstilfelleEnd: new Date('2022-12-31'),
      varighetUker: 2,
      virksomhetList: [
        {
          virksomhetsnummer: '987654322',
          virksomhetsnavn: 'NAV Investments',
        },
        {
          virksomhetsnummer: '987654321',
          virksomhetsnavn: 'NAV Security',
        },
      ],
    },
  },
  {
    ...behandletPerson,
    fnr: '99999966670',
    navn: 'Vissen Plass',
    enhet: '0316',
    veilederIdent: 'Wienerbrød',
    motestatus: undefined,
    aktivitetskrav: AktivitetskravStatus.AUTOMATISK_OPPFYLT,
    aktivitetskravActive: false,
    aktivitetskravVurderingFrist: null,
    oppfolgingsoppgave: getOppfolgingsoppgave(new Date('2024-01-01')),
    latestOppfolgingstilfelle: {
      oppfolgingstilfelleStart: new Date('2022-01-01'),
      oppfolgingstilfelleEnd: new Date('2022-12-31'),
      varighetUker: 420,
      virksomhetList: [
        {
          virksomhetsnummer: '987654322',
          virksomhetsnavn: 'NAV Investments',
        },
      ],
    },
  },
  {
    ...behandletPerson,
    fnr: '99999966671',
    navn: 'Mør Benk',
    enhet: '0316',
    veilederIdent: 'Z999991',
    oppfolgingsplanLPSBistandUbehandlet: true,
    motestatus: undefined,
    aktivitetskrav: AktivitetskravStatus.NY,
    aktivitetskravActive: false,
    aktivitetskravVurderingFrist: null,
    oppfolgingsoppgave: getOppfolgingsoppgave(new Date('2024-01-01')),
    latestOppfolgingstilfelle: {
      oppfolgingstilfelleStart: new Date('2022-01-01'),
      oppfolgingstilfelleEnd: new Date('2022-12-31'),
      varighetUker: 68,
      virksomhetList: [
        {
          virksomhetsnummer: '987654322',
          virksomhetsnavn: 'NAV Investments',
        },
      ],
    },
  },
  {
    ...behandletPerson,
    fnr: '99999966672',
    navn: 'Grønn Due',
    enhet: '0316',
    veilederIdent: 'Z999991',
    oppfolgingsplanLPSBistandUbehandlet: true,
    motestatus: undefined,
    latestOppfolgingstilfelle: undefined,
    aktivitetskrav: AktivitetskravStatus.OPPFYLT,
    aktivitetskravActive: false,
    aktivitetskravVurderingFrist: null,
    oppfolgingsoppgave: getOppfolgingsoppgave(new Date('2024-01-01')),
  },
  {
    ...behandletPerson,
    fnr: '99999966672',
    navn: 'Kandidat Arbeidsuforheten Uten Varslesen',
    enhet: '0316',
    veilederIdent: 'Z999991',
    oppfolgingsplanLPSBistandUbehandlet: null,
    motestatus: undefined,
    latestOppfolgingstilfelle: undefined,
    aktivitetskrav: null,
    aktivitetskravActive: false,
    aktivitetskravVurderingFrist: null,
    oppfolgingsoppgave: null,
    arbeidsuforhetvurdering: {
      varsel: null,
    },
  },
  {
    ...behandletPerson,
    fnr: '99999966673',
    navn: 'Kandidat Endringsen',
    enhet: '0316',
    veilederIdent: 'Z101010',
    motestatus: MoteStatusType.NYTT_TID_STED,
    aktivitetskrav: AktivitetskravStatus.IKKE_OPPFYLT,
    aktivitetskravActive: false,
    aktivitetskravVurderingFrist: null,
    oppfolgingsoppgave: null,
    latestOppfolgingstilfelle: {
      oppfolgingstilfelleStart: new Date('2022-01-01'),
      oppfolgingstilfelleEnd: new Date('2022-12-31'),
      varighetUker: 10,
      virksomhetList: [
        {
          virksomhetsnummer: '987654322',
          virksomhetsnavn: 'NAV Investments',
        },
      ],
    },
  },
  {
    ...behandletPerson,
    fnr: '99999966674',
    navn: 'Kandidat Innkaltsen',
    enhet: '0316',
    veilederIdent: 'Z101010',
    motestatus: MoteStatusType.INNKALT,
    aktivitetskrav: AktivitetskravStatus.NY,
    aktivitetskravActive: false,
    aktivitetskravVurderingFrist: null,
    oppfolgingsoppgave: null,
    latestOppfolgingstilfelle: {
      oppfolgingstilfelleStart: new Date('2022-01-01'),
      oppfolgingstilfelleEnd: new Date('2022-12-31'),
      varighetUker: 6,
      virksomhetList: [
        {
          virksomhetsnummer: '987654322',
          virksomhetsnavn: 'NAV Investments',
        },
      ],
    },
  },
  {
    ...behandletPerson,
    fnr: '99999966675',
    navn: 'Kandidat Avlystsen',
    enhet: '0316',
    veilederIdent: 'Z101010',
    dialogmotekandidat: true,
    motestatus: MoteStatusType.AVLYST,
    aktivitetskrav: AktivitetskravStatus.AVVENT,
    aktivitetskravActive: false,
    aktivitetskravVurderingFrist: new Date('2022-12-10'),
    oppfolgingsoppgave: null,
    latestOppfolgingstilfelle: {
      oppfolgingstilfelleStart: new Date('2022-01-01'),
      oppfolgingstilfelleEnd: new Date('2022-12-31'),
      varighetUker: 2,
      virksomhetList: [
        {
          virksomhetsnummer: '987654322',
          virksomhetsnavn: 'NAV Investments',
        },
      ],
    },
  },
  {
    ...behandletPerson,
    fnr: '99999966676',
    navn: 'Kandidat Kandidatsen',
    enhet: '0316',
    veilederIdent: 'Z101010',
    dialogmotekandidat: true,
    motestatus: undefined,
    aktivitetskrav: AktivitetskravStatus.AVVENT,
    aktivitetskravActive: false,
    aktivitetskravVurderingFrist: new Date('2022-12-20'),
    oppfolgingsoppgave: null,
    latestOppfolgingstilfelle: {
      oppfolgingstilfelleStart: new Date('2022-01-01'),
      oppfolgingstilfelleEnd: new Date('2022-12-31'),
      varighetUker: 2,
      virksomhetList: [
        {
          virksomhetsnummer: '987654322',
          virksomhetsnavn: 'NAV Investments',
        },
      ],
    },
  },
  {
    ...behandletPerson,
    fnr: '99999966677',
    navn: 'Ikke Viseson',
    enhet: '0316',
    veilederIdent: 'Z101010',
    motestatus: MoteStatusType.FERDIGSTILT,
    aktivitetskrav: AktivitetskravStatus.UNNTAK,
    aktivitetskravActive: false,
    aktivitetskravVurderingFrist: null,
    oppfolgingsoppgave: null,
    latestOppfolgingstilfelle: {
      oppfolgingstilfelleStart: new Date('2022-01-01'),
      oppfolgingstilfelleEnd: new Date('2022-12-31'),
      varighetUker: 2,
      virksomhetList: [
        {
          virksomhetsnummer: '987654322',
          virksomhetsnavn: 'NAV Investments',
        },
      ],
    },
  },
  {
    ...behandletPerson,
    fnr: '99999966678',
    navn: 'Ikke Visesen',
    enhet: '0316',
    veilederIdent: 'Z101010',
    motestatus: undefined,
    aktivitetskrav: AktivitetskravStatus.UNNTAK,
    aktivitetskravActive: false,
    aktivitetskravVurderingFrist: null,
    oppfolgingsoppgave: null,
    latestOppfolgingstilfelle: {
      oppfolgingstilfelleStart: new Date('2022-01-01'),
      oppfolgingstilfelleEnd: new Date('2022-12-31'),
      varighetUker: 2,
      virksomhetList: [
        {
          virksomhetsnummer: '987654322',
          virksomhetsnavn: 'NAV Investments',
        },
      ],
    },
  },
  {
    ...behandletPerson,
    fnr: '99999966678',
    navn: 'Ikke Viseby',
    enhet: '0316',
    veilederIdent: 'Z101010',
    motestatus: undefined,
    aktivitetskrav: AktivitetskravStatus.UNNTAK,
    aktivitetskravActive: false,
    aktivitetskravVurderingFrist: null,
    oppfolgingsoppgave: null,
    latestOppfolgingstilfelle: {
      oppfolgingstilfelleStart: new Date('2022-01-01'),
      oppfolgingstilfelleEnd: new Date('2022-12-31'),
      varighetUker: 2,
      virksomhetList: [
        {
          virksomhetsnummer: '987654322',
          virksomhetsnavn: 'NAV Investments',
        },
      ],
    },
  },
  {
    ...behandletPerson,
    fnr: '99998966679',
    navn: 'Frisk T. Arbeidsformidlesen',
    enhet: '0316',
    veilederIdent: 'Z101010',
    motestatus: undefined,
    aktivitetskrav: null,
    aktivitetskravVurderingFrist: null,
    isAktivSenOppfolgingKandidat: true,
  },
];

export function getOppfolgingsoppgave(frist?: Date): OppfolgingsoppgaveDTO {
  return {
    uuid: '123',
    createdBy: veilederMock.ident,
    updatedAt: new Date(),
    createdAt: new Date(),
    tekst: 'En tekst',
    oppfolgingsgrunn: getRandomOppfolgingsgrunn(),
    frist: frist ?? null,
  };
}

function getRandomOppfolgingsgrunn(): Oppfolgingsgrunn {
  const oppfolgingsgrunnValues = Object.values(Oppfolgingsgrunn);
  const randomIndex = Math.floor(Math.random() * oppfolgingsgrunnValues.length);
  return oppfolgingsgrunnValues[randomIndex] ?? Oppfolgingsgrunn.VURDER_14A;
}
