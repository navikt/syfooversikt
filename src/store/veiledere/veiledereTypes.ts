export interface Veileder {
  ident: string;
  fornavn: string;
  etternavn: string;
}

export interface VeiledereEnhetState {
  hentet: boolean;
  henter: boolean;
  hentingFeilet: boolean;
  data: Veileder[];
}

export interface VeiledereState {
  [key: string]: VeiledereEnhetState;
}
