import dotenv from 'dotenv';

dotenv.config();

interface EnvVarType {
  name: any;
  defaultValue?: any;
}

const envVar = ({ name, defaultValue }: EnvVarType) => {
  const fromEnv = process.env[name];
  if (fromEnv) {
    return fromEnv;
  }
  if (typeof defaultValue === 'string') {
    return defaultValue;
  } else if (typeof defaultValue === 'object') {
    if (isDev && typeof defaultValue.dev === 'string') {
      return defaultValue.dev;
    }
    if (isProd && typeof defaultValue.prod === 'string') {
      return defaultValue.prod;
    }
  }
  throw new Error(`Missing required environment variable ${name}`);
};

export const isDev = envVar({ name: 'NODE_ENV' }) === 'development';
export const isProd = envVar({ name: 'NODE_ENV' }) === 'production';

export interface ExternalAppConfig {
  applicationName: string;
  clientId: string;
  host: string;
  tokenSetId?: any;
  removePathPrefix?: boolean;
}

// Config used internally in the server
export const server = {
  host: envVar({ name: 'HOST', defaultValue: 'localhost' }),
  port: Number.parseInt(envVar({ name: 'PORT', defaultValue: '8080' })),
  logLevel: envVar({ name: 'LOG_LEVEL', defaultValue: 'info' }),
};

// For auth
export const auth = {
  texas: {
    introspectionEndpoint: envVar({
      name: 'NAIS_TOKEN_INTROSPECTION_ENDPOINT',
    }),
    tokenExchangeEndpoint: envVar({
      name: 'NAIS_TOKEN_EXCHANGE_ENDPOINT',
    }),
  },
  ereg: {
    applicationName: 'ereg',
    clientId: '',
    host: envVar({
      name: 'EREG_HOST',
    }),
  },
  modiacontextholder: {
    applicationName: 'modiacontextholder',
    clientId: envVar({
      name: 'MODIACONTEXTHOLDER_AAD_APP_CLIENT_ID',
    }),
    host: envVar({
      name: 'MODIACONTEXTHOLDER_HOST',
    }),
    removePathPrefix: true,
  },
  syfooversiktsrv: {
    applicationName: 'syfooversiktsrv',
    clientId: envVar({
      name: 'SYFOOVERSIKTSRV_AAD_APP_CLIENT_ID',
    }),
    host: envVar({
      name: 'SYFOOVERSIKTSRV_HOST',
    }),
  },
  syfoperson: {
    applicationName: 'syfoperson',
    clientId: envVar({
      name: 'SYFOPERSON_AAD_APP_CLIENT_ID',
    }),
    host: envVar({
      name: 'SYFOPERSON_HOST',
    }),
  },
  syfoveileder: {
    applicationName: 'syfoveileder',
    clientId: envVar({
      name: 'SYFOVEILEDER_AAD_APP_CLIENT_ID',
    }),
    host: envVar({
      name: 'SYFOVEILEDER_HOST',
    }),
  },
  syfobehandlendeenhet: {
    applicationName: 'syfobehandlendeenhet',
    clientId: envVar({
      name: 'SYFOBEHANDLENDEENHET_AAD_APP_CLIENT_ID',
    }),
    host: envVar({
      name: 'SYFOBEHANDLENDEENHET_HOST',
    }),
    removePathPrefix: true,
  },
  flexjar: {
    applicationName: 'flexjar-backend',
    clientId: envVar({
      name: 'FLEXJAR_AAD_APP_CLIENT_ID',
    }),
    host: envVar({
      name: 'FLEXJAR_HOST',
    }),
    removePathPrefix: true,
  },
};

export const unleashConfig: { serverApiUrl: string; serverApiToken: string } = {
  serverApiUrl: envVar({ name: 'UNLEASH_SERVER_API_URL' }),
  serverApiToken: envVar({ name: 'UNLEASH_SERVER_API_TOKEN' }),
};
