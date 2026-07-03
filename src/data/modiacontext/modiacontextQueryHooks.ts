import { MODIACONTEXTHOLDER_ROOT } from "@/apiConstants";
import { get } from "@/api/axios";
import { AktivBrukerDTO } from "@/data/modiacontext/modiacontextTypes";
import { useQuery } from "@tanstack/react-query";
import { minutesToMillis } from "@/utils/timeUtils.ts";

export const modiacontextQueryKeys = {
  aktivbruker: ["aktivbruker"],
};

export function useAktivBruker() {
  const path = `${MODIACONTEXTHOLDER_ROOT}/context/aktivbruker`;
  const fetchAktivBruker = () => get<AktivBrukerDTO>(path);
  return useQuery({
    queryKey: modiacontextQueryKeys.aktivbruker,
    queryFn: fetchAktivBruker,
    staleTime: minutesToMillis(60 * 12),
  });
}
