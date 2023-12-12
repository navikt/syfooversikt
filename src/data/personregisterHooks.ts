import { SYFOPERSON_ROOT } from '@/apiConstants';
import { useQuery } from '@tanstack/react-query';
import { post } from '@/api/axios';
import { PersonregisterData } from '@/api/types/personregisterTypes';
import { usePersonoversiktQuery } from '@/data/personoversiktHooks';
import { ApiErrorException } from '@/api/errors';
import { FetchPersonregisterFailed } from '@/context/notification/Notifications';
import { useNotifications } from '@/context/notification/NotificationContext';
import { useAsyncError } from '@/data/useAsyncError';
import { useAktivEnhet } from '@/context/aktivEnhet/AktivEnhetContext';

export const personregisterQueryKeys = {
  personregister: (enhetId: string | undefined) => ['personregister', enhetId],
};

export const usePersonregisterQuery = () => {
  const { aktivEnhet } = useAktivEnhet();
  const { data } = usePersonoversiktQuery();
  const { displayNotification, clearNotification } = useNotifications();
  const throwError = useAsyncError();

  const fnrForPersonerListe = data.map((person) => ({ fnr: person.fnr }));

  const fetchPersonregister = () => {
    const personregisterData = post<PersonregisterData[]>(
      `${SYFOPERSON_ROOT}/person/info`,
      fnrForPersonerListe
    );

    return personregisterData || [];
  };

  return useQuery({
    queryKey: personregisterQueryKeys.personregister(aktivEnhet),
    queryFn: fetchPersonregister,
    enabled: false,
    onError: (error) => {
      if (error instanceof ApiErrorException && error.code === 403) {
        throwError(error);
      } else {
        displayNotification(FetchPersonregisterFailed);
      }
    },
    onSuccess: () => {
      clearNotification('fetchPersonregisterFailed');
    },
  });
};
