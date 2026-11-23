import { EregOrganisasjonResponseDTO } from "@/data/virksomhet/EregOrganisasjonResponseDTO.ts";
import { EREG_ROOT } from "@/apiConstants";
import { minutesToMillis } from "@/utils/timeUtils";
import { useQueries } from "@tanstack/react-query";
import { get } from "@/api/axios";

export const virksomhetQueryKeys = {
  virksomhet: (virksomhetsnummer: string, inkluderHierarki = false) => [
    "virksomhet",
    virksomhetsnummer,
    inkluderHierarki,
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
