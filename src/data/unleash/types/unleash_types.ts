export type Toggles = {
  [key in ToggleNames]: boolean;
};

// See toggles: https://teamsykefravr-unleash-web.nav.cloud.nais.io/features
export enum ToggleNames {
  isTildelOppfolgingsenhetEnabled = "isTildelOppfolgingsenhetEnabled",
  isKartleggingssporsmalEnabled = "isKartleggingssporsmalEnabled",
}

export const defaultToggles: Toggles = {
  isTildelOppfolgingsenhetEnabled: false,
  isKartleggingssporsmalEnabled: false,
};
