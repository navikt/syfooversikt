import { SYFOPERSON_ROOT } from '@/apiConstants';
import { useQuery } from '@tanstack/react-query';
import { post } from '@/api/axios';
import { PersonregisterData } from '@/api/types/personregisterTypes';
import { usePersonoversiktQuery } from '@/data/personoversiktHooks';
import { ApiErrorException } from '@/api/errors';
import { FetchPersonregisterFailed } from '@/context/notification/Notifications';
import { useNotifications } from '@/context/notification/NotificationContext';
import { useAsyncError } from '@/data/useAsyncError';
import { useEffect } from 'react';

export const personregisterQueryKeys = {
  personregister: ['personregister'],
};

export const usePersonregisterQuery = () => {
  const personoversiktQuery = usePersonoversiktQuery();
  const { displayNotification, clearNotification } = useNotifications();
  const throwError = useAsyncError();

  const fnrForPersonerUtenNavnListe =
    personoversiktQuery.data &&
    personoversiktQuery.data
      .filter((p) => !p.navn)
      .map((person) => ({
        fnr: person.fnr,
      }));

  const fetchPersonregister = () => {
    const personregisterData = post<PersonregisterData[]>(
      `${SYFOPERSON_ROOT}/person/info`,
      fnrForPersonerUtenNavnListe || []
    );

    return personregisterData || [];
  };

  const query = useQuery<PersonregisterData[], ApiErrorException>({
    queryKey: personregisterQueryKeys.personregister,
    queryFn: fetchPersonregister,
    enabled: fnrForPersonerUtenNavnListe.length > 0,
  });

  useEffect(() => {
    if (query.isSuccess) {
      clearNotification('fetchPersonregisterFailed');
    }
  }, [query.isSuccess, clearNotification]);

  useEffect(() => {
    if (query.isError) {
      if (query.error.code === 403) {
        throwError(query.error);
      } else {
        displayNotification(FetchPersonregisterFailed);
      }
    }
  }, [throwError, query.isError, query.error, displayNotification]);

  return query;
};
