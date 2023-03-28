export type Toggles = {
  [key in ToggleNames]: boolean;
};

// See https://unleash.nais.io/#/features (syfomodiaperson)
export enum ToggleNames {
  behandlerdialog = 'syfo.behandlerdialog',
  aktivitetskravVurderingFrist = 'syfo.aktivitetskrav.vurdering.frist',
}
