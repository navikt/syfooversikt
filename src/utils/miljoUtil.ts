export const finnMiljoStreng = (): string => {
  return erPreProd() ? '-q1' : '';
};

export const erProd = (): boolean => {
  return window.location.href.indexOf('nais.adeo.no') > -1;
};

export const erPreProd = (): boolean => {
  return window.location.href.indexOf('nais.preprod.local') > -1;
};

export const erLokal = (): boolean => {
  return window.location.host.indexOf('localhost') > -1;
};

export const erHerokuApp = (): boolean => {
  return window.location.href.indexOf('herokuapp') > -1;
};

export const finnNaisUrlDefault = (): string => {
  return erPreProd() ? '.nais.preprod.local' : '.nais.adeo.no';
};

export const fullNaisUrlDefault = (host: string, path: string): string => {
  if (erLokal()) {
    return path;
  }
  return `https://${host}${finnNaisUrlDefault()}${path}`;
};

export const finnNaisUrlQ1 = (): string => {
  return erPreProd() ? '-q1.nais.preprod.local' : '.nais.adeo.no';
};

export const fullNaisUrlQ1 = (host: string, path: string): string => {
  if (erLokal()) {
    return path;
  }
  return `https://${host}${finnNaisUrlQ1()}${path}`;
};

export const getKubernetesServiceUrl = (host: string, path: string): string => {
  if (erLokal()) {
    return path;
  }
  return `http://${host}${path}`;
};

export const fullAppAdeoUrl = (path: string): string => {
  if (erLokal()) {
    return path;
  }
  return `https://app${finnMiljoStreng()}.adeo.no${path}`;
};
