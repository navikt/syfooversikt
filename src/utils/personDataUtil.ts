import {
  PersonData,
  PersonregisterState,
  ReadableSkjermingskodeMap,
  Skjermingskode,
} from '@/api/types/personregisterTypes';

const readableSkjermingskoder: ReadableSkjermingskodeMap = {
  INGEN: 'ingen',
  DISKRESJONSMERKET: 'diskresjonsmerket',
  EGEN_ANSATT: 'egen ansatt',
};
export const getReadableSkjermingskode = (skjermingskode: Skjermingskode) => {
  return readableSkjermingskoder[skjermingskode];
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
