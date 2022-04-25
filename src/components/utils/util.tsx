import { PersonHendelseData } from '@/api/types/personregisterTypes';

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
