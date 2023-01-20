import { useQuery } from '@tanstack/react-query';
import {
  AktivitetskravStatus,
  MoteStatusType,
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

const isUbehandlet = (personOversiktStatus: PersonOversiktStatusDTO) => {
  return (
    personOversiktStatus.motebehovUbehandlet ||
    personOversiktStatus.oppfolgingsplanLPSBistandUbehandlet ||
    personOversiktStatus.dialogmotesvarUbehandlet
  );
};

const isKandidatAndNotStartedDialogmote = (
  personOversiktStatus: PersonOversiktStatusDTO
) => {
  return (
    personOversiktStatus.dialogmotekandidat &&
    (!personOversiktStatus.motestatus ||
      personOversiktStatus.motestatus == MoteStatusType.AVLYST)
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
  personOversiktStatusList: PersonOversiktStatusDTO[]
): PersonOversiktStatusDTO[] => {
  return personOversiktStatusList.filter(
    (personOversiktStatus) =>
      isUbehandlet(personOversiktStatus) ||
      isKandidatAndNotStartedDialogmote(personOversiktStatus) ||
      needsAktivitetskravVurdering(personOversiktStatus)
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
      () => (query.data ? filteredPersonOversiktStatusList(query.data) : []),
      [query.data]
    ),
  };
};
