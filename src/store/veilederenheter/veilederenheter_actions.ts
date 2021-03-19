import { Veilederenheter } from './veilederenheterTypes';

export const enum VeilederenheterActionTypes {
  HENT_VEILEDERENHETER_FORESPURT = 'HENT_VEILEDERENHETER_FORESPURT',
  HENT_VEILEDERENHETER_HENTER = 'HENT_VEILEDERENHETER_HENTER',
  HENT_VEILEDERENHETER_HENTET = 'HENT_VEILEDERENHETER_HENTET',
  HENT_VEILEDERENHETER_FEILET = 'HENT_VEILEDERENHETER_FEILET',
  HENT_AKTIVENHET_HENTET = 'HENT_AKTIVENHET_HENTET',
}

export const hentVeilederenheter = () => ({
  type: VeilederenheterActionTypes.HENT_VEILEDERENHETER_FORESPURT,
});

export const hentVeilederenheterHenter = () => ({
  type: VeilederenheterActionTypes.HENT_VEILEDERENHETER_HENTER,
});

export const hentVeilederenheterHentet = (data: Veilederenheter) => ({
  type: VeilederenheterActionTypes.HENT_VEILEDERENHETER_HENTET,
  data,
});

export const hentVeilederenheterFeilet = () => ({
  type: VeilederenheterActionTypes.HENT_VEILEDERENHETER_FEILET,
});

export const setAktivEnhetHentet = (data: string) => ({
  type: VeilederenheterActionTypes.HENT_AKTIVENHET_HENTET,
  data,
});
