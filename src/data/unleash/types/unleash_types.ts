export type Toggles = {
  [key in ToggleNames]: boolean;
};

// See toggles: https://teamsykefravr-unleash-web.nav.cloud.nais.io/features
export enum ToggleNames {
  isFlexjarEnabled = 'isFlexjarEnabled',
  isArbeidsuforhetEnabled = 'isArbeidsuforhetEnabled',
}

export const defaultToggles: Toggles = {
  isFlexjarEnabled: false,
  isArbeidsuforhetEnabled: false,
};
