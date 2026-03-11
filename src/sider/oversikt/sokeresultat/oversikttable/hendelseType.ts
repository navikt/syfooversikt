/**
 * Canonical display order for hendelse types.
 * The enum ordinal defines the sort order used by both HendelseColumn and FristDataCell.
 * New entries must be inserted at the position matching their desired display order.
 */
export enum HendelseType {
  AKTIVITETSKRAV,
  ARBEIDSUFORHET,
  BISTANDSBEHOV_FRA_BEHANDLER,
  DIALOGMELDING,
  DIALOGMOTE,
  DIALOGMOTE_MOTEBEHOV,
  DIALOGMOTE_NYTT_SVAR,
  FRISKMELDING_TIL_ARBEIDSFORMIDLING,
  OPPFOLGINGSOPPGAVE,
  OPPFOLGINGSPLAN,
  SEN_OPPFOLGING,
  MANGLENDE_MEDVIRKNING,
  KARTLEGGINGSSPORSMAL,
}
