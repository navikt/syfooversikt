import {
  PersonData,
  PersonregisterState,
} from "@/api/types/personregisterTypes";

export function mapPersonregisterToCompanyList(
  personregister: PersonregisterState,
): string[] {
  const allCompanyNames = Object.entries(personregister).flatMap(
    ([, personData]) => companyNamesFromPersonData(personData),
  );
  return [...new Set(allCompanyNames)].filter((v) => v && v.length > 0);
}

export function companyNamesFromPersonData(personData: PersonData): string[] {
  return personData.latestOppfolgingstilfelle
    ? (personData.latestOppfolgingstilfelle.virksomhetList
        .map(({ virksomhetsnavn }) => virksomhetsnavn)
        .filter((v) => !!v) as string[])
    : [];
}

export function virksomhetnummerFromPersonData(
  personData: PersonData,
): string[] {
  return (
    personData.latestOppfolgingstilfelle?.virksomhetList.map(
      ({ virksomhetsnummer }) => virksomhetsnummer,
    ) ?? []
  );
}

export function firstCompanyNameFromPersonData(
  personData: PersonData,
): string | undefined {
  return companyNamesFromPersonData(personData).shift();
}
