import { Veileder } from './veiledereTypes';

export const enum VeiledereActionTypes {
  HENT_VEILEDERE_FORESPURT = 'HENT_VEILEDERE_FORESPURT',
  HENT_VEILEDERE_HENTER = 'HENT_VEILEDERE_HENTER',
  HENT_VEILEDERE_FEILET = 'HENT_VEILEDERE_FEILET',
  HENT_VEILEDERE_HENTET = 'HENT_VEILEDERE_HENTET',
}

export const hentVeiledere = () => ({
  type: VeiledereActionTypes.HENT_VEILEDERE_FORESPURT,
});

export const henterVeiledere = (enhetId: string) => ({
  type: VeiledereActionTypes.HENT_VEILEDERE_HENTER,
  enhetId,
});

export const veiledereHentet = (enhetId: string, data: Veileder[]) => ({
  type: VeiledereActionTypes.HENT_VEILEDERE_HENTET,
  enhetId,
  data,
});

export const hentVeiledereFeilet = (enhetId: string) => ({
  type: VeiledereActionTypes.HENT_VEILEDERE_FEILET,
  enhetId,
});
