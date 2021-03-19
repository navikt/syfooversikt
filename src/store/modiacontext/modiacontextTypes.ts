export interface Modiacontext {
  aktivBruker: string | null;
  aktivEnhet: string | null;
}

export interface HentAktivEnhetData {
  callback(a: any): any;
}

export interface ModiacontextPayload {
  verdi: string;
  eventType: string;
}

export interface ModiacontextState {
  readonly pushet: boolean;
  readonly pusher: boolean;
  readonly pushingFeilet: boolean;
  readonly henterEnhet: boolean;
  readonly hentingEnhetFeilet: boolean;
  readonly data: Modiacontext | {};
}
