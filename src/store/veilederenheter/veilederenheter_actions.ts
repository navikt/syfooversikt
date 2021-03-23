export enum VeilederenheterActionTypes {
  HENT_AKTIVENHET_HENTET = 'HENT_AKTIVENHET_HENTET',
}

export interface SetAktivEnhetHentetAction {
  type: VeilederenheterActionTypes.HENT_AKTIVENHET_HENTET;
  data: string;
}

export type VeilederenheterType = SetAktivEnhetHentetAction;

export const setAktivEnhetHentet = (data: string): VeilederenheterType => ({
  type: VeilederenheterActionTypes.HENT_AKTIVENHET_HENTET,
  data,
});
