import { AktivitetskravDTO } from '@/api/types/aktivitetskravDTO';
import { ManglendeMedvirkningDTO } from '@/api/types/manglendeMedvirkningDTO';
import { DialogmotekandidatDTO } from '@/api/types/dialogmotekandidatDTO';

export enum MoteStatusType {
  INNKALT = 'INNKALT',
  AVLYST = 'AVLYST',
  FERDIGSTILT = 'FERDIGSTILT',
  NYTT_TID_STED = 'NYTT_TID_STED',
  LUKKET = 'LUKKET',
}

export enum AktivitetskravStatus {
  NY = 'NY',
  AVVENT = 'AVVENT',
  UNNTAK = 'UNNTAK',
  OPPFYLT = 'OPPFYLT',
  AUTOMATISK_OPPFYLT = 'AUTOMATISK_OPPFYLT',
  STANS = 'STANS',
  IKKE_OPPFYLT = 'IKKE_OPPFYLT',
  FORHANDSVARSEL = 'FORHANDSVARSEL',
  IKKE_AKTUELL = 'IKKE_AKTUELL',
  LUKKET = 'LUKKET',
  NY_VURDERING = 'NY_VURDERING',
}

export enum AvventVurderingArsak {
  OPPFOLGINGSPLAN_ARBEIDSGIVER = 'OPPFOLGINGSPLAN_ARBEIDSGIVER',
  INFORMASJON_BEHANDLER = 'INFORMASJON_BEHANDLER',
  INFORMASJON_SYKMELDT = 'INFORMASJON_SYKMELDT',
  DROFTES_MED_ROL = 'DROFTES_MED_ROL',
  DROFTES_INTERNT = 'DROFTES_INTERNT',
  ANNET = 'ANNET',
}

export const avventVurderingArsakTexts: Record<AvventVurderingArsak, string> = {
  [AvventVurderingArsak.OPPFOLGINGSPLAN_ARBEIDSGIVER]:
    'Har bedt om oppfølgingsplan fra arbeidsgiver',
  [AvventVurderingArsak.INFORMASJON_BEHANDLER]:
    'Har bedt om mer informasjon fra behandler',
  [AvventVurderingArsak.INFORMASJON_SYKMELDT]:
    'Har bedt om informasjon fra den sykmeldte',
  [AvventVurderingArsak.DROFTES_MED_ROL]: 'Drøftes med ROL',
  [AvventVurderingArsak.DROFTES_INTERNT]: 'Drøftes internt',
  [AvventVurderingArsak.ANNET]: 'Annet',
};

export interface PersonOversiktStatusDTO {
  fnr: string;
  navn: string;
  fodselsdato: Date;
  enhet: string;
  veilederIdent: string | null;
  motestatus: MoteStatusType | undefined;
  latestOppfolgingstilfelle?: OppfolgingstilfelleDTO;
  motebehovUbehandlet: boolean | null;
  dialogmotesvarUbehandlet: boolean;
  oppfolgingsplanLPSBistandUbehandlet: boolean | null;
  dialogmotekandidatStatus: DialogmotekandidatDTO | null;
  behandlerdialogUbehandlet: boolean;
  behandlerBerOmBistandUbehandlet: boolean;
  arbeidsuforhetvurdering: ArbeidsuforhetvurderingDTO | null;
  friskmeldingTilArbeidsformidlingFom: Date | null;
  senOppfolgingKandidat: SenOppfolgingKandidatDTO | null;
  oppfolgingsoppgave: OppfolgingsoppgaveDTO | null;
  aktivitetskravvurdering: AktivitetskravDTO | null;
  manglendeMedvirkning: ManglendeMedvirkningDTO | null;
  isAktivKartleggingssporsmalVurdering: boolean;
}

export function isUbehandlet(
  personStatus: PersonOversiktStatusDTO,
  isKartleggingssporsmalEnabled: boolean
): boolean {
  return (
    !!personStatus.motebehovUbehandlet ||
    personStatus.dialogmotesvarUbehandlet ||
    !!personStatus.oppfolgingsplanLPSBistandUbehandlet ||
    personStatus.dialogmotekandidatStatus?.isKandidat ||
    personStatus.behandlerdialogUbehandlet ||
    personStatus.behandlerBerOmBistandUbehandlet ||
    !!personStatus.arbeidsuforhetvurdering ||
    !!personStatus.friskmeldingTilArbeidsformidlingFom ||
    !!personStatus.senOppfolgingKandidat ||
    !!personStatus.oppfolgingsoppgave ||
    !!personStatus.aktivitetskravvurdering ||
    !!personStatus.manglendeMedvirkning ||
    (isKartleggingssporsmalEnabled &&
      personStatus.isAktivKartleggingssporsmalVurdering)
  );
}

export interface OppfolgingstilfelleDTO {
  oppfolgingstilfelleStart: Date;
  oppfolgingstilfelleEnd: Date;
  varighetUker: number;
  virksomhetList: OppfolgingstilfelleVirksomhetDTO[];
}

export interface OppfolgingstilfelleVirksomhetDTO {
  virksomhetsnummer: string;
  virksomhetsnavn?: string;
}

export interface ArbeidsuforhetvurderingDTO {
  varsel: ArbeidsuforhetVarselDTO | null;
}

export interface ArbeidsuforhetVarselDTO {
  svarfrist: Date;
}

export interface SenOppfolgingKandidatDTO {
  personident: string;
  varselAt: Date | null;
  svar: SvarResponseDTO | null;
}

export interface SvarResponseDTO {
  svarAt: Date;
  onskerOppfolging: OnskerOppfolging;
}

export enum OnskerOppfolging {
  JA = 'JA',
  NEI = 'NEI',
}

export interface OppfolgingsoppgaveDTO {
  uuid: string;
  createdBy: string;
  updatedAt: Date;
  createdAt: Date;
  tekst: string | null;
  oppfolgingsgrunn: Oppfolgingsgrunn;
  frist: Date | null;
}

export enum Oppfolgingsgrunn {
  TA_KONTAKT_SYKEMELDT = 'TA_KONTAKT_SYKEMELDT',
  TA_KONTAKT_ARBEIDSGIVER = 'TA_KONTAKT_ARBEIDSGIVER',
  TA_KONTAKT_BEHANDLER = 'TA_KONTAKT_BEHANDLER',
  VURDER_DIALOGMOTE_SENERE = 'VURDER_DIALOGMOTE_SENERE',
  FOLG_OPP_ETTER_NESTE_SYKMELDING = 'FOLG_OPP_ETTER_NESTE_SYKMELDING',
  VURDER_TILTAK_BEHOV = 'VURDER_TILTAK_BEHOV',
  VURDER_ARBEIDSUFORHET = 'VURDER_ARBEIDSUFORHET',
  FRISKMELDING_TIL_ARBEIDSFORMIDLING = 'FRISKMELDING_TIL_ARBEIDSFORMIDLING',
  VURDER_14A = 'VURDER_14A',
  VURDER_ANNEN_YTELSE = 'VURDER_ANNEN_YTELSE',
  SAMTALE_MED_BRUKER = 'SAMTALE_MED_BRUKER',
  DELTAR_FORSOK_FORSTERKET_OPPFOLGING = 'DELTAR_FORSOK_FORSTERKET_OPPFOLGING',
  ANNET = 'ANNET',
}

type OppfolgingsgrunnText = { long: string; short: string };
export const oppfolgingsgrunnToString: Record<
  Oppfolgingsgrunn,
  OppfolgingsgrunnText
> = {
  [Oppfolgingsgrunn.TA_KONTAKT_SYKEMELDT]: {
    long: 'Ta kontakt med den sykmeldte',
    short: 'Kontakt sykmeldt',
  },
  [Oppfolgingsgrunn.TA_KONTAKT_ARBEIDSGIVER]: {
    long: 'Ta kontakt med arbeidsgiver',
    short: 'Kontakt arbeidsgiver',
  },
  [Oppfolgingsgrunn.TA_KONTAKT_BEHANDLER]: {
    long: 'Ta kontakt med behandler',
    short: 'Kontakt behandler',
  },
  [Oppfolgingsgrunn.VURDER_DIALOGMOTE_SENERE]: {
    long: 'Vurder behov for dialogmøte',
    short: 'Vurder dialogmøte',
  },
  [Oppfolgingsgrunn.FOLG_OPP_ETTER_NESTE_SYKMELDING]: {
    long: 'Følg opp etter neste sykmelding',
    short: 'Følg opp etter sykmelding',
  },
  [Oppfolgingsgrunn.VURDER_TILTAK_BEHOV]: {
    long: 'Vurder behov for tiltak',
    short: 'Vurder tiltak',
  },
  [Oppfolgingsgrunn.VURDER_ARBEIDSUFORHET]: {
    long: 'Vurder §8-4 - Arbeidsuførhet',
    short: 'Vurder §8-4',
  },
  [Oppfolgingsgrunn.FRISKMELDING_TIL_ARBEIDSFORMIDLING]: {
    long: 'Vurder §8-5 - Friskmelding til arbeidsformidling',
    short: 'Vurder §8-5',
  },
  [Oppfolgingsgrunn.VURDER_14A]: {
    long: 'Vurder §14a',
    short: 'Vurder §14a',
  },
  [Oppfolgingsgrunn.VURDER_ANNEN_YTELSE]: {
    long: 'Vurder annen ytelse',
    short: 'Vurder annen ytelse',
  },
  [Oppfolgingsgrunn.SAMTALE_MED_BRUKER]: {
    long: 'Samtale med bruker',
    short: 'Samtale med bruker',
  },
  [Oppfolgingsgrunn.DELTAR_FORSOK_FORSTERKET_OPPFOLGING]: {
    long: 'Deltar i forsøk med forsterket oppfølging',
    short: 'Deltar i forsøk',
  },
  [Oppfolgingsgrunn.ANNET]: {
    long: 'Annet',
    short: 'Annet',
  },
};
