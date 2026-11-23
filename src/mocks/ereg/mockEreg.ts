import {
  EregOrganisasjonReferanseDTO,
  EregOrganisasjonResponseDTO,
} from "@/data/virksomhet/EregOrganisasjonResponseDTO.ts";
import { http, HttpResponse } from "msw";

interface EregMockData {
  [key: string]: EregOrganisasjonResponseDTO;
}

const navHovedenhet: EregOrganisasjonReferanseDTO = {
  organisasjonsnummer: "987654330",
  navn: { navnelinje1: "Nav testhovedenhet" },
  bruksperiode: { fom: "2009-08-03T04:22:02.656" },
  gyldighetsperiode: { fom: "2009-08-03" },
};

const investmentHovedenhet: EregOrganisasjonReferanseDTO = {
  organisasjonsnummer: "987654331",
  navn: { navnelinje1: "Investment testhovedenhet AS" },
  bruksperiode: { fom: "2026-08-03T04:22:02.656" },
  gyldighetsperiode: { fom: "2026-08-03" },
};

const kompaniHovedenhet: EregOrganisasjonReferanseDTO = {
  organisasjonsnummer: "987654332",
  navn: { navnelinje1: "Kompani testhovedenhet AS" },
  bruksperiode: { fom: "2026-08-03T04:22:02.656" },
  gyldighetsperiode: { fom: "2026-08-03" },
};

const eregResponses: EregMockData = {
  "987654321": {
    type: "Virksomhet",
    inngaarIJuridiskEnheter: [navHovedenhet],
    navn: {
      navnelinje1: "NAV Security",
    },
    organisasjonDetaljer: {
      naeringer: [
        {
          naeringskode: "70.220",
          hjelpeenhet: false,
          bruksperiode: {
            fom: "2009-08-03T04:22:02.656",
          },
          gyldighetsperiode: {
            fom: "2009-08-03",
          },
        },
        {
          naeringskode: "62.020",
          hjelpeenhet: false,
          bruksperiode: {
            fom: "2009-08-03T04:22:02.656",
          },
          gyldighetsperiode: {
            fom: "2009-08-03",
          },
        },
      ],
    },
  },
  "987654322": {
    type: "Virksomhet",
    inngaarIJuridiskEnheter: [investmentHovedenhet],
    navn: {
      navnelinje1: "NAV Investment",
      redigertnavn: "NAV Investments",
    },
    organisasjonDetaljer: {
      naeringer: [
        {
          naeringskode: "70.200",
          hjelpeenhet: false,
          bruksperiode: {
            fom: "2026-08-03T04:22:02.656",
          },
          gyldighetsperiode: {
            fom: "2026-08-03",
          },
        },
      ],
    },
  },
  "987654324": {
    type: "Virksomhet",
    inngaarIJuridiskEnheter: [kompaniHovedenhet],
    navn: {
      navnelinje1: "Kompani & Co. AS",
    },
    organisasjonDetaljer: {
      naeringer: [
        {
          naeringskode: "62.200",
          hjelpeenhet: false,
          bruksperiode: {
            fom: "2026-08-03T04:22:02.656",
          },
          gyldighetsperiode: {
            fom: "2026-08-03",
          },
        },
      ],
    },
  },
  "987654328": {
    type: "Virksomhet",
    inngaarIJuridiskEnheter: [kompaniHovedenhet],
    navn: {
      navnelinje1: "Bolle Og Brus",
    },
    organisasjonDetaljer: {
      naeringer: [
        {
          naeringskode: "01.410",
          hjelpeenhet: false,
          bruksperiode: {
            fom: "1997-08-03T04:22:02.656",
          },
          gyldighetsperiode: {
            fom: "1997-08-03",
          },
        },
      ],
    },
  },
  "987654320": {
    type: "Virksomhet",
    inngaarIJuridiskEnheter: [navHovedenhet],
    navn: {
      navnelinje1: "Samme Virksomhet AS",
      redigertnavn: "Annen Virksomhet AS",
    },
    organisasjonDetaljer: {
      naeringer: [
        {
          naeringskode: "71.330",
          hjelpeenhet: false,
          bruksperiode: {
            fom: "2003-08-03T04:22:02.656",
          },
          gyldighetsperiode: {
            fom: "2003-08-03",
          },
        },
      ],
    },
  },
  "987654330": {
    type: "JuridiskEnhet",
    navn: navHovedenhet.navn,
    juridiskEnhetDetaljer: { sektorkode: "6100" },
  },
  "987654331": {
    type: "JuridiskEnhet",
    navn: investmentHovedenhet.navn,
    juridiskEnhetDetaljer: { sektorkode: "2100" },
  },
  "987654332": {
    type: "JuridiskEnhet",
    navn: kompaniHovedenhet.navn,
    juridiskEnhetDetaljer: { sektorkode: "2100" },
  },
};

export const mockEreg = http.get<{ orgnr: string }>(
  "/ereg/api/v1/organisasjon/:orgnr",
  ({ params, request }) => {
    const organisasjon = eregResponses[params.orgnr];
    if (!organisasjon) {
      return HttpResponse.json({ organisasjonsnummer: params.orgnr });
    }
    const eregResponse = {
      ...organisasjon,
      organisasjonsnummer: params.orgnr,
    };
    const includeHierarchy =
      (eregResponse.type === "Virksomhet" ||
        eregResponse.type === "Organisasjonsledd") &&
      new URL(request.url).searchParams.get("inkluderHierarki") !== "true";

    if (includeHierarchy) delete eregResponse.inngaarIJuridiskEnheter;

    return HttpResponse.json(eregResponse);
  },
);
