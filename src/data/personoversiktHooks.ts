import { useQuery } from '@tanstack/react-query';
import {
  PersonOversiktStatusDTO,
  PersonOversiktUbehandletStatusDTO,
} from '@/api/types/personoversiktTypes';
import { get } from '@/api/axios';
import { useAktivEnhet } from '@/context/aktivEnhet/AktivEnhetContext';
import { useNotifications } from '@/context/notification/NotificationContext';
import { FetchPersonoversiktFailed } from '@/context/notification/Notifications';
import { ApiErrorException } from '@/api/errors';
import { useAsyncError } from '@/data/useAsyncError';
import { minutesToMillis } from '@/utils/timeUtils';
import { useMemo } from 'react';
import { PERSONOVERSIKT_ROOT } from '@/apiConstants';

const isUbehandlet = (ubehandletStatus: PersonOversiktUbehandletStatusDTO) => {
  return Object.values(ubehandletStatus).some((value) => value);
};

const filteredPersonOversiktStatusList = (
  personOversiktStatusList: PersonOversiktStatusDTO[]
): PersonOversiktStatusDTO[] => {
  return personOversiktStatusList.filter((personOversiktStatus) => {
    const ubehandletStatus: PersonOversiktUbehandletStatusDTO = {
      aktivitetskravVurderStansUbehandlet:
        personOversiktStatus.aktivitetskravVurderStansUbehandlet,
      behandlerdialogUbehandlet: personOversiktStatus.behandlerdialogUbehandlet,
      dialogmotekandidat: personOversiktStatus.dialogmotekandidat,
      dialogmotesvarUbehandlet: personOversiktStatus.dialogmotesvarUbehandlet,
      trengerOppfolging: personOversiktStatus.trengerOppfolging,
      motebehovUbehandlet: personOversiktStatus.motebehovUbehandlet,
      oppfolgingsplanLPSBistandUbehandlet:
        personOversiktStatus.oppfolgingsplanLPSBistandUbehandlet,
      aktivitetskravActive: personOversiktStatus.aktivitetskravActive,
      behandlerBerOmBistandUbehandlet:
        personOversiktStatus.behandlerBerOmBistandUbehandlet,
      arbeidsuforhetVurderAvslagUbehandlet:
        personOversiktStatus.arbeidsuforhetVurderAvslagUbehandlet,
      arbeidsuforhetvurdering: personOversiktStatus.arbeidsuforhetvurdering,
      friskmeldingTilArbeidsformidlingFom:
        personOversiktStatus.friskmeldingTilArbeidsformidlingFom,
    };

    return isUbehandlet(ubehandletStatus);
  });
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
      `${PERSONOVERSIKT_ROOT}/enhet/${aktivEnhet}`
    );
    return personoversiktData || [];
  };

  const query = useQuery({
    queryKey: personoversiktQueryKeys.personoversiktEnhet(aktivEnhet),
    queryFn: fetchPersonoversikt,
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
  });

  return {
    ...query,
    data: useMemo(
      () => (query.data ? filteredPersonOversiktStatusList(query.data) : []),
      [query.data]
    ),
  };
};
