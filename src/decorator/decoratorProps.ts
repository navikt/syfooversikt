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
  onChange(value?: string): void;
  skipModal?: boolean;
  ignoreWsEvents?: boolean;
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

export interface DecoratorProps {
  appname: string;
  fnr?: FnrContextvalue;
  enhet?: EnhetContextvalue;
  toggles?: TogglesConfig;
  markup?: Markup;
  useProxy?: ProxyConfig;
  accessToken?: string;
}
