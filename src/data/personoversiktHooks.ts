import { useQuery } from 'react-query';
import { PersonoversiktStatus } from '@/api/types/personoversiktTypes';
import { SYFOOVERSIKTSRVREST_ROOT } from '@/utils/apiUrlUtil';
import { get } from '@/api/axios';
import { useAktivEnhet } from '@/context/aktivEnhet/AktivEnhetContext';
import { minutesToMillis } from '@/utils/timeUtils';

export const personoversiktQueryKeys = {
  personoversikt: ['personoversikt'],
  personoversiktEnhet: (enhetId?: string) => [
    ...personoversiktQueryKeys.personoversikt,
    enhetId,
  ],
};

export const usePersonoversiktQuery = () => {
  const { aktivEnhet } = useAktivEnhet();

  const fetchPersonoversikt = () => {
    const personoversiktData = get<PersonoversiktStatus[]>(
      `${SYFOOVERSIKTSRVREST_ROOT}/v2/personoversikt/enhet/${aktivEnhet}`
    );
    return personoversiktData || [];
  };

  return useQuery(
    personoversiktQueryKeys.personoversiktEnhet(aktivEnhet),
    fetchPersonoversikt,
    {
      enabled: !!aktivEnhet,
      staleTime: minutesToMillis(5),
    }
  );
};
