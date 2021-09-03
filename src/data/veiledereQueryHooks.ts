import {
  SYFOOVERSIKTSRVREST_ROOT,
  SYFOVEILEDER_ROOT,
} from '@/utils/apiUrlUtil';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Veileder } from '@/api/types/veiledereTypes';
import { VeilederArbeidstaker } from '@/api/types/veilederArbeidstakerTypes';
import { get, post } from '@/api/axios';
import { VeilederinfoDTO } from '@/api/types/veilederinfoTypes';
import { PersonoversiktStatus } from '@/api/types/personoversiktTypes';
import { useAktivEnhet } from '@/context/aktivEnhet/AktivEnhetContext';
import { personoversiktQueryKeys } from '@/data/personoversiktHooks';

export const veiledereQueryKeys = {
  veiledereInfo: 'veiledereInfo',
  veiledere: ['veiledere'],
  veiledereForEnhet: (enhetId?: string) => [
    ...veiledereQueryKeys.veiledere,
    enhetId,
  ],
};

export const useVeiledereQuery = () => {
  const { aktivEnhet } = useAktivEnhet();

  const fetchVeiledere = () =>
    get<Veileder[]>(`${SYFOVEILEDER_ROOT}/v2/veiledere/enhet/${aktivEnhet}`);

  return useQuery(
    veiledereQueryKeys.veiledereForEnhet(aktivEnhet),
    fetchVeiledere,
    {
      enabled: !!aktivEnhet,
    }
  );
};

export const useAktivVeilederQuery = () => {
  const fetchVeilederInfo = () =>
    get<VeilederinfoDTO>(`${SYFOVEILEDER_ROOT}/v2/veileder/self`);

  return useQuery(veiledereQueryKeys.veiledereInfo, fetchVeilederInfo);
};

export const useTildelVeileder = () => {
  const queryClient = useQueryClient();
  const { aktivEnhet } = useAktivEnhet();

  const path = `${SYFOOVERSIKTSRVREST_ROOT}/v2/persontildeling/registrer`;

  const postTildelVeileder = (liste: VeilederArbeidstaker[]) =>
    post(path, { tilknytninger: liste });

  return useMutation(postTildelVeileder, {
    onMutate: (liste: VeilederArbeidstaker[]) => {
      const previousPersonoversikt: PersonoversiktStatus[] =
        queryClient.getQueryData(
          personoversiktQueryKeys.personoversiktEnhet(aktivEnhet)
        ) || [];
      const optimisticlyUpdatedPersonoversikt: PersonoversiktStatus[] = previousPersonoversikt.map(
        (person) => {
          const tilknytning = liste.find(
            (tilknytning) => tilknytning.fnr === person.fnr
          );

          return {
            ...person,
            enhet: tilknytning?.enhet || person.enhet,
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
    onError: (err, newTodo, context) => {
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
