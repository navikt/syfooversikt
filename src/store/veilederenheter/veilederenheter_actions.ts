import { Veilederenheter } from './veilederenheterTypes';

export enum VeilederenheterActionTypes {
  HENT_VEILEDERENHETER_FORESPURT = 'HENT_VEILEDERENHETER_FORESPURT',
  HENT_VEILEDERENHETER_HENTER = 'HENT_VEILEDERENHETER_HENTER',
  HENT_VEILEDERENHETER_HENTET = 'HENT_VEILEDERENHETER_HENTET',
  HENT_VEILEDERENHETER_FEILET = 'HENT_VEILEDERENHETER_FEILET',
  HENT_AKTIVENHET_HENTET = 'HENT_AKTIVENHET_HENTET',
}

export interface HentVeilederenheterAction {
  type: VeilederenheterActionTypes.HENT_VEILEDERENHETER_FORESPURT;
}

export interface HentVeilederenheterHenterAction {
  type: VeilederenheterActionTypes.HENT_VEILEDERENHETER_HENTER;
}

export interface HentVeilederenheterHentetAction {
  type: VeilederenheterActionTypes.HENT_VEILEDERENHETER_HENTET;
  data: Veilederenheter;
}

export interface HentVeilederenheterFeiletAction {
  type: VeilederenheterActionTypes.HENT_VEILEDERENHETER_FEILET;
}

export interface SetAktivEnhetHentetAction {
  type: VeilederenheterActionTypes.HENT_AKTIVENHET_HENTET;
  data: string;
}

export type VeilederenheterType =
  | HentVeilederenheterAction
  | HentVeilederenheterHenterAction
  | HentVeilederenheterHentetAction
  | HentVeilederenheterFeiletAction
  | SetAktivEnhetHentetAction;

export const hentVeilederenheter = (): VeilederenheterType => ({
  type: VeilederenheterActionTypes.HENT_VEILEDERENHETER_FORESPURT,
});

export const hentVeilederenheterHenter = (): VeilederenheterType => ({
  type: VeilederenheterActionTypes.HENT_VEILEDERENHETER_HENTER,
});

export const hentVeilederenheterHentet = (
  data: Veilederenheter
): VeilederenheterType => ({
  type: VeilederenheterActionTypes.HENT_VEILEDERENHETER_HENTET,
  data,
});

export const hentVeilederenheterFeilet = (): VeilederenheterType => ({
  type: VeilederenheterActionTypes.HENT_VEILEDERENHETER_FEILET,
});

export const setAktivEnhetHentet = (data: string): VeilederenheterType => ({
  type: VeilederenheterActionTypes.HENT_AKTIVENHET_HENTET,
  data,
});
