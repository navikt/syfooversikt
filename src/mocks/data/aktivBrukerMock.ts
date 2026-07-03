import { AktivBrukerDTO } from "@/data/modiacontext/modiacontextTypes.ts";

export const ARBEIDSTAKER_DEFAULT = {
  epost: "korrupt@farligheismontering.no",
  personIdent: "01999911111",
  navn: {
    fornavn: "Korrupt",
    etternavn: "Heis",
  },
};

export const AKTIV_BRUKER_DEFAULT: Partial<AktivBrukerDTO> = {
  aktivBruker: ARBEIDSTAKER_DEFAULT.personIdent,
};
