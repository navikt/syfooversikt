import {
  PersonData,
  PersonregisterState,
  Skjermingskode,
} from '@/api/types/personregisterTypes';
import { earliestDate, latestDate } from '@/utils/dateUtils';

export const getReadableSkjermingskode = (skjermingskode: Skjermingskode) => {
  switch (skjermingskode) {
    case 'INGEN':
      return 'Ingen';
    case 'DISKRESJONSMERKET':
      return 'Diskresjonsmerket';
    case 'EGEN_ANSATT':
      return 'Egen ansatt';
  }
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

export const virksomhetnummerFromPersonData = (p: PersonData): string[] => {
  return p.latestOppfolgingstilfelle
    ? p.latestOppfolgingstilfelle.virksomhetList.map(
        ({ virksomhetsnummer }) => virksomhetsnummer
      )
    : [];
};

export const firstCompanyNameFromPersonData = (
  p: PersonData
): string | undefined => {
  return companyNamesFromPersonData(p).shift();
};

const allFrister = (personData: PersonData): Date[] => {
  return [
    personData.aktivitetskravVurderingFrist,
    personData.oppfolgingsoppgave?.frist,
    personData.friskmeldingTilArbeidsformidlingFom,
    personData.arbeidsuforhetvurdering?.varsel?.svarfrist,
    personData.aktivitetskravvurdering?.vurderinger[0]?.frist,
    personData.aktivitetskravvurdering?.vurderinger[0]?.varsel?.svarfrist,
  ].filter((frist) => frist) as Date[];
};

export const getEarliestFrist = (personData: PersonData): Date | null => {
  const frister = allFrister(personData);

  return earliestDate(frister);
};

export const getLatestFrist = (personData: PersonData): Date | null => {
  const frister = allFrister(personData);

  return latestDate(frister);
};
