import { AlertProps } from '@navikt/ds-react';

export type NotificationType =
  | 'fetchPersonoversiktFailed'
  | 'fetchPersonregisterFailed'
  | 'fetchVeiledereFailed'
  | 'fetchAktivVeilederFailed'
  | 'tildelVeilederFailed';

export interface Notification extends Pick<AlertProps, 'variant'> {
  type: NotificationType;
  message: string;
}

export const FetchVeiledereFailed: Notification = {
  type: 'fetchVeiledereFailed',
  variant: 'error',
  message:
    'Vi klarte ikke å laste inn veiledere. Du vil ikke kunne tildele veiledere, og veileder-kolonnen vil vise ident i stedet for navn.',
};

export const FetchAktivVeilederFailed: Notification = {
  type: 'fetchAktivVeilederFailed',
  variant: 'error',
  message:
    'Vi klarte ikke å laste inn aktiv veileder. Fanen "Min oversikt" vil ikke fungere. Vennligst prøv igjen senere.',
};

export const TildelVeilederFailed: Notification = {
  type: 'tildelVeilederFailed',
  variant: 'error',
  message:
    'Det skjedde en feil ved tildeling av veileder. Vennligst prøv igjen senere.',
};

export const FetchPersonoversiktFailed: Notification = {
  type: 'fetchPersonoversiktFailed',
  variant: 'error',
  message:
    'Vi klarte ikke laste inn personoversikten. Du vil ikke kunne se noen hendelser. Vennligst prøv igjen senere.',
};

export const FetchPersonregisterFailed: Notification = {
  type: 'fetchPersonregisterFailed',
  variant: 'error',
  message:
    'Vi klarte ikke laste inn personregister. Enkelte personer vises uten navn eller diskresjonskode.',
};
