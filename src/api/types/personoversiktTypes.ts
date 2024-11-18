import { AktivitetskravDTO } from '@/api/types/aktivitetskravDTO';
import { ManglendeMedvirkningDTO } from '@/api/types/manglendeMedvirkningDTO';

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

export interface PersonOversiktUbehandletStatusDTO {
  motebehovUbehandlet: boolean | null;
  dialogmotesvarUbehandlet: boolean;
  oppfolgingsplanLPSBistandUbehandlet: boolean | null;
  dialogmotekandidat: boolean | undefined;
  behandlerdialogUbehandlet: boolean;
  behandlerBerOmBistandUbehandlet: boolean;
  arbeidsuforhetvurdering: ArbeidsuforhetvurderingDTO | null;
  friskmeldingTilArbeidsformidlingFom: Date | null;
  senOppfolgingKandidat: SenOppfolgingKandidatDTO | null;
  oppfolgingsoppgave: OppfolgingsoppgaveDTO | null;
  aktivitetskravvurdering: AktivitetskravDTO | null;
  manglendeMedvirkning: ManglendeMedvirkningDTO | null;
}

export interface PersonOversiktStatusDTO
  extends PersonOversiktUbehandletStatusDTO {
  fnr: string;
  navn: string;
  fodselsdato: Date;
  enhet: string;
  veilederIdent: string | null;
  motestatus: MoteStatusType | undefined;
  latestOppfolgingstilfelle?: OppfolgingstilfelleDTO;
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
  ANNET = 'ANNET',
}

export const oppfolgingsgrunnToString = {
  [Oppfolgingsgrunn.TA_KONTAKT_SYKEMELDT]: 'Ta kontakt med den sykmeldte',
  [Oppfolgingsgrunn.TA_KONTAKT_ARBEIDSGIVER]: 'Ta kontakt med arbeidsgiver',
  [Oppfolgingsgrunn.TA_KONTAKT_BEHANDLER]: 'Ta kontakt med behandler',
  [Oppfolgingsgrunn.VURDER_DIALOGMOTE_SENERE]: 'Vurder behov for dialogmøte',
  [Oppfolgingsgrunn.FOLG_OPP_ETTER_NESTE_SYKMELDING]:
    'Følg opp etter neste sykmelding',
  [Oppfolgingsgrunn.VURDER_TILTAK_BEHOV]: 'Vurder behov for tiltak',
  [Oppfolgingsgrunn.VURDER_ARBEIDSUFORHET]: 'Vurder §8-4 - Arbeidsuførhet',
  [Oppfolgingsgrunn.FRISKMELDING_TIL_ARBEIDSFORMIDLING]:
    'Vurder §8-5 - Friskmelding til arbeidsformidling',
  [Oppfolgingsgrunn.VURDER_14A]: 'Vurder §14a',
  [Oppfolgingsgrunn.VURDER_ANNEN_YTELSE]: 'Vurder annen ytelse',
  [Oppfolgingsgrunn.ANNET]: 'Annet',
};
