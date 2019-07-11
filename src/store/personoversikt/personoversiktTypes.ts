export interface PersonoversiktStatus {
  fnr: string;
  enhet: string;
  veilederIdent: string | null;
  motebehovUbehandlet: boolean | null;
  moteplanleggerUbehandlet: boolean | null;
}

export interface PersonoversiktStatusState {
  readonly hentet: boolean;
  readonly henter: boolean;
  readonly hentingFeilet: boolean;
  readonly data: PersonoversiktStatus[];
}
