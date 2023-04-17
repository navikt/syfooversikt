import { post } from '@/api/axios';
import { MODIACONTEXTHOLDER_ROOT } from '@/apiConstants';
import { useMutation } from '@tanstack/react-query';

const NY_AKTIV_BRUKER = 'NY_AKTIV_BRUKER';

export const useAktivBruker = () =>
  useMutation({
    mutationFn: (fnr: string) =>
      post(`${MODIACONTEXTHOLDER_ROOT}/context`, {
        verdi: fnr,
        eventType: NY_AKTIV_BRUKER,
      }),
  });
