import { SYFOPERSON_ROOT } from "@/apiConstants";
import { useQuery } from "@tanstack/react-query";
import { post } from "@/api/axios";
import { PersonSkjermingskode } from "@/api/types/personregisterTypes";
import { useGetPersonstatusQuery } from "@/data/personoversiktHooks";
import { FetchPersonregisterFailed } from "@/context/notification/Notifications";
import { useNotifications } from "@/context/notification/NotificationContext";
import { useAktivEnhet } from "@/context/aktivEnhet/AktivEnhetContext";

export const personSkjermingskodeQueryKeys = {
  personSkjermingskode: (enhetId: string | undefined) => [
    "personSkjermingskode",
    enhetId,
  ],
};

export const useGetPersonSkjermingskodeQuery = () => {
  const { aktivEnhet } = useAktivEnhet();
  const { data } = useGetPersonstatusQuery();
  const { displayNotification, clearNotification } = useNotifications();

  const fnrForPersonerListe = data.map((person) => ({ fnr: person.fnr }));

  const fetchPersonSkjermingskode = () => {
    const personSkjermingskode = post<PersonSkjermingskode[]>(
      `${SYFOPERSON_ROOT}/person/info`,
      fnrForPersonerListe,
    );

    return personSkjermingskode || [];
  };

  return useQuery({
    queryKey: personSkjermingskodeQueryKeys.personSkjermingskode(aktivEnhet),
    queryFn: fetchPersonSkjermingskode,
    enabled: !!aktivEnhet && fnrForPersonerListe.length > 0,
    meta: {
      handleError: () => {
        displayNotification(FetchPersonregisterFailed);
      },
      handleSuccess: () => clearNotification("fetchPersonregisterFailed"),
    },
  });
};
