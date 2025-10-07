import { useQuery } from '@tanstack/react-query';
import { UNLEASH_ROOT } from '@/apiConstants';
import { defaultToggles, Toggles } from '@/data/unleash/types/unleash_types';
import { useAktivVeilederQuery } from '@/data/veiledereQueryHooks';
import { useAktivEnhet } from '@/context/aktivEnhet/AktivEnhetContext';
import { get } from '@/api/axios';

export const unleashQueryKeys = {
  toggles: (valgtEnhet: string, veilederIdent: string) => [
    'toggles',
    valgtEnhet,
    veilederIdent,
  ],
};

export function useGetFeatureToggles() {
  const { data: veilederInfo } = useAktivVeilederQuery();
  const { aktivEnhet } = useAktivEnhet();
  const veilederIdent = veilederInfo?.ident || '';
  const path = `${UNLEASH_ROOT}/toggles`;
  const queryParameters = `?enhetId=${aktivEnhet}${
    veilederIdent ? `&veilederId=${veilederIdent}` : ''
  }`;
  const fetchToggles = () => get<Toggles>(path + queryParameters);
  const {
    data: togglesResponse,
    refetch: refreshToggles,
    isLoading,
    isSuccess,
  } = useQuery({
    queryKey: unleashQueryKeys.toggles(aktivEnhet || '', veilederIdent),
    queryFn: fetchToggles,
    enabled: !!aktivEnhet || !!veilederIdent,
  });
  const toggles = togglesResponse ?? defaultToggles;

  return {
    toggles,
    refreshToggles,
    isLoading,
    isSuccess,
  };
}
