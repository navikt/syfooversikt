import { SYFOBEHANDLENDEENHET_ROOT } from '@/apiConstants';
import { useQuery } from '@tanstack/react-query';
import { get } from '@/api/axios';
import { useAktivEnhet } from '@/context/aktivEnhet/AktivEnhetContext';

const muligeOppfolgingsenhetQueryKeys = {
  muligeOppfolgingsenheter: (enhetId?: string) => [
    'muligeOppfolgingsenheter',
    enhetId,
  ],
};

export function useGetMuligeOppfolgingsenheter() {
  const { aktivEnhet } = useAktivEnhet();
  const path = `${SYFOBEHANDLENDEENHET_ROOT}/tilordningsenheter/${aktivEnhet}`;

  const getVeilederBrukerKnytning = () => get<Enhet[]>(path);

  return useQuery({
    queryKey: muligeOppfolgingsenhetQueryKeys.muligeOppfolgingsenheter(
      aktivEnhet
    ),
    queryFn: getVeilederBrukerKnytning,
    enabled: !!aktivEnhet,
  });
}

export interface Enhet {
  enhetId: string;
  navn: string;
}
