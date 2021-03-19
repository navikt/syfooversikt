export const finnMiljoStreng = () => {
  return erPreProd() ? '-q1' : '';
};

export const erProd = () => {
  return window.location.href.indexOf('nais.adeo.no') > -1;
};

export const erPreProd = () => {
  return window.location.href.indexOf('nais.preprod.local') > -1;
};

export const erLokal = () => {
  return window.location.host.indexOf('localhost') > -1;
};

export const erHerokuApp = () => {
  return window.location.href.indexOf('herokuapp') > -1;
};

export const finnNaisUrlDefault = () => {
  return erPreProd() ? '.nais.preprod.local' : '.nais.adeo.no';
};

export const fullNaisUrlDefault = (host: string, path: string) => {
  if (erLokal()) {
    return path;
  }
  return `https://${host}${finnNaisUrlDefault()}${path}`;
};

export const finnNaisUrlQ1 = () => {
  return erPreProd() ? '-q1.nais.preprod.local' : '.nais.adeo.no';
};

export const fullNaisUrlQ1 = (host: string, path: string) => {
  if (erLokal()) {
    return path;
  }
  return `https://${host}${finnNaisUrlQ1()}${path}`;
};

export const getKubernetesServiceUrl = (host: string, path: string) => {
  if (erLokal()) {
    return path;
  }
  return `http://${host}${path}`;
};

export const fullAppAdeoUrl = (path: string) => {
  if (erLokal()) {
    return path;
  }
  return `https://app${finnMiljoStreng()}.adeo.no${path}`;
};
