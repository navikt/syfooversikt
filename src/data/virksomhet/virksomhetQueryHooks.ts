import {
  EregOrganisasjonResponseDTO,
  getVirksomhetsnavn,
} from '@/data/virksomhet/EregVirksomhetsnavn';
import { EREG_ROOT } from '@/apiConstants';
import { minutesToMillis } from '@/utils/timeUtils';
import { useQueries } from '@tanstack/react-query';
import { get } from '@/api/axios';

export const virksomhetQueryKeys = {
  virksomhet: (virksomhetsnummer: string) => ['virksomhet', virksomhetsnummer],
};

export const useVirksomheterQueries = (virksomhetnumre: string[]) => {
  const queries = virksomhetnumre.map((nummer: string) => {
    const fetchVirksomhet = () =>
      get<EregOrganisasjonResponseDTO>(`${EREG_ROOT}/organisasjon/${nummer}`);
    return {
      queryKey: virksomhetQueryKeys.virksomhet(nummer),
      queryFn: fetchVirksomhet,
      enabled: !!nummer,
      staleTime: minutesToMillis(60 * 12),
    };
  });

  return useQueries({ queries }).map((query) => {
    if (query.isLoading) {
      return 'Henter...';
    }
    return query.data && getVirksomhetsnavn(query.data);
  });
};
