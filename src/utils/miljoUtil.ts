export function isDev(): boolean {
  return (
    window.location.href.indexOf('dev.intern.nav.no') > -1 ||
    window.location.href.indexOf('intern.dev.nav.no') > -1 ||
    isAnsattDev()
  );
}

export const isAnsattDev = (): boolean => {
  return window.location.href.indexOf('ansatt.dev.nav.no') > -1;
};

export function isLocal(): boolean {
  return window.location.host.indexOf('localhost') > -1;
}

export function isProd(): boolean {
  return window.location.href.indexOf('syfooversikt.intern.nav.no') > -1;
}

export function linkToNewHostAndPath(
  newSubdomain: Subdomain,
  pathname: string
): string {
  if (isLocal()) {
    return `http://localhost:8081${pathname}`;
  }
  const { hostname } = window.location;
  const newHost = hostname.replace(Subdomain.SYFOOVERSIKT, newSubdomain);
  return `https://${newHost}${pathname}`;
}

export enum Subdomain {
  SYFOOVERSIKT = 'syfooversikt',
  SYFOMODIAPERSON = 'syfomodiaperson',
  SYFOMOTEOVERSIKT = 'syfomoteoversikt',
}
