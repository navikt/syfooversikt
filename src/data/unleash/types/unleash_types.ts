export type Toggles = {
  [key in ToggleNames]: boolean;
};

// See toggles: https://teamsykefravr-unleash-web.nav.cloud.nais.io/features
export enum ToggleNames {
  isHuskelappEnabled = 'isHuskelappEnabled',
  isFlexjarEnabled = 'isFlexjarEnabled',
}

export const defaultToggles: Toggles = {
  isHuskelappEnabled: false,
  isFlexjarEnabled: false,
};
