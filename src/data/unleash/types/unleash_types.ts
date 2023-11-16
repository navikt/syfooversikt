export type Toggles = {
  [key in ToggleNames]: boolean;
};

// See toggles: https://teamsykefravr-unleash-web.nav.cloud.nais.io/features
export enum ToggleNames {
  isMotebehovTilbakemeldingEnabled = 'isMotebehovTilbakemeldingEnabled',
  isHuskelappEnabled = 'isHuskelappEnabled',
}

export const defaultToggles: Toggles = {
  isMotebehovTilbakemeldingEnabled: false,
  isHuskelappEnabled: false,
};
