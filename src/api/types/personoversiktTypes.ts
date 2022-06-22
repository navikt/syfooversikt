export enum MoteStatusType {
  INNKALT = 'INNKALT',
  AVLYST = 'AVLYST',
  FERDIGSTILT = 'FERDIGSTILT',
  NYTT_TID_STED = 'NYTT_TID_STED',
}

export interface PersonOversiktStatusDTO {
  fnr: string;
  navn: string;
  enhet: string;
  veilederIdent: string | null;
  motebehovUbehandlet: boolean | null;
  dialogmotesvarUbehandlet: boolean;
  moteplanleggerUbehandlet: boolean | null;
  oppfolgingsplanLPSBistandUbehandlet: boolean | null;
  dialogmotekandidat: boolean | undefined;
  motestatus: MoteStatusType | undefined;
  latestOppfolgingstilfelle?: OppfolgingstilfelleDTO;
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
