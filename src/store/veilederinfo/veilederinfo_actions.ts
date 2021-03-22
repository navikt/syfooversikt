import { Veilederinfo } from './veilederinfoTypes';

export enum VeilederinfoActionTypes {
  HENT_VEILEDERINFO_FORESPURT = 'HENT_VEILEDERINFO_FORESPURT',
  HENT_VEILEDERINFO_HENTER = 'HENT_VEILEDERINFO_HENTER',
  HENT_VEILEDERINFO_FEILET = 'HENT_VEILEDERINFO_FEILET',
  HENT_VEILEDERINFO_HENTET = 'HENT_VEILEDERINFO_HENTET',
}

export interface HentVeilederinfoAction {
  type: VeilederinfoActionTypes.HENT_VEILEDERINFO_FORESPURT;
}

export interface HenterVeilederinfoAction {
  type: VeilederinfoActionTypes.HENT_VEILEDERINFO_HENTER;
}

export interface VeilederinfoHentetAction {
  type: VeilederinfoActionTypes.HENT_VEILEDERINFO_HENTET;
  data: Veilederinfo;
}

export interface HentVeilederinfoFeiletAction {
  type: VeilederinfoActionTypes.HENT_VEILEDERINFO_FEILET;
}

export type VeilederinfoType =
  | HentVeilederinfoAction
  | HenterVeilederinfoAction
  | VeilederinfoHentetAction
  | HentVeilederinfoFeiletAction;

export const hentVeilederinfo = (): VeilederinfoType => ({
  type: VeilederinfoActionTypes.HENT_VEILEDERINFO_FORESPURT,
});

export const henterVeilederinfo = (): VeilederinfoType => ({
  type: VeilederinfoActionTypes.HENT_VEILEDERINFO_HENTER,
});

export const veilederinfoHentet = (data: Veilederinfo): VeilederinfoType => ({
  type: VeilederinfoActionTypes.HENT_VEILEDERINFO_HENTET,
  data,
});

export const hentVeilederinfoFeilet = (): VeilederinfoType => ({
  type: VeilederinfoActionTypes.HENT_VEILEDERINFO_FEILET,
});
