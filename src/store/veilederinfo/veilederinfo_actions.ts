import { Veilederinfo } from './veilederinfoTypes';

export const enum VeilederinfoActionTypes {
  HENT_VEILEDERINFO_FORESPURT = 'HENT_VEILEDERINFO_FORESPURT',
  HENT_VEILEDERINFO_HENTER = 'HENT_VEILEDERINFO_HENTER',
  HENT_VEILEDERINFO_FEILET = 'HENT_VEILEDERINFO_FEILET',
  HENT_VEILEDERINFO_HENTET = 'HENT_VEILEDERINFO_HENTET',
}

export const hentVeilederinfo = () => ({
  type: VeilederinfoActionTypes.HENT_VEILEDERINFO_FORESPURT,
});

export const henterVeilederinfo = () => ({
  type: VeilederinfoActionTypes.HENT_VEILEDERINFO_HENTER,
});

export const veilederinfoHentet = (data: Veilederinfo) => ({
  type: VeilederinfoActionTypes.HENT_VEILEDERINFO_HENTET,
  data,
});

export const hentVeilederinfoFeilet = () => ({
  type: VeilederinfoActionTypes.HENT_VEILEDERINFO_FEILET,
});
