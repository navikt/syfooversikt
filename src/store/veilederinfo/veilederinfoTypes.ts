export interface VeilederinfoDTO {
  ident: string;
  navn: string;
  fornavn: string;
  etternavn: string;
  epost: string;
  telefonnummer?: string;
}

export interface VeilederinfoState {
  readonly hentet: boolean;
  readonly henter: boolean;
  readonly hentingFeilet: boolean;
  readonly data?: VeilederinfoDTO;
}
