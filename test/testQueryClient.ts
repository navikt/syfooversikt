import { QueryClient } from '@tanstack/react-query';
import { unleashQueryKeys } from '@/data/unleash/unleashQueryHooks';
import { aktivEnhetMock } from '@/mocks/data/aktivEnhetMock';
import { unleashMock } from '@/mocks/mockUnleash';
import { personoversiktQueryKeys } from '@/data/personoversiktHooks';
import { personoversiktEnhetMock } from '@/mocks/data/personoversiktEnhetMock';
import { veilederMock } from '@/mocks/syfoveileder/veilederMock';
import { veiledereQueryKeys } from '@/data/veiledereQueryHooks';
import { veiledereMock } from '@/mocks/data/veiledereMock';
import { personregisterQueryKeys } from '@/data/personregisterHooks';
import { personInfoMock } from '@/mocks/data/personInfoMock';

export const testQueryClient = () =>
  new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

export const getQueryClientWithMockdata = (): QueryClient => {
  const queryClient = testQueryClient();
  queryClient.setQueryData(
    veiledereQueryKeys.veiledereInfo,
    () => veilederMock
  );
  queryClient.setQueryData(
    unleashQueryKeys.toggles(aktivEnhetMock.aktivEnhet, veilederMock.ident),
    () => unleashMock
  );
  queryClient.setQueryData(
    personoversiktQueryKeys.personoversiktEnhet(aktivEnhetMock.aktivEnhet),
    () => personoversiktEnhetMock
  );
  queryClient.setQueryData(
    personregisterQueryKeys.personregister(aktivEnhetMock.aktivEnhet),
    () => personInfoMock
  );
  queryClient.setQueryData(
    veiledereQueryKeys.veiledereForEnhet(aktivEnhetMock.aktivEnhet),
    () => veiledereMock
  );
  return queryClient;
};
