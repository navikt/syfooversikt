export type Toggles = {
  [key in ToggleNames]: boolean;
};

// See toggles: https://teamsykefravr-unleash-web.nav.cloud.nais.io/features
export enum ToggleNames {
  isFlexjarArenaEnabled = 'isFlexjarArenaEnabled',
  isFrisktilarbeidEnabled = 'isFrisktilarbeidEnabled',
  isAkselOversiktEnabled = 'isAkselOversiktEnabled',
}

export const defaultToggles: Toggles = {
  isFlexjarArenaEnabled: false,
  isFrisktilarbeidEnabled: false,
  isAkselOversiktEnabled: false,
};
