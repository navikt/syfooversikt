import { PersonHendelseData } from '@/api/types/personregisterTypes';
import { PersonoversiktStatus } from '@/api/types/personoversiktTypes';

export interface FnrMap {
  fnr: string;
}

export const hentFodselsnummerFraPersonHendelseListe = (
  svarListe: PersonHendelseData[]
): FnrMap[] => {
  return svarListe.map((hendelseObjekt) => ({
    fnr: hendelseObjekt.fnr,
  }));
};

export const hentFodselsnummerFraPersonOversikt = (
  personListe: PersonoversiktStatus[]
): FnrMap[] => {
  return personListe?.map((person) => ({
    fnr: person.fnr,
  }));
};
