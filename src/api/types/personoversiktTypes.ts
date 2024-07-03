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
}

export interface PersonOversiktUbehandletStatusDTO {
  motebehovUbehandlet: boolean | null;
  dialogmotesvarUbehandlet: boolean;
  oppfolgingsplanLPSBistandUbehandlet: boolean | null;
  dialogmotekandidat: boolean | undefined;
  behandlerdialogUbehandlet: boolean;
  aktivitetskravActive: boolean;
  aktivitetskravVurderStansUbehandlet: boolean;
  behandlerBerOmBistandUbehandlet: boolean;
  arbeidsuforhetvurdering: ArbeidsuforhetvurderingDTO | null;
  friskmeldingTilArbeidsformidlingFom: Date | null;
  isAktivSenOppfolgingKandidat: boolean;
  oppfolgingsoppgave: OppfolgingsoppgaveDTO | null;
}

export interface PersonOversiktStatusDTO
  extends PersonOversiktUbehandletStatusDTO {
  fnr: string;
  navn: string;
  enhet: string;
  veilederIdent: string | null;
  motestatus: MoteStatusType | undefined;
  latestOppfolgingstilfelle?: OppfolgingstilfelleDTO;
  aktivitetskrav: AktivitetskravStatus | null;
  aktivitetskravVurderingFrist: Date | null;
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
