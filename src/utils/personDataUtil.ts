import {
  PersonData,
  PersonregisterState,
} from '@/store/personregister/personregisterTypes';
import { Veileder } from '@/store/veiledere/veiledereTypes';

export const skjermingskode = (person: PersonData): string => {
  return person.skjermingskode && person.skjermingskode !== 'INGEN'
    ? person.skjermingskode.toLowerCase().replace('_', ' ')
    : '';
};

export const veilederEllerNull = (veileder?: Veileder): string | null => {
  if (veileder) {
    return veileder.fornavn === ''
      ? veileder.ident
      : `${veileder.etternavn}, ${veileder.fornavn}`;
  }
  return null;
};

export const mapPersonregisterToCompanyList = (
  personregister: PersonregisterState
): string[] => {
  const allCompanyNames: string[] = [];
  Object.keys(personregister).forEach((fnr) => {
    const personData = personregister[fnr];
    allCompanyNames.push(...companyNamesFromPersonData(personData));
  });
  return [...new Set(allCompanyNames)].filter((v) => v && v.length > 0);
};

export const companyNamesFromPersonData = (p: PersonData): string[] => {
  const allCompaniesForPerson: string[] = [];
  const events = p.oppfolgingstilfeller || [];
  events.forEach((v) => allCompaniesForPerson.push(v.virksomhetsnavn));
  return allCompaniesForPerson;
};

export const firstCompanyNameFromPersonData = (
  p: PersonData
): string | undefined => {
  return companyNamesFromPersonData(p).shift();
};
