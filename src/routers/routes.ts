export const routes = {
  ENHET_OVERSIKT: '/enhet',
  MIN_OVERSIKT: '/minoversikt',
  SOK_SYKMELDT: '/sok',
} as const;

export type Routes = typeof routes[keyof typeof routes];
