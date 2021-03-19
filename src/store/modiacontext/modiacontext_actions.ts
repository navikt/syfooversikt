import { HentAktivEnhetData, ModiacontextPayload } from './modiacontextTypes';

export enum modiacontextActionTypes {
  PUSH_MODIACONTEXT_FORESPURT = 'PUSH_MODIACONTEXT_FORESPURT',
  PUSH_MODIACONTEXT_FEILET = 'PUSH_MODIACONTEXT_FEILET',
  PUSH_MODIACONTEXT_PUSHET = 'PUSH_MODIACONTEXT_PUSHET',
  PUSH_MODIACONTEXT_PUSHER = 'PUSH_MODIACONTEXT_PUSHER',
  HENT_AKTIVENHET_FORESPURT = 'HENT_AKTIVENHET_FORESPURT',
  HENT_AKTIVENHET_HENTER = 'HENT_AKTIVENHET_HENTER',
  HENT_AKTIVENHET_FEILET = 'HENT_AKTIVENHET_FEILET',
}

export interface HentAktivEnhetAction {
  type: modiacontextActionTypes.HENT_AKTIVENHET_FORESPURT;
  data: HentAktivEnhetData;
}

export interface HentAktivEnhetFeiletAction {
  type: modiacontextActionTypes.HENT_AKTIVENHET_FEILET;
}

export interface HenterAktivEnhetAction {
  type: modiacontextActionTypes.HENT_AKTIVENHET_HENTER;
}

export interface PushModiaContextFeiletAction {
  type: modiacontextActionTypes.PUSH_MODIACONTEXT_FEILET;
}

export interface PusherModiaContextAction {
  type: modiacontextActionTypes.PUSH_MODIACONTEXT_PUSHER;
}

export interface PushModiaContextAction {
  type: modiacontextActionTypes.PUSH_MODIACONTEXT_FORESPURT;
  data: ModiacontextPayload;
}

export interface ModiaContextPushetAction {
  type: modiacontextActionTypes.PUSH_MODIACONTEXT_PUSHET;
  data: ModiacontextPayload;
}

export type ModiaAction =
  | HentAktivEnhetAction
  | HentAktivEnhetFeiletAction
  | HenterAktivEnhetAction
  | PushModiaContextFeiletAction
  | PusherModiaContextAction
  | PushModiaContextAction
  | ModiaContextPushetAction;

export const hentAktivEnhet = (
  data: HentAktivEnhetData
): HentAktivEnhetAction => ({
  type: modiacontextActionTypes.HENT_AKTIVENHET_FORESPURT,
  data,
});

export const hentAktivEnhetFeilet = (): ModiaAction => ({
  type: modiacontextActionTypes.HENT_AKTIVENHET_FEILET,
});

export const henterAktivEnhet = (): ModiaAction => ({
  type: modiacontextActionTypes.HENT_AKTIVENHET_HENTER,
});

export const pushModiaContextFeilet = (): ModiaAction => ({
  type: modiacontextActionTypes.PUSH_MODIACONTEXT_FEILET,
});

export const pusherModiaContext = (): ModiaAction => ({
  type: modiacontextActionTypes.PUSH_MODIACONTEXT_PUSHER,
});

export const pushModiaContext = (data: ModiacontextPayload): ModiaAction => ({
  type: modiacontextActionTypes.PUSH_MODIACONTEXT_FORESPURT,
  data,
});

export const modiaContextPushet = (data: ModiacontextPayload): ModiaAction => ({
  type: modiacontextActionTypes.PUSH_MODIACONTEXT_PUSHET,
  data,
});
