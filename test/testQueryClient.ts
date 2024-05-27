import { QueryClient } from '@tanstack/react-query';
import { unleashQueryKeys } from '@/data/unleash/unleashQueryHooks';
import { aktivEnhetMock } from '../mock/data/aktivEnhetMock';
import { unleashMock } from '../mock/mockUnleash';
import { personoversiktQueryKeys } from '@/data/personoversiktHooks';
import { personoversiktEnhetMock } from '../mock/data/personoversiktEnhetMock';

export const testQueryClient = () =>
  new QueryClient({
    defaultOptions: { queries: { retry: false } },
    logger: {
      log: console.log,
      warn: console.warn,
      error: () => {
        /*empty*/
      },
    },
  });

export const getQueryClientWithMockdata = (): QueryClient => {
  const queryClient = testQueryClient();

  queryClient.setQueryData(
    unleashQueryKeys.toggles(aktivEnhetMock.aktivEnhet, ''),
    () => unleashMock
  );

  queryClient.setQueryData(
    personoversiktQueryKeys.personoversiktEnhet(aktivEnhetMock.aktivEnhet),
    () => personoversiktEnhetMock.slice(0, 3)
  );
  return queryClient;
};
