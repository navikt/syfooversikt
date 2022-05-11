import { useQuery } from 'react-query';
import { post } from '@/api/axios';
import { UNLEASH_ROOT } from '@/apiConstants';
import { ToggleNames, Toggles } from '@/data/unleash/types/unleash_types';
import { useAktivVeilederQuery } from '@/data/veiledereQueryHooks';
import { useAktivEnhet } from '@/context/aktivEnhet/AktivEnhetContext';

export const unleashQueryKeys = {
  toggles: (valgtEnhet: string, veilederIdent: string) => [
    'toggles',
    valgtEnhet,
    veilederIdent,
  ],
};

export const useFeatureToggles = () => {
  const { data: veilederInfo } = useAktivVeilederQuery();
  const { aktivEnhet } = useAktivEnhet();
  const veilederIdent = veilederInfo?.ident || '';
  const path = `${UNLEASH_ROOT}/toggles?valgtEnhet=${aktivEnhet}${
    veilederIdent ? `&userId=${veilederIdent}` : ''
  }`;
  const fetchToggles = () =>
    post<Toggles>(path, {
      toggles: Object.values(ToggleNames),
    });
  const query = useQuery(
    unleashQueryKeys.toggles(aktivEnhet || '', veilederIdent),
    fetchToggles,
    {
      enabled: !!aktivEnhet,
    }
  );
  const isFeatureEnabled = (toggle: ToggleNames): boolean => {
    return query.data ? query.data[toggle] : false;
  };

  return {
    ...query,
    isFeatureEnabled,
  };
};
