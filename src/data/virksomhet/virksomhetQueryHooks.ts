import { EregOrganisasjonResponseDTO } from "@/data/virksomhet/EregOrganisasjonResponseDTO.ts";
import { EREG_ROOT, SYFOPERSON_ROOT } from "@/apiConstants";
import { minutesToMillis } from "@/utils/timeUtils";
import { useQueries, useQuery } from "@tanstack/react-query";
import { get } from "@/api/axios";
import {
  NaringskodeHierarki,
  NaringskodeStandard,
} from "@/data/virksomhet/Naringskode.ts";

export const virksomhetQueryKeys = {
  virksomhet: (virksomhetsnummer: string, inkluderHierarki = false) => [
    "virksomhet",
    virksomhetsnummer,
    inkluderHierarki,
  ],
};

export const bransjeQueryKeys = {
  bransje: (naringskode: string, standard: NaringskodeStandard) => [
    "bransje",
    naringskode,
    standard,
  ],
};

function fetchVirksomhet(virksomhetsnummer: string, inkluderHierarki: boolean) {
  const hierarchyQuery = inkluderHierarki ? "?inkluderHierarki=true" : "";
  return get<EregOrganisasjonResponseDTO>(
    `${EREG_ROOT}/organisasjon/${virksomhetsnummer}${hierarchyQuery}`,
  );
}

export function useVirksomheterQueries(
  virksomhetnumre: string[],
  inkluderHierarki = false,
) {
  const virksomhetsnummerList = Array.from(new Set(virksomhetnumre)).filter(
    (nummer) => nummer !== undefined && nummer !== null && nummer !== "",
  );

  return useQueries({
    queries: virksomhetsnummerList.map((nummer) => ({
      queryKey: virksomhetQueryKeys.virksomhet(nummer, inkluderHierarki),
      queryFn: () => fetchVirksomhet(nummer, inkluderHierarki),
      enabled: !!nummer,
      staleTime: minutesToMillis(60 * 12),
    })),
    combine: (queries) => ({
      data: queries
        .map((query) => query.data)
        .filter((data) => data !== undefined),
      isPending: queries.some((query) => query.isPending),
      isError: queries.some((query) => query.isError),
    }),
  });
}

function fetchNaringskode(naringskode: string, standard: NaringskodeStandard) {
  return get<NaringskodeHierarki>(
    `${SYFOPERSON_ROOT}/naringskode/${naringskode}?standard=${standard}`,
  );
}

export function useNaringskodeQuery(
  naringskode: string,
  standard: NaringskodeStandard,
) {
  return useQuery({
    queryKey: bransjeQueryKeys.bransje(naringskode, standard),
    queryFn: () => fetchNaringskode(naringskode, standard),
    staleTime: minutesToMillis(60 * 12),
    enabled: !!naringskode,
  });
}

export function useNaringskodeQueries(
  codes: { naringskode: string; standard: NaringskodeStandard }[],
) {
  const queries = codes.map((code) => {
    return {
      queryKey: bransjeQueryKeys.bransje(code.naringskode, code.standard),
      queryFn: () => fetchNaringskode(code.naringskode, code.standard),
      staleTime: minutesToMillis(60 * 12),
    };
  });

  return useQueries({
    queries: queries,
    combine: (queries) => {
      return {
        data: queries
          .map((query) => query.data)
          .filter((data) => data !== undefined),
        isPending: queries.some((query) => query.isPending),
        isError: queries.some((query) => query.isError),
      };
    },
  });
}
