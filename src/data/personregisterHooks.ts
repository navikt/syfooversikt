import { SYFOPERSONREST_ROOT } from '@/utils/apiUrlUtil';
import { useQuery } from 'react-query';
import { post } from '@/api/axios';
import { PersonregisterData } from '@/api/types/personregisterTypes';
import { usePersonoversiktQuery } from '@/data/personoversiktHooks';
import { ApiErrorException } from '@/api/errors';
import { FetchPersonregisterFailed } from '@/context/notification/Notifications';
import { useNotifications } from '@/context/notification/NotificationContext';
import { useAsyncError } from '@/data/useAsyncError';

export const personregisterQueryKeys = {
  personregister: 'personregister',
};

export const usePersonregisterQuery = () => {
  const personoversiktQuery = usePersonoversiktQuery();
  const { displayNotification, clearNotification } = useNotifications();
  const throwError = useAsyncError();

  const fnrListe =
    personoversiktQuery.data &&
    personoversiktQuery.data
      .filter((p) => !p.navn)
      .map((person) => ({
        fnr: person.fnr,
      }));

  const fetchPersonregister = () => {
    const personregisterData = post<PersonregisterData[]>(
      `${SYFOPERSONREST_ROOT}/v2/person/info`,
      fnrListe || []
    );

    return personregisterData || [];
  };

  return useQuery(personregisterQueryKeys.personregister, fetchPersonregister, {
    enabled: !!fnrListe,
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
