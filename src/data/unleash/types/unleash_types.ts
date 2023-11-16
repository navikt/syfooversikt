export type Toggles = {
  [key in ToggleNames]: boolean;
};

// See toggles: https://teamsykefravr-unleash-web.nav.cloud.nais.io/features
export enum ToggleNames {
  isHuskelappEnabled = 'isHuskelappEnabled',
}

export const defaultToggles: Toggles = {
  isHuskelappEnabled: false,
};
