export interface Veilederenhet {
  enhetId: string;
  navn: string;
}

export interface Veilederenheter {
  enhetliste: Veilederenhet[];
}

export interface VeilederenheterState {
  readonly aktivEnhetId: string;
}
