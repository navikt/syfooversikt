import { Veileder } from './veiledereTypes';

export enum VeiledereActionTypes {
  HENT_VEILEDERE_FORESPURT = 'HENT_VEILEDERE_FORESPURT',
  HENT_VEILEDERE_HENTER = 'HENT_VEILEDERE_HENTER',
  HENT_VEILEDERE_FEILET = 'HENT_VEILEDERE_FEILET',
  HENT_VEILEDERE_HENTET = 'HENT_VEILEDERE_HENTET',
}

export interface HentVeiledereAction {
  type: VeiledereActionTypes.HENT_VEILEDERE_FORESPURT;
}

export interface HenterVeiledereAction {
  type: VeiledereActionTypes.HENT_VEILEDERE_HENTER;
  enhetId: string;
}

export interface VeiledereHentetAction {
  type: VeiledereActionTypes.HENT_VEILEDERE_HENTET;
  enhetId: string;
  data: Veileder[];
}

export interface HentVeiledereFeiletAction {
  type: VeiledereActionTypes.HENT_VEILEDERE_FEILET;
  enhetId: string;
}

export type VeiledereAction =
  | HentVeiledereAction
  | HenterVeiledereAction
  | VeiledereHentetAction
  | HentVeiledereFeiletAction;

export const hentVeiledere = (): VeiledereAction => ({
  type: VeiledereActionTypes.HENT_VEILEDERE_FORESPURT,
});

export const henterVeiledere = (enhetId: string): VeiledereAction => ({
  type: VeiledereActionTypes.HENT_VEILEDERE_HENTER,
  enhetId,
});

export const veiledereHentet = (
  enhetId: string,
  data: Veileder[]
): VeiledereAction => ({
  type: VeiledereActionTypes.HENT_VEILEDERE_HENTET,
  enhetId,
  data,
});

export const hentVeiledereFeilet = (enhetId: string): VeiledereAction => ({
  type: VeiledereActionTypes.HENT_VEILEDERE_FEILET,
  enhetId,
});
