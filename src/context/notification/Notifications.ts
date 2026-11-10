import type { ComponentProps } from "react";
import type { LocalAlert } from "@navikt/ds-react";

export type NotificationType =
  | "fetchPersonoversiktFailed"
  | "fetchPersonregisterFailed"
  | "fetchPersonoversiktTilgangFailed"
  | "fetchVeiledereFailed"
  | "fetchAktivVeilederFailed"
  | "tildelVeilederFailed"
  | "tildelVeilederTilgangFailed"
  | "tildelOppfolgingsenhetFailed"
  | "tildelOppfolgingsenhetTilgangFailed"
  | "tildelOppfolgingsenhetSuccess";

export interface Notification extends Pick<
  ComponentProps<typeof LocalAlert>,
  "status"
> {
  type: NotificationType;
  header?: string;
  message: string;
}

export const FetchVeiledereFailed: Notification = {
  type: "fetchVeiledereFailed",
  status: "error",
  message:
    "Vi klarte ikke å laste inn veiledere. Du vil ikke kunne tildele veiledere, og veileder-kolonnen vil vise ident i stedet for navn.",
};

export const FetchAktivVeilederFailed: Notification = {
  type: "fetchAktivVeilederFailed",
  status: "error",
  message:
    'Vi klarte ikke å laste inn aktiv veileder. Fanen "Min oversikt" vil ikke fungere. Vennligst prøv igjen senere.',
};

export const TildelVeilederFailed: Notification = {
  type: "tildelVeilederFailed",
  status: "error",
  message:
    "Det skjedde en feil ved tildeling av veileder. Vennligst prøv igjen senere.",
};

export const TildelVeilederTilgangFailed: Notification = {
  type: "tildelVeilederTilgangFailed",
  status: "error",
  message: "Du har ikke tilgang til å tildele veileder.",
};

export const FetchPersonoversiktFailed: Notification = {
  type: "fetchPersonoversiktFailed",
  status: "error",
  message:
    "Vi klarte ikke laste inn oversikten. Du vil ikke kunne se noen hendelser. Vennligst prøv igjen senere.",
};

export const FetchPersonoversiktTilgangFailed: Notification = {
  type: "fetchPersonoversiktTilgangFailed",
  status: "error",
  message: "Du har ikke tilgang til å hente oversikten.",
};

export const FetchPersonregisterFailed: Notification = {
  type: "fetchPersonregisterFailed",
  status: "error",
  message:
    "Vi klarte ikke laste inn personregister. Enkelte personer vises uten navn eller diskresjonskode.",
};

export const TildelOppfolgingsenhetFailed: Notification = {
  type: "tildelOppfolgingsenhetFailed",
  status: "error",
  message:
    "Det skjedde en feil ved tildeling av oppfølgingsenhet. Vennligst prøv igjen senere.",
};

export const TildelOppfolgingsenhetTilgangFailed: Notification = {
  type: "tildelOppfolgingsenhetTilgangFailed",
  status: "error",
  message: "Du har ikke tilgang til å tildele oppfølgingsenhet.",
};
