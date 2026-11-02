/**
 * Partial Ereg v1 organisation response, discriminated by organisation type.
 * Empty fields are omitted by the API; dates are ISO-8601 strings.
 * @see https://github.com/navikt/ereg-services/tree/d7f01ec64a3c3ca53d58d6996438dde6dccddf1d/src/main/java/no/nav/ereg/provider/rs/organisasjon/contract
 */
export type EregOrganisasjonResponseDTO = {
  type?: string;
  organisasjonsnummer?: string;
  navn?: EregOrganisasjonNavnDTO;
  organisasjonDetaljer?: EregOrganisasjonDetaljerDTO;
  virksomhetDetaljer?: EregVirksomhetDetaljerDTO;
};

/** Recorded period, using ISO local date-times without timezone offsets. */
export interface EregBruksperiodeDTO {
  fom?: string;
  tom?: string;
}

/** Validity period, using ISO local dates (yyyy-MM-dd). */
export interface EregGyldighetsperiodeDTO {
  fom?: string;
  tom?: string;
}

interface EregPeriodisertDTO {
  bruksperiode?: EregBruksperiodeDTO;
  gyldighetsperiode?: EregGyldighetsperiodeDTO;
}

/** Organisation name, including historical validity information. */
export interface EregOrganisasjonNavnDTO extends EregPeriodisertDTO {
  redigertnavn?: string;
  navnelinje1?: string;
  navnelinje2?: string;
  navnelinje3?: string;
  navnelinje4?: string;
  navnelinje5?: string;
}

/** Common details and historical records for an organisation. */
export interface EregOrganisasjonDetaljerDTO {
  registreringsdato?: string;
  stiftelsesdato?: string;
  opphoersdato?: string;
  sistEndret?: string;
  naeringer?: EregNaringDTO[];
}

/** Details specific to a virksomhet; date values are ISO local dates. */
export interface EregVirksomhetDetaljerDTO {
  oppstartsdato?: string;
  eierskiftedato?: string;
  nedleggelsesdato?: string;
  enhetstype?: string;
  ubemannetVirksomhet?: boolean;
}

/** Naringskode and hjelpeenhet status. */
export interface EregNaringDTO extends EregPeriodisertDTO {
  naeringskode: string;
  hjelpeenhet?: boolean;
}

/** Returns the edited name, the first name line, or an empty string if absent. */
export function getVirksomhetsnavn(
  eregOrganisasjonResponseDTO: EregOrganisasjonResponseDTO,
): string {
  const redigertnavn = eregOrganisasjonResponseDTO.navn?.redigertnavn;
  if (redigertnavn && redigertnavn.length > 0) {
    return redigertnavn;
  } else {
    return eregOrganisasjonResponseDTO.navn?.navnelinje1 ?? "";
  }
}
