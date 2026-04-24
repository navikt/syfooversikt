export type Toggles = {
  [key in ToggleNames]: boolean;
};

// See toggles: https://teamsykefravr-unleash-web.nav.cloud.nais.io/features
export enum ToggleNames {
  isRutingFlexjarEnabled = 'isRutingFlexjarEnabled',
  isTildelOppfolgingsenhetEnabled = 'isTildelOppfolgingsenhetEnabled',
  isKartleggingssporsmalEnabled = 'isKartleggingssporsmalEnabled',
}

export const defaultToggles: Toggles = {
  isRutingFlexjarEnabled: false,
  isTildelOppfolgingsenhetEnabled: false,
  isKartleggingssporsmalEnabled: false,
};
