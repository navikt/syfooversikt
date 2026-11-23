import dayjs from "dayjs";
import {
  EregOrganisasjonEnrichedDTO,
  EregOrganisasjonResponseDTO,
} from "@/data/virksomhet/EregOrganisasjonResponseDTO";

/** Returns the current legal entity reference, preferring the latest valid start date. */
export function getJuridiskEnhetOrganisasjonsnummer(
  virksomhet: EregOrganisasjonResponseDTO,
): string | undefined {
  if (virksomhet.type === "JuridiskEnhet") {
    return undefined;
  }

  const today = dayjs();
  return virksomhet.inngaarIJuridiskEnheter
    ?.filter(({ organisasjonsnummer, gyldighetsperiode }) => {
      const { fom, tom } = gyldighetsperiode ?? {};
      return (
        !!organisasjonsnummer &&
        (!fom || !today.isBefore(dayjs(fom), "day")) &&
        (!tom || !today.isAfter(dayjs(tom), "day"))
      );
    })
    .sort((a, b) => {
      const fomA = a.gyldighetsperiode?.fom ?? "";
      const fomB = b.gyldighetsperiode?.fom ?? "";
      return (
        fomB.localeCompare(fomA) ||
        (a.organisasjonsnummer ?? "").localeCompare(b.organisasjonsnummer ?? "")
      );
    })[0]?.organisasjonsnummer;
}

/** Joins fetched organisations with their current legal entity without mutating either input. */
export function enrichWithJuridiskeVirksomheter(
  virksomheter: EregOrganisasjonResponseDTO[],
  juridiskeVirksomheter: EregOrganisasjonResponseDTO[],
): EregOrganisasjonEnrichedDTO[] {
  const juridiskeEnheterByNummer = new Map(
    juridiskeVirksomheter
      .filter((virksomhet) => virksomhet.type === "JuridiskEnhet")
      .map(
        (virksomhet) => [virksomhet.organisasjonsnummer, virksomhet] as const,
      ),
  );

  return virksomheter.map((virksomhet) => {
    if (virksomhet.type === "JuridiskEnhet") {
      return { ...virksomhet, juridiskEnhet: virksomhet };
    }

    const nummer = getJuridiskEnhetOrganisasjonsnummer(virksomhet);
    return {
      ...virksomhet,
      juridiskEnhet: nummer ? juridiskeEnheterByNummer.get(nummer) : undefined,
    };
  });
}
