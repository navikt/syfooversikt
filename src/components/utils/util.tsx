import { PersonHendelseData } from '@/api/types/personregisterTypes';
import { PersonOversiktStatusDTO } from '@/api/types/personoversiktTypes';

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
  personListe: PersonOversiktStatusDTO[]
): FnrMap[] => {
  return personListe?.map((person) => ({
    fnr: person.fnr,
  }));
};
