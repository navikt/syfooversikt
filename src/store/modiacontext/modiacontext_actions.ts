import {
  HentAktivEnhetData,
  Modiacontext,
  ModiacontextPayload,
} from './modiacontextTypes';

export const enum modiacontextActionTypes {
  PUSH_MODIACONTEXT_FORESPURT = 'PUSH_MODIACONTEXT_FORESPURT',
  PUSH_MODIACONTEXT_FEILET = 'PUSH_MODIACONTEXT_FEILET',
  PUSH_MODIACONTEXT_PUSHET = 'PUSH_MODIACONTEXT_PUSHET',
  PUSH_MODIACONTEXT_PUSHER = 'PUSH_MODIACONTEXT_PUSHER',
  HENT_AKTIVENHET_FORESPURT = 'HENT_AKTIVENHET_FORESPURT',
  HENT_AKTIVENHET_HENTER = 'HENT_AKTIVENHET_HENTER',
  HENT_AKTIVENHET_FEILET = 'HENT_AKTIVENHET_FEILET',
  HENT_AKTIVENHET_HENTET = 'HENT_AKTIVENHET_HENTET',
}

export const hentAktivEnhet = (data: HentAktivEnhetData) => ({
  type: modiacontextActionTypes.HENT_AKTIVENHET_FORESPURT,
  data,
});

export const hentAktivEnhetFeilet = () => ({
  type: modiacontextActionTypes.HENT_AKTIVENHET_FEILET,
});

export const henterAktivEnhet = () => ({
  type: modiacontextActionTypes.HENT_AKTIVENHET_HENTER,
});

export const aktivEnhetHentet = (data: Modiacontext) => ({
  type: modiacontextActionTypes.HENT_AKTIVENHET_HENTET,
  data,
});

export const pushModiaContextFeilet = () => ({
  type: modiacontextActionTypes.PUSH_MODIACONTEXT_FEILET,
});

export const pusherModiaContext = () => ({
  type: modiacontextActionTypes.PUSH_MODIACONTEXT_PUSHER,
});

export const pushModiaContext = (data: ModiacontextPayload) => ({
  type: modiacontextActionTypes.PUSH_MODIACONTEXT_FORESPURT,
  data,
});

export const modiaContextPushet = (data: ModiacontextPayload) => ({
  type: modiacontextActionTypes.PUSH_MODIACONTEXT_PUSHET,
  data,
});
