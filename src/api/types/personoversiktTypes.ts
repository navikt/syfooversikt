export interface PersonOversiktStatusDTO {
  fnr: string;
  navn: string;
  enhet: string;
  veilederIdent: string | null;
  motebehovUbehandlet: boolean | null;
  moteplanleggerUbehandlet: boolean | null;
  oppfolgingsplanLPSBistandUbehandlet: boolean | null;
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
