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
  trengerOppfolging: boolean;
  behandlerBerOmBistandUbehandlet: boolean;
  arbeidsuforhetvurdering: ArbeidsuforhetvurderingDTO | null;
  friskmeldingTilArbeidsformidlingFom: Date | null;
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
  aktivitetskravSistVurdert: Date | null;
  aktivitetskravVurderingFrist: Date | null;
  trengerOppfolgingFrist: Date | null;
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
