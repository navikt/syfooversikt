interface TogglesConfig {
  visVeileder: boolean;
}

interface Markup {
  etterSokefelt?: string;
}

export interface ControlledContextvalue<T> extends BaseContextvalue<T> {
  value?: string;
}

interface UncontrolledContextvalue<T> extends BaseContextvalue<T> {
  initialValue?: string;
}

interface BaseContextvalue<T> {
  display: T;
  skipModal?: boolean;
  ignoreWsEvents?: boolean;

  onChange(value?: string): void;
}

export type Contextvalue<T> =
  | ControlledContextvalue<T>
  | UncontrolledContextvalue<T>;

export enum EnhetDisplay {
  ENHET = 'ENHET',
  ENHET_VALG = 'ENHET_VALG',
}

export enum FnrDisplay {
  SOKEFELT = 'SOKEFELT',
}

type EnhetContextvalue = Contextvalue<EnhetDisplay>;
type FnrContextvalue = Contextvalue<FnrDisplay>;
type ProxyConfig = boolean | string;

export type Environment =
  | 'q0'
  | 'q1'
  | 'q2'
  | 'q3'
  | 'q4'
  | 'prod'
  | 'local'
  | 'mock';

type UrlFormat = 'LOCAL' | 'ADEO' | 'NAV_NO';

export interface DecoratorProps {
  appname: string;
  showEnheter: boolean;
  showSearchArea: boolean;
  showHotkeys: boolean;
  environment: Environment;
  urlFormat: UrlFormat;
  onEnhetChanged: (enhet?: string | null, enhetValue?: Enhet) => void;
  onFnrChanged: (fnr?: string | null) => void;
  fnr?: FnrContextvalue;
  enhet?: EnhetContextvalue;
  toggles?: TogglesConfig;
  markup?: Markup;
  useProxy?: ProxyConfig;
  accessToken?: string;
}
