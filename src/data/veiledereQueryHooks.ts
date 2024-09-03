import { PERSONTILDELING_ROOT, SYFOVEILEDER_ROOT } from '@/apiConstants';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { VeilederDTO } from '@/api/types/veiledereTypes';
import { VeilederArbeidstaker } from '@/api/types/veilederArbeidstakerTypes';
import { get, post } from '@/api/axios';
import { PersonOversiktStatusDTO } from '@/api/types/personoversiktTypes';
import { useAktivEnhet } from '@/context/aktivEnhet/AktivEnhetContext';
import { personoversiktQueryKeys } from '@/data/personoversiktHooks';
import { useNotifications } from '@/context/notification/NotificationContext';
import {
  FetchAktivVeilederFailed,
  FetchVeiledereFailed,
  TildelVeilederFailed,
} from '@/context/notification/Notifications';
import { useAsyncError } from '@/data/useAsyncError';
import { ApiErrorException } from '@/api/errors';

export const veiledereQueryKeys = {
  veiledereInfo: ['veiledereInfo'],
  veiledere: ['veiledere'],
  veiledereForEnhet: (enhetId?: string) => [
    ...veiledereQueryKeys.veiledere,
    enhetId,
  ],
};

export const useVeiledereQuery = () => {
  const { aktivEnhet } = useAktivEnhet();
  const { displayNotification, clearNotification } = useNotifications();
  const throwError = useAsyncError();

  const fetchVeiledere = () =>
    get<VeilederDTO[]>(`${SYFOVEILEDER_ROOT}/veiledere?enhetNr=${aktivEnhet}`);

  return useQuery({
    queryKey: veiledereQueryKeys.veiledereForEnhet(aktivEnhet),
    queryFn: fetchVeiledere,
    enabled: !!aktivEnhet,
    onError: (error) => {
      if (error instanceof ApiErrorException && error.code === 403) {
        throwError(error);
      } else {
        displayNotification(FetchVeiledereFailed);
      }
    },
    onSuccess: () => {
      clearNotification('fetchVeiledereFailed');
    },
  });
};

export const useAktivVeilederQuery = () => {
  const { displayNotification, clearNotification } = useNotifications();
  const throwError = useAsyncError();

  const fetchVeilederInfo = () =>
    get<VeilederDTO>(`${SYFOVEILEDER_ROOT}/veiledere/self`);

  return useQuery({
    queryKey: veiledereQueryKeys.veiledereInfo,
    queryFn: fetchVeilederInfo,
    onError: (error) => {
      if (error instanceof ApiErrorException && error.code === 403) {
        throwError(error);
      } else {
        displayNotification(FetchAktivVeilederFailed);
      }
    },
    onSuccess: () => {
      clearNotification('fetchAktivVeilederFailed');
    },
  });
};

export const useTildelVeileder = () => {
  const queryClient = useQueryClient();
  const { aktivEnhet } = useAktivEnhet();
  const { displayNotification, clearNotification } = useNotifications();
  const throwError = useAsyncError();

  const path = `${PERSONTILDELING_ROOT}/registrer`;

  const postTildelVeileder = (liste: VeilederArbeidstaker[]) =>
    post(path, { tilknytninger: liste });

  return useMutation({
    mutationFn: postTildelVeileder,
    onMutate: (liste: VeilederArbeidstaker[]) => {
      clearNotification('tildelVeilederFailed');

      const previousPersonoversikt: PersonOversiktStatusDTO[] =
        queryClient.getQueryData(
          personoversiktQueryKeys.personoversiktEnhet(aktivEnhet)
        ) || [];
      const optimisticlyUpdatedPersonoversikt: PersonOversiktStatusDTO[] = previousPersonoversikt.map(
        (person) => {
          const tilknytning = liste.find(
            (tilknytning) => tilknytning.fnr === person.fnr
          );

          return {
            ...person,
            veilederIdent: tilknytning?.veilederIdent || person.veilederIdent,
          };
        }
      );

      queryClient.setQueryData(
        personoversiktQueryKeys.personoversiktEnhet(aktivEnhet),
        () => optimisticlyUpdatedPersonoversikt
      );

      return { previousPersonoversikt };
    },
    onError: (error, newVeileder, context) => {
      if (error instanceof ApiErrorException && error.code === 403) {
        throwError(error);
      } else {
        displayNotification(TildelVeilederFailed);
      }
      queryClient.setQueryData(
        personoversiktQueryKeys.personoversiktEnhet(aktivEnhet),
        context?.previousPersonoversikt || []
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries(
        personoversiktQueryKeys.personoversiktEnhet(aktivEnhet)
      );
    },
  });
};
