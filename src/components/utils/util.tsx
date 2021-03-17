import { PersonHendelseData } from '../../store/personregister/personregisterTypes';
import { PersonoversiktStatus } from '../../store/personoversikt/personoversiktTypes';

export const hentFodselsnummerFraPersonHendelseListe = (
  svarListe: PersonHendelseData[]
) => {
  return svarListe.map((hendelseObjekt) => ({
    fnr: hendelseObjekt.fnr,
  }));
};

export const hentFodselsnummerFraPersonOversikt = (
  personListe: PersonoversiktStatus[]
) => {
  return personListe.map((person) => ({
    fnr: person.fnr,
  }));
};
