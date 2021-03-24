export interface Modiacontext {
  aktivBruker?: string;
  aktivEnhet?: string;
}

export interface ModiacontextState {
  readonly henterEnhet: boolean;
  readonly hentetEnhet: boolean;
  readonly hentingEnhetFeilet: boolean;
  readonly data: Modiacontext | unknown;
}
