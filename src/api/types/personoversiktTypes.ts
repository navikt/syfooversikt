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
}

export interface PersonOversiktStatusDTO {
  fnr: string;
  navn: string;
  enhet: string;
  veilederIdent: string | null;
  motebehovUbehandlet: boolean | null;
  dialogmotesvarUbehandlet: boolean;
  oppfolgingsplanLPSBistandUbehandlet: boolean | null;
  dialogmotekandidat: boolean | undefined;
  motestatus: MoteStatusType | undefined;
  latestOppfolgingstilfelle?: OppfolgingstilfelleDTO;
  aktivitetskrav: AktivitetskravStatus | null;
  aktivitetskravSistVurdert: Date | null;
  aktivitetskravActive: boolean;
}

export interface OppfolgingstilfelleDTO {
  oppfolgingstilfelleStart: Date;
  oppfolgingstilfelleEnd: Date;
  virksomhetList: OppfolgingstilfelleVirksomhetDTO[];
}

export interface OppfolgingstilfelleVirksomhetDTO {
  virksomhetsnummer: string;
  virksomhetsnavn?: string;
}
