import { useMutation } from "@tanstack/react-query";
import { post } from "@/api/axios";
import { MODIACONTEXTHOLDER_ROOT } from "@/apiConstants";
import { EventType } from "@/data/modiacontext/modiacontextTypes.ts";

export const useAktivBrukerMutation = () =>
  useMutation({
    mutationFn: (fnr: string) =>
      post(`${MODIACONTEXTHOLDER_ROOT}/context`, {
        verdi: fnr,
        eventType: EventType.NY_AKTIV_BRUKER,
      }),
  });
