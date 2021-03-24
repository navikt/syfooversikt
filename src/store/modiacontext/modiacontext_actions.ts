export enum modiacontextActionTypes {
  HENT_AKTIVENHET_FORESPURT = 'HENT_AKTIVENHET_FORESPURT',
  HENT_AKTIVENHET_HENTER = 'HENT_AKTIVENHET_HENTER',
  HENT_AKTIVENHET_FEILET = 'HENT_AKTIVENHET_FEILET',
  HENT_AKTIVENHET_HENTET = 'HENT_AKTIVENHET_HENTET',
}

export interface HentAktivEnhetAction {
  type: modiacontextActionTypes.HENT_AKTIVENHET_FORESPURT;
}

export interface HentAktivEnhetFeiletAction {
  type: modiacontextActionTypes.HENT_AKTIVENHET_FEILET;
}

export interface HenterAktivEnhetAction {
  type: modiacontextActionTypes.HENT_AKTIVENHET_HENTER;
}

export interface HentAktivEnhetEntetAction {
  type: modiacontextActionTypes.HENT_AKTIVENHET_HENTET;
  enhetId?: string;
}

export type ModiaAction =
  | HentAktivEnhetAction
  | HentAktivEnhetFeiletAction
  | HenterAktivEnhetAction;

export const hentAktivEnhet = (): HentAktivEnhetAction => ({
  type: modiacontextActionTypes.HENT_AKTIVENHET_FORESPURT,
});

export const hentAktivEnhetFeilet = (): ModiaAction => ({
  type: modiacontextActionTypes.HENT_AKTIVENHET_FEILET,
});

export const henterAktivEnhet = (): ModiaAction => ({
  type: modiacontextActionTypes.HENT_AKTIVENHET_HENTER,
});

export const hentAktivEnhetHentet = (
  enhetId?: string
): HentAktivEnhetEntetAction => ({
  type: modiacontextActionTypes.HENT_AKTIVENHET_HENTET,
  enhetId,
});
