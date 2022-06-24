export type Toggles = {
  [key in ToggleNames]: boolean;
};

// See https://unleash.nais.io/#/features (syfomodiaperson)
export enum ToggleNames {
  dialogmotekandidat = 'syfo.dialogmote.kandidat',
  dialogmotesvar = 'syfo.dialogmote.svar',
}
