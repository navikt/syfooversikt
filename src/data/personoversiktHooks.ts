import { useQuery } from '@tanstack/react-query';
import {
  AktivitetskravStatus,
  PersonOversiktStatusDTO,
} from '@/api/types/personoversiktTypes';
import { SYFOOVERSIKTSRVREST_ROOT } from '@/utils/apiUrlUtil';
import { get } from '@/api/axios';
import { useAktivEnhet } from '@/context/aktivEnhet/AktivEnhetContext';
import { useNotifications } from '@/context/notification/NotificationContext';
import { FetchPersonoversiktFailed } from '@/context/notification/Notifications';
import { ApiErrorException } from '@/api/errors';
import { useAsyncError } from '@/data/useAsyncError';
import { minutesToMillis } from '@/utils/timeUtils';
import { useMemo } from 'react';
import { useFeatureToggles } from '@/data/unleash/unleashQueryHooks';
import { ToggleNames } from '@/data/unleash/types/unleash_types';

const isUbehandlet = (personOversiktStatus: PersonOversiktStatusDTO) => {
  return (
    personOversiktStatus.motebehovUbehandlet ||
    personOversiktStatus.oppfolgingsplanLPSBistandUbehandlet ||
    personOversiktStatus.dialogmotesvarUbehandlet ||
    personOversiktStatus.dialogmotekandidat
  );
};

const needsAktivitetskravVurdering = (
  personOversiktStatus: PersonOversiktStatusDTO
) => {
  return (
    personOversiktStatus.aktivitetskrav === AktivitetskravStatus.NY ||
    personOversiktStatus.aktivitetskrav === AktivitetskravStatus.AVVENT
  );
};

const filteredPersonOversiktStatusList = (
  personOversiktStatusList: PersonOversiktStatusDTO[],
  isAktivitetskravTurnedOn: boolean
): PersonOversiktStatusDTO[] => {
  return personOversiktStatusList.filter(
    (personOversiktStatus) =>
      isUbehandlet(personOversiktStatus) ||
      (isAktivitetskravTurnedOn &&
        needsAktivitetskravVurdering(personOversiktStatus))
  );
};

export const personoversiktQueryKeys = {
  personoversikt: ['personoversikt'],
  personoversiktEnhet: (enhetId?: string) => [
    ...personoversiktQueryKeys.personoversikt,
    enhetId,
  ],
};

export const usePersonoversiktQuery = () => {
  const { aktivEnhet } = useAktivEnhet();
  const { displayNotification, clearNotification } = useNotifications();
  const throwError = useAsyncError();

  const { isFeatureEnabled } = useFeatureToggles();
  const isAktivitetskravTurnedOn = isFeatureEnabled(ToggleNames.aktivitetskrav);

  const fetchPersonoversikt = () => {
    const personoversiktData = get<PersonOversiktStatusDTO[]>(
      `${SYFOOVERSIKTSRVREST_ROOT}/v2/personoversikt/enhet/${aktivEnhet}`
    );
    return personoversiktData || [];
  };

  const query = useQuery(
    personoversiktQueryKeys.personoversiktEnhet(aktivEnhet),
    fetchPersonoversikt,
    {
      enabled: !!aktivEnhet,
      staleTime: minutesToMillis(5),
      onError: (error) => {
        if (error instanceof ApiErrorException && error.code === 403) {
          throwError(error);
        } else {
          displayNotification(FetchPersonoversiktFailed);
        }
      },
      onSuccess: () => {
        clearNotification('fetchPersonoversiktFailed');
      },
    }
  );

  return {
    ...query,
    data: useMemo(
      () =>
        query.data
          ? filteredPersonOversiktStatusList(
              query.data,
              isAktivitetskravTurnedOn
            )
          : [],
      [query.data, isAktivitetskravTurnedOn]
    ),
  };
};
