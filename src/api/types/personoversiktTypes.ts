export interface PersonoversiktStatus {
  fnr: string;
  navn: string;
  enhet: string;
  veilederIdent: string | null;
  motebehovUbehandlet: boolean | null;
  moteplanleggerUbehandlet: boolean | null;
  oppfolgingsplanLPSBistandUbehandlet: boolean | null;
  oppfolgingstilfeller: Oppfolgingstilfelle[] | [];
}

export interface Oppfolgingstilfelle {
  virksomhetsnummer: string;
  virksomhetsnavn: string;
  fom: Date;
  tom: Date;
}
