import { EregOrganisasjonResponseDTO } from "@/data/virksomhet/EregOrganisasjonResponseDTO.ts";
import { http, HttpResponse } from "msw";

interface EregMockData {
  [key: string]: EregOrganisasjonResponseDTO;
}

const eregResponses: EregMockData = {
  "987654321": {
    type: "Virksomhet",
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
};

export const mockEreg = http.get<{ orgnr: string }>(
  "/ereg/api/v1/organisasjon/:orgnr",
  ({ params }) => {
    const eregResponse = {
      ...eregResponses[params.orgnr],
      organisasjonsnummer: params.orgnr,
    };
    return HttpResponse.json(eregResponse);
  },
);
