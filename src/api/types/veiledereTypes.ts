export interface VeilederDTO {
  ident: string;
  fornavn: string;
  etternavn: string;
  epost: string;
  enabled: boolean | null;
  telefonnummer?: string;
}
