import {
  PersonData,
  PersonregisterState,
} from '@/api/types/personregisterTypes';
import { AktivitetskravStatus } from '@/api/types/personoversiktTypes';

export const skjermingskode = (person: PersonData): string => {
  return person.skjermingskode && person.skjermingskode !== 'INGEN'
    ? person.skjermingskode.toLowerCase().replace('_', ' ')
    : '';
};

export const mapPersonregisterToCompanyList = (
  personregister: PersonregisterState
): string[] => {
  const allCompanyNames = Object.entries(
    personregister
  ).flatMap(([, persondata]) => companyNamesFromPersonData(persondata));

  return [...new Set(allCompanyNames)].filter((v) => v && v.length > 0);
};

export const companyNamesFromPersonData = (p: PersonData): string[] => {
  return p.latestOppfolgingstilfelle
    ? (p.latestOppfolgingstilfelle.virksomhetList
        .map(({ virksomhetsnavn }) => virksomhetsnavn)
        .filter((v) => !!v) as string[])
    : [];
};

export const firstCompanyNameFromPersonData = (
  p: PersonData
): string | undefined => {
  return companyNamesFromPersonData(p).shift();
};

export const hasActiveAktivitetskravStatus = (personData: PersonData) => {
  return (
    personData.aktivitetskrav === AktivitetskravStatus.NY ||
    personData.aktivitetskrav === AktivitetskravStatus.AVVENT
  );
};
