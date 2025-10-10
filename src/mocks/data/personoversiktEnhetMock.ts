import {
  AktivitetskravStatus,
  AvventVurderingArsak,
  MoteStatusType,
  OnskerOppfolging,
  Oppfolgingsgrunn,
  OppfolgingsoppgaveDTO,
  PersonOversiktStatusDTO,
} from '../../api/types/personoversiktTypes';
import { veilederMock } from './veilederMock';
import dayjs from 'dayjs';

const behandletPerson = {
  oppfolgingsplanLPSBistandUbehandlet: null,
  motebehovUbehandlet: null,
  dialogmotekandidat: undefined,
  dialogmotesvarUbehandlet: false,
  behandlerdialogUbehandlet: false,
  oppfolgingsoppgave: null,
  behandlerBerOmBistandUbehandlet: false,
  arbeidsuforhetvurdering: null,
  friskmeldingTilArbeidsformidlingFom: null,
  senOppfolgingKandidat: null,
  aktivitetskravvurdering: null,
  manglendeMedvirkning: null,
};

export const personoversiktEnhetMock: PersonOversiktStatusDTO[] = [
  {
    ...behandletPerson,
    fnr: '01999911111',
    navn: 'Korrupt Heis',
    fodselsdato: new Date('1990-10-10'),
    enhet: '0316',
    veilederIdent: null,
    oppfolgingsplanLPSBistandUbehandlet: true,
    motestatus: undefined,
    oppfolgingsoppgave: null,
    behandlerBerOmBistandUbehandlet: false,
    arbeidsuforhetvurdering: {
      varsel: {
        svarfrist: new Date('2026-12-01T10:12:05.913826'),
      },
    },
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
          virksomhetsnummer: '987654320',
          virksomhetsnavn: 'Annen Virksomhet AS',
        },
      ],
    },
  },
  {
    ...behandletPerson,
    fnr: '99999922222',
    navn: 'Korrupt Bordsen',
    fodselsdato: new Date('1990-10-10'),
    enhet: '0316',
    veilederIdent: null,
    motebehovUbehandlet: true,
    aktivitetskravvurdering: {
      status: AktivitetskravStatus.AVVENT,
      vurderinger: [
        {
          status: AktivitetskravStatus.AVVENT,
          frist: dayjs(new Date()).add(-2, 'day').toDate(),
          arsaker: [],
        },
      ],
    },
    motestatus: undefined,
    behandlerdialogUbehandlet: true,
    oppfolgingsoppgave: null,
    latestOppfolgingstilfelle: {
      oppfolgingstilfelleStart: new Date('2022-10-25'),
      oppfolgingstilfelleEnd: new Date('2022-12-31'),
      varighetUker: 2,
      virksomhetList: [
        {
          virksomhetsnummer: '987654328',
          virksomhetsnavn: 'Bolle Og Brus',
        },
      ],
    },
  },
  {
    ...behandletPerson,
    fnr: '99999922220',
    navn: 'Ola Forhåndsvarselsen',
    fodselsdato: new Date('1990-10-10'),
    enhet: '0316',
    veilederIdent: null,
    motebehovUbehandlet: true,
    motestatus: undefined,
    oppfolgingsoppgave: null,
    aktivitetskravvurdering: {
      status: AktivitetskravStatus.FORHANDSVARSEL,
      vurderinger: [
        {
          status: AktivitetskravStatus.FORHANDSVARSEL,
          varsel: {
            svarfrist: new Date('2024-12-01'),
          },
          arsaker: [],
        },
      ],
    },
  },
  {
    ...behandletPerson,
    fnr: '99999921210',
    navn: 'Per Arbeidsuforvarselsen',
    fodselsdato: new Date('1990-10-10'),
    enhet: '0316',
    veilederIdent: null,
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
    fodselsdato: new Date('1990-10-10'),
    enhet: '0316',
    veilederIdent: null,
    motebehovUbehandlet: true,
    motestatus: undefined,
    oppfolgingsoppgave: getOppfolgingsoppgave(new Date('2024-01-01')),
  },
  {
    ...behandletPerson,
    fnr: '99999911125',
    navn: 'Frist Fristersen',
    fodselsdato: new Date('1990-10-10'),
    enhet: '0316',
    veilederIdent: null,
    motebehovUbehandlet: true,
    oppfolgingsplanLPSBistandUbehandlet: null,
    motestatus: undefined,
    oppfolgingsoppgave: getOppfolgingsoppgave(new Date('2024-01-01')),
    aktivitetskravvurdering: {
      status: AktivitetskravStatus.AVVENT,
      vurderinger: [
        {
          status: AktivitetskravStatus.AVVENT,
          frist: new Date('2022-12-08'),
          arsaker: [],
        },
      ],
    },
  },
  {
    ...behandletPerson,
    fnr: '18049911120',
    navn: 'Bent Behandlerbistandsen',
    fodselsdato: new Date('2000-01-01'),
    enhet: '0316',
    veilederIdent: null,
    motebehovUbehandlet: true,
    motestatus: undefined,
    oppfolgingsoppgave: getOppfolgingsoppgave(new Date('2024-04-01')),
    behandlerBerOmBistandUbehandlet: true,
  },
  {
    ...behandletPerson,
    fnr: '59999933333',
    navn: 'Navn Navnesen',
    fodselsdato: new Date('1990-01-01'),
    enhet: '0316',
    veilederIdent: 'Z101010',
    motebehovUbehandlet: true,
    motestatus: undefined,
    oppfolgingsoppgave: null,
    aktivitetskravvurdering: {
      status: AktivitetskravStatus.AVVENT,
      vurderinger: [
        {
          status: AktivitetskravStatus.AVVENT,
          frist: new Date('2022-12-10'),
          beskrivelse:
            'Dette er en grundig vurdering som venter på svar fra behandler. Etter dette må vi sjekke andre ting.',
          arsaker: [AvventVurderingArsak.ANNET],
        },
      ],
    },
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
    fodselsdato: new Date('2000-01-01'),
    enhet: '0316',
    veilederIdent: 'Z101010',
    motebehovUbehandlet: true,
    motestatus: undefined,
    oppfolgingsoppgave: null,
    aktivitetskravvurdering: {
      status: AktivitetskravStatus.AVVENT,
      vurderinger: [
        {
          status: AktivitetskravStatus.AVVENT,
          frist: new Date('2022-12-10'),
          arsaker: [
            AvventVurderingArsak.INFORMASJON_BEHANDLER,
            AvventVurderingArsak.ANNET,
          ],
        },
      ],
    },
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
    fodselsdato: new Date('2000-01-01'),
    enhet: '0316',
    veilederIdent: 'Z999999',
    motebehovUbehandlet: true,
    oppfolgingsplanLPSBistandUbehandlet: true,
    motestatus: undefined,
    oppfolgingsoppgave: getOppfolgingsoppgave(new Date('2024-05-01')),
    aktivitetskravvurdering: {
      status: AktivitetskravStatus.AVVENT,
      vurderinger: [
        {
          status: AktivitetskravStatus.AVVENT,
          frist: new Date('2023-04-01'),
          arsaker: [],
        },
      ],
    },
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
    fodselsdato: new Date('2000-01-01'),
    enhet: '0316',
    veilederIdent: 'M987654',
    motestatus: MoteStatusType.NYTT_TID_STED,
    oppfolgingsoppgave: null,
    aktivitetskravvurdering: {
      status: AktivitetskravStatus.AVVENT,
      vurderinger: [
        {
          status: AktivitetskravStatus.AVVENT,
          frist: new Date('2023-12-10'),
          arsaker: [],
        },
      ],
    },
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
    fodselsdato: new Date('2000-01-01'),
    enhet: '0316',
    veilederIdent: null,
    motebehovUbehandlet: true,
    motestatus: MoteStatusType.INNKALT,
    dialogmotesvarUbehandlet: true,
    oppfolgingsoppgave: null,
    aktivitetskravvurdering: {
      status: AktivitetskravStatus.NY,
      vurderinger: [],
    },
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
    fodselsdato: new Date('1990-01-01'),
    enhet: '0316',
    veilederIdent: 'M987654',
    dialogmotekandidat: true,
    motestatus: MoteStatusType.AVLYST,
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
    fodselsdato: new Date('1990-01-01'),
    enhet: '0316',
    veilederIdent: 'M987654',
    dialogmotekandidat: true,
    motestatus: undefined,
    oppfolgingsoppgave: null,
    aktivitetskravvurdering: {
      status: AktivitetskravStatus.AVVENT,
      vurderinger: [
        {
          status: AktivitetskravStatus.AVVENT,
          frist: new Date('2022-12-10'),
          arsaker: [],
        },
      ],
    },
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
    fodselsdato: new Date('1990-01-01'),
    enhet: '0316',
    veilederIdent: 'Wienerbrød',
    oppfolgingsplanLPSBistandUbehandlet: true,
    motestatus: MoteStatusType.FERDIGSTILT,
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
    fodselsdato: new Date('1990-01-01'),
    enhet: '0316',
    veilederIdent: 'Wienerbrød',
    motestatus: undefined,
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
    fodselsdato: new Date('1990-01-01'),
    enhet: '0316',
    veilederIdent: 'Z999991',
    oppfolgingsplanLPSBistandUbehandlet: true,
    motestatus: undefined,
    oppfolgingsoppgave: getOppfolgingsoppgave(new Date('2024-01-01')),
    aktivitetskravvurdering: {
      status: AktivitetskravStatus.NY,
      vurderinger: [],
    },
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
    fodselsdato: new Date('1990-01-01'),
    enhet: '0316',
    veilederIdent: 'Z999991',
    oppfolgingsplanLPSBistandUbehandlet: true,
    motestatus: undefined,
    latestOppfolgingstilfelle: undefined,
    oppfolgingsoppgave: getOppfolgingsoppgave(new Date('2024-01-01')),
  },
  {
    ...behandletPerson,
    fnr: '99999966672',
    navn: 'Kandidat Arbeidsuforheten Uten Varslesen',
    fodselsdato: new Date('1990-01-01'),
    enhet: '0316',
    veilederIdent: 'Z999991',
    oppfolgingsplanLPSBistandUbehandlet: null,
    motestatus: undefined,
    latestOppfolgingstilfelle: undefined,
    oppfolgingsoppgave: null,
    arbeidsuforhetvurdering: {
      varsel: null,
    },
  },
  {
    ...behandletPerson,
    fnr: '99999966673',
    navn: 'Kandidat Endringsen',
    fodselsdato: new Date('1990-01-01'),
    enhet: '0316',
    veilederIdent: 'Z101010',
    motestatus: MoteStatusType.NYTT_TID_STED,
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
    fodselsdato: new Date('1990-01-01'),
    enhet: '0316',
    veilederIdent: 'Z101010',
    motestatus: MoteStatusType.INNKALT,
    oppfolgingsoppgave: null,
    aktivitetskravvurdering: {
      status: AktivitetskravStatus.NY,
      vurderinger: [],
    },
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
    fodselsdato: new Date('1990-01-01'),
    enhet: '0316',
    veilederIdent: 'Z101010',
    dialogmotekandidat: true,
    motestatus: MoteStatusType.AVLYST,
    aktivitetskravvurdering: {
      status: AktivitetskravStatus.AVVENT,
      vurderinger: [
        {
          status: AktivitetskravStatus.AVVENT,
          frist: new Date('2022-12-10'),
          arsaker: [
            AvventVurderingArsak.OPPFOLGINGSPLAN_ARBEIDSGIVER,
            AvventVurderingArsak.INFORMASJON_BEHANDLER,
          ],
        },
      ],
    },
    oppfolgingsoppgave: getOppfolgingsoppgave(new Date('2024-01-01')),
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
    fodselsdato: new Date('2000-01-01'),
    enhet: '0316',
    veilederIdent: 'Z101010',
    dialogmotekandidat: true,
    motestatus: undefined,
    aktivitetskravvurdering: {
      status: AktivitetskravStatus.AVVENT,
      vurderinger: [
        {
          status: AktivitetskravStatus.AVVENT,
          frist: new Date('2022-12-20'),
          arsaker: [
            AvventVurderingArsak.ANNET,
            AvventVurderingArsak.INFORMASJON_SYKMELDT,
          ],
        },
      ],
    },
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
    senOppfolgingKandidat: {
      personident: '',
      varselAt: new Date(),
      svar: {
        svarAt: new Date(),
        onskerOppfolging: OnskerOppfolging.NEI,
      },
    },
  },
  {
    ...behandletPerson,
    fnr: '99999966677',
    navn: 'Ikke Viseson',
    fodselsdato: new Date('2000-01-01'),
    enhet: '0316',
    veilederIdent: 'Z101010',
    motestatus: MoteStatusType.FERDIGSTILT,
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
    fodselsdato: new Date('2000-01-01'),
    enhet: '0316',
    veilederIdent: 'Z101010',
    motestatus: undefined,
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
    fodselsdato: new Date('2000-01-01'),
    enhet: '0316',
    veilederIdent: 'Z101010',
    motestatus: undefined,
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
    fodselsdato: new Date('2000-01-01'),
    enhet: '0316',
    veilederIdent: 'Z101010',
    motestatus: undefined,
    senOppfolgingKandidat: {
      personident: '',
      varselAt: new Date(),
      svar: {
        svarAt: new Date(),
        onskerOppfolging: OnskerOppfolging.JA,
      },
    },
  },
  {
    ...behandletPerson,
    fnr: '99918965679',
    navn: 'Manglende Medvirksen',
    fodselsdato: new Date('2000-01-01'),
    enhet: '0316',
    veilederIdent: 'Z101010',
    motestatus: undefined,
    manglendeMedvirkning: {
      varsel: {
        svarfrist: new Date(),
      },
    },
    senOppfolgingKandidat: {
      personident: '',
      varselAt: new Date(),
      svar: null,
    },
  },
];

export function getOppfolgingsoppgave(frist?: Date): OppfolgingsoppgaveDTO {
  return {
    uuid: '123',
    createdBy: veilederMock.ident,
    updatedAt: new Date(),
    createdAt: new Date(),
    tekst: 'En tekst\n med\n linjeskift',
    oppfolgingsgrunn: getRandomOppfolgingsgrunn(),
    frist: frist ?? null,
  };
}

function getRandomOppfolgingsgrunn(): Oppfolgingsgrunn {
  const oppfolgingsgrunnValues = Object.values(Oppfolgingsgrunn);
  const randomIndex = Math.floor(Math.random() * oppfolgingsgrunnValues.length);
  return oppfolgingsgrunnValues[randomIndex] ?? Oppfolgingsgrunn.VURDER_14A;
}
