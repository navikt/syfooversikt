import { useMutation, useQuery } from '@tanstack/react-query';
import {
  isUbehandlet,
  PersonOversiktStatusDTO,
} from '@/api/types/personoversiktTypes';
import { get, post } from '@/api/axios';
import { useAktivEnhet } from '@/context/aktivEnhet/AktivEnhetContext';
import { useNotifications } from '@/context/notification/NotificationContext';
import { FetchPersonoversiktFailed } from '@/context/notification/Notifications';
import { ApiErrorException } from '@/api/errors';
import { useAsyncError } from '@/data/useAsyncError';
import { minutesToMillis } from '@/utils/timeUtils';
import { useMemo } from 'react';
import { PERSONOVERSIKT_ROOT } from '@/apiConstants';
import { SokDTO } from '@/api/types/sokDTO';
import { useGetFeatureToggles } from '@/data/unleash/unleashQueryHooks';

function filterIsUbehandlet(
  personOversiktStatusList: PersonOversiktStatusDTO[],
  isKartleggingssporsmalEnabled: boolean
): PersonOversiktStatusDTO[] {
  return personOversiktStatusList.filter((personStatus) =>
    isUbehandlet(personStatus, isKartleggingssporsmalEnabled)
  );
}

export const personoversiktQueryKeys = {
  personoversikt: ['personoversikt'],
  personoversiktEnhet: (enhetId?: string) => [
    ...personoversiktQueryKeys.personoversikt,
    enhetId,
  ],
};

export const useGetPersonstatusQuery = () => {
  const { aktivEnhet } = useAktivEnhet();
  const { toggles } = useGetFeatureToggles();
  const { displayNotification, clearNotification } = useNotifications();
  const throwError = useAsyncError();

  const fetchPersonoversikt = () => {
    const personoversiktData = get<PersonOversiktStatusDTO[]>(
      `${PERSONOVERSIKT_ROOT}/enhet/${aktivEnhet}`
    );
    return personoversiktData || [];
  };

  const query = useQuery({
    queryKey: personoversiktQueryKeys.personoversiktEnhet(aktivEnhet),
    queryFn: fetchPersonoversikt,
    enabled: !!aktivEnhet,
    staleTime: minutesToMillis(5),
    meta: {
      handleError: (error: Error) => {
        if (error instanceof ApiErrorException && error.code === 403) {
          throwError(error);
        } else {
          displayNotification(FetchPersonoversiktFailed);
        }
      },
      handleSuccess: () => clearNotification('fetchPersonoversiktFailed'),
    },
  });

  return {
    ...query,
    data: useMemo(
      () =>
        query.data
          ? filterIsUbehandlet(
              query.data,
              toggles.isKartleggingssporsmalEnabled
            )
          : [],
      [query.data, toggles.isKartleggingssporsmalEnabled]
    ),
  };
};

export const useSokPerson = () => {
  const path = `${PERSONOVERSIKT_ROOT}/search`;
  const postSok = (sokDTO: SokDTO) =>
    post<PersonOversiktStatusDTO[]>(path, sokDTO);

  const mutation = useMutation({
    mutationFn: postSok,
  });

  return {
    ...mutation,
    data: mutation.data || [],
  };
};
