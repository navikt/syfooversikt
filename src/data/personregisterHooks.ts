import { SYFOPERSON_ROOT } from '@/apiConstants';
import { useQuery } from '@tanstack/react-query';
import { post } from '@/api/axios';
import { PersonSkjermingskode } from '@/api/types/personregisterTypes';
import { useGetPersonstatusQuery } from '@/data/personoversiktHooks';
import { ApiErrorException } from '@/api/errors';
import { FetchPersonregisterFailed } from '@/context/notification/Notifications';
import { useNotifications } from '@/context/notification/NotificationContext';
import { useAsyncError } from '@/data/useAsyncError';
import { useAktivEnhet } from '@/context/aktivEnhet/AktivEnhetContext';

export const personSkjermingskodeQueryKeys = {
  personSkjermingskode: (enhetId: string | undefined) => [
    'personSkjermingskode',
    enhetId,
  ],
};

export const useGetPersonSkjermingskodeQuery = () => {
  const { aktivEnhet } = useAktivEnhet();
  const { data } = useGetPersonstatusQuery();
  const { displayNotification, clearNotification } = useNotifications();
  const throwError = useAsyncError();

  const fnrForPersonerListe = data.map((person) => ({ fnr: person.fnr }));

  const fetchPersonSkjermingskode = () => {
    const personSkjermingskode = post<PersonSkjermingskode[]>(
      `${SYFOPERSON_ROOT}/person/info`,
      fnrForPersonerListe
    );

    return personSkjermingskode || [];
  };

  return useQuery({
    queryKey: personSkjermingskodeQueryKeys.personSkjermingskode(aktivEnhet),
    queryFn: fetchPersonSkjermingskode,
    enabled: !!aktivEnhet && fnrForPersonerListe.length > 0,
    meta: {
      handleError: (error: Error) => {
        if (error instanceof ApiErrorException && error.code === 403) {
          throwError(error);
        } else {
          displayNotification(FetchPersonregisterFailed);
        }
      },
      handleSuccess: () => clearNotification('fetchPersonregisterFailed'),
    },
  });
};
