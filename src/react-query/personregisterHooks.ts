import { SYFOPERSONREST_ROOT } from '@/utils/apiUrlUtil';
import { useQuery } from 'react-query';
import { post } from '@/api/axios';
import { PersonregisterData } from '@/api/types/personregisterTypes';
import { usePersonoversiktQuery } from '@/react-query/personoversiktHooks';

export const personregisterQueryKeys = {
  personregister: 'personregister',
};

export const usePersonregisterQuery = () => {
  const personoversiktQuery = usePersonoversiktQuery();

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
  });
};
