import { VeilederArbeidstaker } from './veilederArbeidstakerTypes';

export enum veilederArbeidstakerActionTypes {
  PUSH_VEILEDERARBEIDSTAKER_PUSHER = 'PUSH_VEILEDERARBEIDSTAKER_PUSHER',
  PUSH_VEILEDERARBEIDSTAKER_PUSHET = 'PUSH_VEILEDERARBEIDSTAKER_PUSHET',
  PUSH_VEILEDERARBEIDSTAKER_FORESPURT = 'PUSH_VEILEDERARBEIDSTAKER_FORESPURT',
  PUSH_VEILEDERARBEIDSTAKER_FEILET = 'PUSH_VEILEDERARBEIDSTAKER_FEILET',
}

export interface PushVeilederArbeidstakerForespurtAction {
  type: veilederArbeidstakerActionTypes.PUSH_VEILEDERARBEIDSTAKER_FORESPURT;
  data: VeilederArbeidstaker[];
}

export interface PushVeilederArbeidstakerPusherAction {
  type: veilederArbeidstakerActionTypes.PUSH_VEILEDERARBEIDSTAKER_PUSHER;
}

export interface PushVeilederArbeidstakerPushetAction {
  type: veilederArbeidstakerActionTypes.PUSH_VEILEDERARBEIDSTAKER_PUSHET;
  data: VeilederArbeidstaker[];
}

export interface PushVeilederArbeidstakerFeiletAction {
  type: veilederArbeidstakerActionTypes.PUSH_VEILEDERARBEIDSTAKER_FEILET;
}

export type VeilederArbeidstakerType =
  | PushVeilederArbeidstakerForespurtAction
  | PushVeilederArbeidstakerPusherAction
  | PushVeilederArbeidstakerPushetAction
  | PushVeilederArbeidstakerFeiletAction;

export const pushVeilederArbeidstakerForespurt = (
  data: VeilederArbeidstaker[]
): VeilederArbeidstakerType => ({
  type: veilederArbeidstakerActionTypes.PUSH_VEILEDERARBEIDSTAKER_FORESPURT,
  data,
});

export const pushVeilederArbeidstakerPusher = (): VeilederArbeidstakerType => ({
  type: veilederArbeidstakerActionTypes.PUSH_VEILEDERARBEIDSTAKER_PUSHER,
});

export const pushVeilederArbeidstakerPushet = (
  data: VeilederArbeidstaker[]
): VeilederArbeidstakerType => ({
  type: veilederArbeidstakerActionTypes.PUSH_VEILEDERARBEIDSTAKER_PUSHET,
  data,
});

export const pushVeilederArbeidstakerFeilet = (): VeilederArbeidstakerType => ({
  type: veilederArbeidstakerActionTypes.PUSH_VEILEDERARBEIDSTAKER_FEILET,
});
