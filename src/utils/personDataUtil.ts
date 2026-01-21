import {
  PersonData,
  PersonregisterState,
} from '@/api/types/personregisterTypes';

export function mapPersonregisterToCompanyList(
  personregister: PersonregisterState
): string[] {
  const allCompanyNames = Object.entries(
    personregister
  ).flatMap(([, persondata]) => companyNamesFromPersonData(persondata));
  return [...new Set(allCompanyNames)].filter((v) => v && v.length > 0);
}

export function companyNamesFromPersonData(p: PersonData): string[] {
  return p.latestOppfolgingstilfelle
    ? (p.latestOppfolgingstilfelle.virksomhetList
        .map(({ virksomhetsnavn }) => virksomhetsnavn)
        .filter((v) => !!v) as string[])
    : [];
}

export function virksomhetnummerFromPersonData(p: PersonData): string[] {
  return p.latestOppfolgingstilfelle
    ? p.latestOppfolgingstilfelle.virksomhetList.map(
        ({ virksomhetsnummer }) => virksomhetsnummer
      )
    : [];
}

export function firstCompanyNameFromPersonData(
  p: PersonData
): string | undefined {
  return companyNamesFromPersonData(p).shift();
}
